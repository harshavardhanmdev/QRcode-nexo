import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/connection.js";
import { clientIp } from "../plugins/auth.js";
import { ipHash, todayKey } from "../services/iphash.js";
import { mailerConfigured, sendContactMail } from "../services/mailer.js";

/**
 * Quota model: the 10-free-downloads gate lives CLIENT-SIDE (localStorage) —
 * India's CGNAT makes IPs useless as an identity key. This endpoint is only
 * an abuse ceiling (60 downloads/day per IP bucket) and is fire-and-forget
 * from the client: downloads never block on it.
 */
const DAILY_CEILING = 60;

export function registerMiscRoutes(app: FastifyInstance): void {
  app.get("/api/health", async () => ({
    ok: true,
    mailer: mailerConfigured,
    ts: Date.now(),
  }));

  app.post(
    "/api/quota/consume",
    { config: { rateLimit: { max: 120, timeWindow: "1 hour" } } },
    async (req) => {
      const bucket = ipHash(clientIp(req));
      const day = todayKey();
      db.prepare(
        `INSERT INTO quota_counters (bucket, day, count) VALUES (?, ?, 1)
         ON CONFLICT(bucket, day) DO UPDATE SET count = count + 1`,
      ).run(bucket, day);
      const row = db
        .prepare(`SELECT count FROM quota_counters WHERE bucket = ? AND day = ?`)
        .get(bucket, day) as { count: number };
      // signed-in users are never ceiling-limited
      const ceilingHit = !req.user && row.count > DAILY_CEILING;
      return { dayCount: row.count, ceilingHit };
    },
  );

  const contactSchema = z.object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(254),
    message: z.string().min(10).max(4000),
    /** honeypot — real users never fill this */
    website: z.string().max(0).optional().or(z.literal("")),
  });

  app.post(
    "/api/contact",
    { config: { rateLimit: { max: 3, timeWindow: "1 hour" } } },
    async (req, reply) => {
      const parsed = contactSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "Fill in your name, a valid email and a message (10+ characters)." });
      }
      if (parsed.data.website) {
        // honeypot tripped — pretend success, store nothing
        return reply.code(204).send();
      }
      db.prepare(
        `INSERT INTO contact_messages (name, email, message, ip_hash, created_at)
         VALUES (?, ?, ?, ?, ?)`,
      ).run(
        parsed.data.name,
        parsed.data.email,
        parsed.data.message,
        ipHash(clientIp(req)),
        Date.now(),
      );
      // best effort — the DB row is the source of truth
      void sendContactMail(parsed.data);
      return reply.code(204).send();
    },
  );
}
