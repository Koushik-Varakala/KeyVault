import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 10;

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// API Key Generation and Hashing
export function generateApiKey(): { key: string; maskedKey: string } {
  const prefix = "pt_live_";
  const randomPart = crypto.randomBytes(32).toString("hex");
  const key = `${prefix}${randomPart}`;
  
  const maskedKey = `${prefix}${"*".repeat(8)}${randomPart.slice(-4)}`;
  return { key, maskedKey };
}

export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}
