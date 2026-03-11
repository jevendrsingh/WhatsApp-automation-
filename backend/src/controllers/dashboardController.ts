import { Response } from "express";
import { pool } from "../db/client";
import { AuthRequest } from "../middleware/auth";

export async function getOverview(req: AuthRequest, res: Response) {
  const userId = req.userId;

  const [messages, conversations, leads] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS count FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       JOIN chatbots b ON b.id = c.chatbot_id
       WHERE b.user_id=$1 AND m.created_at::date = now()::date`,
      [userId]
    ),
    pool.query("SELECT COUNT(*)::int AS count FROM conversations c JOIN chatbots b ON b.id=c.chatbot_id WHERE b.user_id=$1", [userId]),
    pool.query("SELECT COUNT(*)::int AS count FROM leads l JOIN chatbots b ON b.id=l.chatbot_id WHERE b.user_id=$1", [userId])
  ]);

  return res.json({
    conversationsToday: conversations.rows[0]?.count ?? 0,
    totalMessages: messages.rows[0]?.count ?? 0,
    leadsCaptured: leads.rows[0]?.count ?? 0
  });
}
