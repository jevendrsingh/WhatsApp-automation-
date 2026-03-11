import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 8080),
  databaseUrl: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/agentchat",
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000").split(","),
  appUrl: process.env.APP_URL ?? "http://localhost:3000"
};
