import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../db/client";
import { config } from "../config";
import { randomId } from "../utils/generate";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).optional()
});

export async function register(req: Request, res: Response) {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success || !parsed.data.fullName) return res.status(400).json({ error: "Invalid payload" });

  const { email, password, fullName } = parsed.data;

  const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
  if (existing.rowCount) return res.status(409).json({ error: "Email already exists" });

  const id = randomId("usr");
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (id,email,password_hash,full_name) VALUES ($1,$2,$3,$4)",
    [id, email, hash, fullName]
  );

  const token = jwt.sign({ sub: id }, config.jwtSecret, { expiresIn: "7d" });
  return res.json({ token, user: { id, email, fullName } });
}

export async function login(req: Request, res: Response) {
  const parsed = authSchema.omit({ fullName: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  const { email, password } = parsed.data;
  const result = await pool.query("SELECT id,email,password_hash,full_name FROM users WHERE email=$1", [email]);
  const user = result.rows[0] as { id: string; email: string; password_hash: string; full_name: string } | undefined;

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: "7d" });
  return res.json({ token, user: { id: user.id, email: user.email, fullName: user.full_name } });
}

export async function resetPassword(req: Request, res: Response) {
  const schema = z.object({ email: z.string().email() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });
  return res.json({ message: "If that account exists, reset instructions were sent." });
}
