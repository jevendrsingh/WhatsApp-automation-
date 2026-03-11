import { Response } from "express";
import { z } from "zod";
import { pool } from "../db/client";
import { AuthRequest } from "../middleware/auth";
import { randomApiKey, randomId } from "../utils/generate";
import { chunkDocument } from "../services/ragService";

const createBotSchema = z.object({
  name: z.string().min(2),
  businessName: z.string().min(2),
  industry: z.string().min(2),
  description: z.string().min(2),
  websiteUrl: z.string().url(),
  tone: z.enum(["friendly", "professional"]),
  language: z.string().min(2),
  emojiUsage: z.boolean(),
  messageLength: z.enum(["short", "medium", "long"]),
  knowledgeText: z.string().min(10)
});

export async function createChatbot(req: AuthRequest, res: Response) {
  const parsed = createBotSchema.safeParse(req.body);
  if (!parsed.success || !req.userId) return res.status(400).json({ error: "Invalid payload" });

  const botId = randomId("bot");
  const agentId = randomId("agent");
  const apiKey = randomApiKey();

  const data = parsed.data;

  await pool.query(
    `INSERT INTO chatbots (id,user_id,agent_id,name,business_name,industry,description,website_url,tone,language,emoji_usage,message_length,api_key)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [
      botId,
      req.userId,
      agentId,
      data.name,
      data.businessName,
      data.industry,
      data.description,
      data.websiteUrl,
      data.tone,
      data.language,
      data.emojiUsage,
      data.messageLength,
      apiKey
    ]
  );

  const chunks = chunkDocument(data.knowledgeText, 120);
  for (const chunk of chunks) {
    await pool.query("INSERT INTO knowledge_chunks (id,chatbot_id,chunk_text) VALUES ($1,$2,$3)", [
      randomId("chunk"),
      botId,
      chunk
    ]);
  }

  return res.json({
    chatbotId: botId,
    agentId,
    apiKey,
    embedScript: `<script src="${process.env.WIDGET_URL ?? "http://localhost:3000/widget/chat-widget.js"}" data-agent-id="${agentId}"></script>`
  });
}

export async function listChatbots(req: AuthRequest, res: Response) {
  const result = await pool.query(
    "SELECT id,agent_id,name,business_name,industry,website_url,created_at FROM chatbots WHERE user_id=$1 ORDER BY created_at DESC",
    [req.userId]
  );
  return res.json(result.rows);
}
