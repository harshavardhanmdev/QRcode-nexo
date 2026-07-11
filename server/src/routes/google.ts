import type { FastifyInstance } from "fastify";
import { randomBytes } from "node:crypto";
import { db } from "../db/connection.js";
import { createSession } from "../services/sessions.js";
import { SESSION_COOKIE, cookieOptions } from "../plugins/auth.js";
import { config, isProd } from "../config.js";

/**
 * Hand-rolled Google OAuth 2.0 authorization-code flow (~100 lines, no
 * passport). Enabled only when GOOGLE_CLIENT_ID/SECRET are configured —
 * the web UI discovers that via /api/auth/config and hides the button
 * otherwise. Redirect URI: {SITE_ORIGIN}/api/auth/google/callback
 * (docs/05-google-oauth.md walks the owner through console setup).
 */

const STATE_COOKIE = "qrdock_oauth_state";

function redirectUri(): string {
  return `${config.SITE_ORIGIN}/api/auth/google/callback`;
}

export function registerGoogleRoutes(app: FastifyInstance): void {
  app.get("/api/auth/google", async (req, reply) => {
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
      return reply.code(404).send({ error: "Google sign-in is not configured." });
    }
    const state = randomBytes(24).toString("base64url");
    reply.setCookie(STATE_COOKIE, state, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: 600,
    });
    const params = new URLSearchParams({
      client_id: config.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri(),
      response_type: "code",
      scope: "openid email",
      state,
      prompt: "select_account",
    });
    return reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  });

  app.get("/api/auth/google/callback", async (req, reply) => {
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
      return reply.code(404).send({ error: "Google sign-in is not configured." });
    }
    const { code, state } = req.query as { code?: string; state?: string };
    const expectedState = req.cookies[STATE_COOKIE];
    reply.clearCookie(STATE_COOKIE, { path: "/" });

    if (!code || !state || !expectedState || state !== expectedState) {
      return reply.redirect(`${config.SITE_ORIGIN}/login?error=oauth`);
    }

    // exchange the code for tokens (server-to-server over TLS)
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri(),
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) {
      return reply.redirect(`${config.SITE_ORIGIN}/login?error=oauth`);
    }
    const tokens = (await tokenRes.json()) as { id_token?: string };
    if (!tokens.id_token) {
      return reply.redirect(`${config.SITE_ORIGIN}/login?error=oauth`);
    }

    // The id_token came directly from Google's token endpoint over TLS, so
    // decoding without signature verification is safe in the code flow.
    const payload = JSON.parse(
      Buffer.from(tokens.id_token.split(".")[1], "base64url").toString("utf8"),
    ) as { sub: string; email?: string; email_verified?: boolean };

    if (!payload.email || payload.email_verified === false) {
      return reply.redirect(`${config.SITE_ORIGIN}/login?error=oauth-email`);
    }

    const now = Date.now();
    let user = db
      .prepare(`SELECT id FROM users WHERE google_sub = ?`)
      .get(payload.sub) as { id: number } | undefined;

    if (!user) {
      // link by verified email if an email/password account already exists
      const byEmail = db
        .prepare(`SELECT id FROM users WHERE email = ?`)
        .get(payload.email) as { id: number } | undefined;
      if (byEmail) {
        db.prepare(`UPDATE users SET google_sub = ?, last_login_at = ? WHERE id = ?`).run(
          payload.sub,
          now,
          byEmail.id,
        );
        user = byEmail;
      } else {
        const info = db
          .prepare(
            `INSERT INTO users (email, google_sub, created_at, last_login_at) VALUES (?, ?, ?, ?)`,
          )
          .run(payload.email, payload.sub, now, now);
        user = { id: Number(info.lastInsertRowid) };
      }
    } else {
      db.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`).run(now, user.id);
    }

    const token = createSession(user.id, req.headers["user-agent"]);
    reply.setCookie(SESSION_COOKIE, token, cookieOptions());
    return reply.redirect(`${config.SITE_ORIGIN}/account`);
  });
}
