import { pool } from "../db/client";

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export async function retrieveKnowledge(chatbotId: string, question: string) {
  const tokens = Array.from(new Set(tokenize(question))).slice(0, 15);

  if (!tokens.length) return [] as string[];

  const query = `
    SELECT chunk_text
    FROM knowledge_chunks
    WHERE chatbot_id = $1
      AND to_tsvector('english', chunk_text) @@ plainto_tsquery('english', $2)
    LIMIT 5
  `;

  const { rows } = await pool.query<{ chunk_text: string }>(query, [chatbotId, tokens.join(" ")]);
  return rows.map((row) => row.chunk_text);
}

export function chunkDocument(text: string, chunkSize = 500) {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks.filter(Boolean);
}
