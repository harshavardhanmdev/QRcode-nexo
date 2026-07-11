import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { db } from "../db/connection.js";
import { requireUser } from "../plugins/auth.js";

const MAX_DESIGNS = 100;
const MAX_CONFIG_BYTES = 128 * 1024;

const designSchema = z.object({
  name: z.string().min(1).max(80),
  kind: z.enum(["qr", "barcode"]),
  config: z.record(z.string(), z.unknown()),
});

export function registerDesignRoutes(app: FastifyInstance): void {
  app.get("/api/designs", async (req, reply) => {
    const user = requireUser(req, reply);
    if (!user) return;
    const rows = db
      .prepare(
        `SELECT id, name, kind, config_json, updated_at FROM designs
         WHERE user_id = ? ORDER BY updated_at DESC`,
      )
      .all(user.id) as { id: string; name: string; kind: string; config_json: string; updated_at: number }[];
    return {
      designs: rows.map((r) => ({
        id: r.id,
        name: r.name,
        kind: r.kind,
        config: JSON.parse(r.config_json),
        updatedAt: r.updated_at,
      })),
    };
  });

  app.post(
    "/api/designs",
    { config: { rateLimit: { max: 30, timeWindow: "1 minute" } } },
    async (req, reply) => {
      const user = requireUser(req, reply);
      if (!user) return;
      const parsed = designSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: "Invalid design payload." });

      const configJson = JSON.stringify(parsed.data.config);
      if (Buffer.byteLength(configJson) > MAX_CONFIG_BYTES) {
        return reply.code(413).send({ error: "Design too large — remove or shrink the logo." });
      }
      const count = (
        db.prepare(`SELECT COUNT(*) AS n FROM designs WHERE user_id = ?`).get(user.id) as { n: number }
      ).n;
      if (count >= MAX_DESIGNS) {
        return reply.code(409).send({ error: `Design library is full (${MAX_DESIGNS}) — delete some first.` });
      }

      const id = randomBytes(9).toString("base64url");
      const now = Date.now();
      db.prepare(
        `INSERT INTO designs (id, user_id, name, kind, config_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(id, user.id, parsed.data.name, parsed.data.kind, configJson, now, now);
      return reply.code(201).send({ id });
    },
  );

  app.delete("/api/designs/:id", async (req, reply) => {
    const user = requireUser(req, reply);
    if (!user) return;
    const { id } = req.params as { id: string };
    const info = db
      .prepare(`DELETE FROM designs WHERE id = ? AND user_id = ?`)
      .run(id, user.id);
    if (info.changes === 0) return reply.code(404).send({ error: "Design not found." });
    return reply.code(204).send();
  });
}
