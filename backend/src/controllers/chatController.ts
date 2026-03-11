import { Request, Response } from "express";
import { z } from "zod";
import { pool } from "../db/client";
import { buildPrompt } from "../services/promptService";
import { retrieveKnowledge } from "../services/ragService";
import { generateReply } from "../services/geminiService";
import { randomId } from "../utils/generate";

const chatSchema = z.object({
  agent_id: z.string().min(3),
  message: z.string().min(1),
  visitor_id: z.string().optional(),
  email: z.string().email().optional()
});

export async function chat(req: Request, res: Response) {
  const apiKey = req.headers["x-agent-api-key"] as string | undefined;
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  const { agent_id, message, visitor_id, email } = parsed.data;

  const botResult = await pool.query(
    "SELECT * FROM chatbots WHERE agent_id=$1 AND ($2::text IS NULL OR api_key=$2)",
    [agent_id, apiKey ?? null]
  );
  const bot = botResult.rows[0];
  if (!bot) return res.status(404).json({ error: "Agent not found" });

  const context = await retrieveKnowledge(bot.id, message);
  const prompt = buildPrompt({
    businessName: bot.business_name,
    tone: bot.tone,
    language: bot.language,
    emojiUsage: bot.emoji_usage,
    messageLength: bot.message_length,
    context,
    userMessage: message
  });

  const reply = await generateReply(prompt);

  const conversationId = randomId("conv");
  await pool.query("INSERT INTO conversations (id,chatbot_id,visitor_id) VALUES ($1,$2,$3)", [
    conversationId,
    bot.id,
    visitor_id ?? "anonymous"
  ]);
  await pool.query("INSERT INTO messages (id,conversation_id,role,content) VALUES ($1,$2,'user',$3),($4,$2,'assistant',$5)", [
    randomId("msg"),
    conversationId,
    message,
    randomId("msg"),
    reply
  ]);

  const lower = message.toLowerCase();
  const hasIntent = ["price", "pricing", "quote", "buy", "demo"].some((term) => lower.includes(term));
  if (hasIntent && email) {
    await pool.query("INSERT INTO leads (id,chatbot_id,email,source) VALUES ($1,$2,$3,$4)", [
      randomId("lead"),
      bot.id,
      email,
      "chat"
    ]);
  }

  return res.json({ reply });
}
