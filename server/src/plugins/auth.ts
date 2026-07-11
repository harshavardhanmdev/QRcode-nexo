import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { resolveSession, type SessionUser } from "../services/sessions.js";
import { config, isProd } from "../config.js";

declare module "fastify" {
  interface FastifyRequest {
    user: SessionUser | null;
  }
}

export const SESSION_COOKIE = "qrdock_session";

export function cookieOptions() {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    maxAge: 30 * 86400,
  };
}

export function registerAuthPlugin(app: FastifyInstance): void {
  app.decorateRequest("user", null);

  app.addHook("onRequest", async (req) => {
    req.user = resolveSession(req.cookies[SESSION_COOKIE]);
  });

  /**
   * CSRF posture: same-origin cookies (SameSite=Lax) + explicit Origin /
   * Sec-Fetch-Site verification on every state-changing request. The web
   * client also sends X-Requested-With, blocked cross-origin by CORS.
   */
  app.addHook("preHandler", async (req, reply) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return;
    const origin = req.headers.origin;
    const secFetchSite = req.headers["sec-fetch-site"];
    const originOk =
      (origin && origin === config.SITE_ORIGIN) ||
      (!origin && (!secFetchSite || secFetchSite === "same-origin" || secFetchSite === "none"));
    if (!originOk) {
      return reply.code(403).send({ error: "cross-origin request rejected" });
    }
  });
}

export function requireUser(req: FastifyRequest, reply: FastifyReply): SessionUser | null {
  if (!req.user) {
    reply.code(401).send({ error: "sign in required" });
    return null;
  }
  return req.user;
}

/** Client IP with proxy awareness (Next rewrite → x-forwarded-for; CF → cf-connecting-ip). */
export function clientIp(req: FastifyRequest): string {
  if (config.TRUST_PROXY) {
    const cf = req.headers["cf-connecting-ip"];
    if (typeof cf === "string" && cf) return cf;
    const xff = req.headers["x-forwarded-for"];
    if (typeof xff === "string" && xff) return xff.split(",")[0].trim();
  }
  return req.ip;
}
