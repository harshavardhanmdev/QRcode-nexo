import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/connection.js";
import { hashPassword, verifyPassword } from "../services/passwords.js";
import { createSession, revokeSession } from "../services/sessions.js";
import { SESSION_COOKIE, cookieOptions, requireUser } from "../plugins/auth.js";
import { config } from "../config.js";

const credentialsSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
});

interface UserRow {
  id: number;
  email: string;
  pw_hash: string | null;
  plan: string;
}

export function registerAuthRoutes(app: FastifyInstance): void {
  app.get("/api/auth/config", async () => ({
    google: Boolean(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET),
  }));

  app.post(
    "/api/auth/register",
    { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } },
    async (req, reply) => {
      const parsed = credentialsSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "Enter a valid email and a password of 8+ characters." });
      }
      const { email, password } = parsed.data;

      const existing = db
        .prepare(`SELECT id FROM users WHERE email = ?`)
        .get(email) as { id: number } | undefined;
      if (existing) {
        return reply.code(409).send({ error: "An account with that email already exists — sign in instead." });
      }

      const pwHash = await hashPassword(password);
      const now = Date.now();
      const info = db
        .prepare(`INSERT INTO users (email, pw_hash, created_at, last_login_at) VALUES (?, ?, ?, ?)`)
        .run(email, pwHash, now, now);

      const token = createSession(Number(info.lastInsertRowid), req.headers["user-agent"]);
      reply.setCookie(SESSION_COOKIE, token, cookieOptions());
      return reply.code(201).send({ user: { email, plan: "free" } });
    },
  );

  app.post(
    "/api/auth/login",
    { config: { rateLimit: { max: 10, timeWindow: "15 minutes" } } },
    async (req, reply) => {
      const parsed = credentialsSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "Enter your email and password." });
      }
      const { email, password } = parsed.data;

      const user = db
        .prepare(`SELECT id, email, pw_hash, plan FROM users WHERE email = ?`)
        .get(email) as UserRow | undefined;

      // constant-shape failure: verify against a dummy hash when unknown
      const ok = user?.pw_hash
        ? await verifyPassword(user.pw_hash, password)
        : (await hashPassword(password), false);

      if (!ok || !user) {
        return reply.code(401).send({ error: "Wrong email or password." });
      }

      db.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`).run(Date.now(), user.id);
      const token = createSession(user.id, req.headers["user-agent"]);
      reply.setCookie(SESSION_COOKIE, token, cookieOptions());
      return { user: { email: user.email, plan: user.plan } };
    },
  );

  app.post("/api/auth/logout", async (req, reply) => {
    revokeSession(req.cookies[SESSION_COOKIE]);
    reply.clearCookie(SESSION_COOKIE, { path: "/" });
    return reply.code(204).send();
  });

  app.get("/api/auth/me", async (req, reply) => {
    const user = requireUser(req, reply);
    if (!user) return;
    const counts = db
      .prepare(
        `SELECT
          (SELECT COUNT(*) FROM designs WHERE user_id = ?) AS designs,
          (SELECT COUNT(*) FROM dynamic_qrs WHERE user_id = ? AND active = 1) AS dynamicActive`,
      )
      .get(user.id, user.id) as { designs: number; dynamicActive: number };
    return { user: { email: user.email, plan: user.plan }, counts };
  });
}
