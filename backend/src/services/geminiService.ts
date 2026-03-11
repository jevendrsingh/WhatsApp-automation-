import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

const client = config.geminiApiKey ? new GoogleGenerativeAI(config.geminiApiKey) : null;

export async function generateReply(prompt: string): Promise<string> {
  if (!client) {
    return "Gemini API key is not configured. Please set GEMINI_API_KEY.";
  }

  const model = client.getGenerativeModel({ model: config.geminiModel });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
