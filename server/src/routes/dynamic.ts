import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { customAlphabet } from "nanoid";
import { db } from "../db/connection.js";
import { requireUser } from "../plugins/auth.js";
import { classifyDevice } from "../services/devices.js";

const FREE_ACTIVE_CAP = 5;
// unambiguous alphabet (no 0/O, 1/l/I) — slugs get typed from print sometimes
const slugId = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 8);

function validateDestination(raw: string): string | null {
  if (raw.length > 2048) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.username || url.password) return null; // no userinfo phishing tricks
  return url.href;
}

const createSchema = z.object({
  destination: z.string().min(8).max(2048),
  name: z.string().max(80).optional(),
});

const updateSchema = z.object({
  destination: z.string().min(8).max(2048).optional(),
  active: z.boolean().optional(),
  name: z.string().max(80).optional(),
});

export function registerDynamicRoutes(app: FastifyInstance): void {
  app.get("/api/dynamic", async (req, reply) => {
    const user = requireUser(req, reply);
    if (!user) return;
    const rows = db
      .prepare(
        `SELECT d.id, d.slug, d.destination, d.name, d.active, d.created_at,
                (SELECT COUNT(*) FROM scans s WHERE s.qr_id = d.id AND s.is_bot = 0) AS scans
         FROM dynamic_qrs d WHERE d.user_id = ? ORDER BY d.created_at DESC`,
      )
      .all(user.id);
    return { dynamic: rows };
  });

  app.post(
    "/api/dynamic",
    { config: { rateLimit: { max: 10, timeWindow: "1 hour" } } },
    async (req, reply) => {
      const user = requireUser(req, reply);
      if (!user) return;
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: "Enter a destination link." });
      const destination = validateDestination(parsed.data.destination);
      if (!destination) {
        return reply.code(400).send({ error: "Destination must be a plain http(s) link." });
      }

      const active = (
        db
          .prepare(`SELECT COUNT(*) AS n FROM dynamic_qrs WHERE user_id = ? AND active = 1`)
          .get(user.id) as { n: number }
      ).n;
      if (user.plan === "free" && active >= FREE_ACTIVE_CAP) {
        return reply.code(409).send({
          error: `Free accounts include ${FREE_ACTIVE_CAP} active dynamic codes — deactivate one to create another.`,
        });
      }

      const id = randomBytes(9).toString("base64url");
      const slug = slugId();
      const now = Date.now();
      db.prepare(
        `INSERT INTO dynamic_qrs (id, user_id, slug, destination, name, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(id, user.id, slug, destination, parsed.data.name ?? null, now, now);
      return reply.code(201).send({ id, slug });
    },
  );

  app.put("/api/dynamic/:id", async (req, reply) => {
    const user = requireUser(req, reply);
    if (!user) return;
    const { id } = req.params as { id: string };
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "Nothing valid to update." });

    const sets: string[] = [];
    const values: unknown[] = [];
    if (parsed.data.destination !== undefined) {
      const destination = validateDestination(parsed.data.destination);
      if (!destination) return reply.code(400).send({ error: "Destination must be a plain http(s) link." });
      sets.push("destination = ?");
      values.push(destination);
    }
    if (parsed.data.active !== undefined) {
      sets.push("active = ?");
      values.push(parsed.data.active ? 1 : 0);
    }
    if (parsed.data.name !== undefined) {
      sets.push("name = ?");
      values.push(parsed.data.name);
    }
    if (sets.length === 0) return reply.code(400).send({ error: "Nothing to update." });
    sets.push("updated_at = ?");
    values.push(Date.now());

    const info = db
      .prepare(`UPDATE dynamic_qrs SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`)
      .run(...values, id, user.id);
    if (info.changes === 0) return reply.code(404).send({ error: "Code not found." });
    return reply.code(204).send();
  });

  app.delete("/api/dynamic/:id", async (req, reply) => {
    const user = requireUser(req, reply);
    if (!user) return;
    const { id } = req.params as { id: string };
    const info = db
      .prepare(`DELETE FROM dynamic_qrs WHERE id = ? AND user_id = ?`)
      .run(id, user.id);
    if (info.changes === 0) return reply.code(404).send({ error: "Code not found." });
    return reply.code(204).send();
  });

  app.get("/api/dynamic/:id/stats", async (req, reply) => {
    const user = requireUser(req, reply);
    if (!user) return;
    const { id } = req.params as { id: string };
    const { range = "30d" } = req.query as { range?: string };
    const owned = db
      .prepare(`SELECT id FROM dynamic_qrs WHERE id = ? AND user_id = ?`)
      .get(id, user.id);
    if (!owned) return reply.code(404).send({ error: "Code not found." });

    const days = range === "7d" ? 7 : range === "all" ? 3650 : 30;
    const since = Date.now() - days * 86400_000;

    const total = (
      db
        .prepare(`SELECT COUNT(*) AS n FROM scans WHERE qr_id = ? AND is_bot = 0 AND ts >= ?`)
        .get(id, since) as { n: number }
    ).n;
    const byDay = db
      .prepare(
        `SELECT date(ts / 1000, 'unixepoch') AS day, COUNT(*) AS n
         FROM scans WHERE qr_id = ? AND is_bot = 0 AND ts >= ?
         GROUP BY day ORDER BY day`,
      )
      .all(id, since);
    const byCountry = db
      .prepare(
        `SELECT COALESCE(country, 'unknown') AS country, COUNT(*) AS n
         FROM scans WHERE qr_id = ? AND is_bot = 0 AND ts >= ?
         GROUP BY country ORDER BY n DESC LIMIT 10`,
      )
      .all(id, since);
    const byDevice = db
      .prepare(
        `SELECT COALESCE(device, 'unknown') AS device, COUNT(*) AS n
         FROM scans WHERE qr_id = ? AND is_bot = 0 AND ts >= ?
         GROUP BY device ORDER BY n DESC`,
      )
      .all(id, since);

    return { total, byDay, byCountry, byDevice, rangeDays: days };
  });

  // ---- the public redirect -------------------------------------------------
  app.get(
    "/q/:slug",
    { config: { rateLimit: { max: 120, timeWindow: "1 minute" } } },
    async (req, reply) => {
      const { slug } = req.params as { slug: string };
      if (!/^[a-z0-9]{4,16}$/.test(slug)) {
        return reply.code(404).type("text/html").send(notFoundHtml());
      }
      const row = db
        .prepare(`SELECT id, destination, active FROM dynamic_qrs WHERE slug = ?`)
        .get(slug) as { id: string; destination: string; active: number } | undefined;
      if (!row || !row.active) {
        return reply.code(404).type("text/html").send(notFoundHtml());
      }

      // record the scan off the hot path
      const ua = req.headers["user-agent"];
      const country = (req.headers["cf-ipcountry"] as string | undefined)?.slice(0, 2) ?? null;
      setImmediate(() => {
        try {
          const { device, isBot } = classifyDevice(ua);
          db.prepare(
            `INSERT INTO scans (qr_id, ts, country, device, is_bot) VALUES (?, ?, ?, ?, ?)`,
          ).run(row.id, Date.now(), country, device, isBot ? 1 : 0);
          // probabilistic retention prune (~1 in 500 scans)
          if (Math.random() < 0.002) {
            db.prepare(`DELETE FROM scans WHERE ts < ?`).run(Date.now() - 400 * 86400_000);
          }
        } catch {
          // a lost scan row must never break a redirect
        }
      });

      return reply.redirect(row.destination, 302);
    },
  );
}

function notFoundHtml(): string {
  return `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Link not found — qrdock</title>
<body style="font-family:system-ui;background:#090e1a;color:#f4f6fb;display:grid;place-items:center;min-height:100vh;margin:0">
<div style="text-align:center;padding:2rem"><h1 style="font-size:1.4rem">This short link doesn't exist or was deactivated.</h1>
<p style="color:#9aa7bd">If you believe this link is abusive, email saradapublications18@gmail.com.</p>
<a href="/" style="color:#22c55e">qrdock — free QR code generator</a></div>`;
}
