import { createHash, randomBytes } from "node:crypto";
import { db } from "../db/connection.js";
import { config } from "../config.js";

const SESSION_DAYS = 30;

export interface SessionUser {
  id: number;
  email: string;
  plan: string;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token + config.SESSION_PEPPER).digest("hex");
}

export function createSession(userId: number, ua: string | undefined): string {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  db.prepare(
    `INSERT INTO sessions (token_hash, user_id, created_at, expires_at, ua)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(hashToken(token), userId, now, now + SESSION_DAYS * 86400_000, ua?.slice(0, 200) ?? null);
  return token;
}

export function resolveSession(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.plan, s.token_hash, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ?`,
    )
    .get(hashToken(token), Date.now()) as
    | { id: number; email: string; plan: string; token_hash: string; expires_at: number }
    | undefined;
  if (!row) return null;

  // sliding expiry: extend when less than half the window remains
  if (row.expires_at - Date.now() < (SESSION_DAYS / 2) * 86400_000) {
    db.prepare(`UPDATE sessions SET expires_at = ? WHERE token_hash = ?`).run(
      Date.now() + SESSION_DAYS * 86400_000,
      row.token_hash,
    );
  }
  return { id: row.id, email: row.email, plan: row.plan };
}

export function revokeSession(token: string | undefined): void {
  if (!token) return;
  db.prepare(`UPDATE sessions SET revoked_at = ? WHERE token_hash = ?`).run(
    Date.now(),
    hashToken(token),
  );
}
