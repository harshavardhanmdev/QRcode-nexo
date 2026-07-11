import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_PATH: z.string().default("./data/qrdock.db"),
  /** secret pepper mixed into session token hashing */
  SESSION_PEPPER: z.string().min(16).default("dev-only-pepper-change-me"),
  /** master key for month-rotating IP hashing (never store raw IPs) */
  IP_HASH_MASTER: z.string().min(16).default("dev-only-iphash-change-me"),
  /** public site origin — used for Origin checks and OAuth redirects */
  SITE_ORIGIN: z.string().url().default("http://localhost:3000"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  CONTACT_TO: z.string().default("saradapublications18@gmail.com"),
  /** trust x-forwarded-* / cf-* headers (behind Next proxy + Cloudflare) */
  TRUST_PROXY: z.coerce.boolean().default(true),
});

export const config = envSchema.parse(process.env);

export const isProd = config.NODE_ENV === "production";

if (isProd) {
  const insecure: string[] = [];
  if (config.SESSION_PEPPER.startsWith("dev-only")) insecure.push("SESSION_PEPPER");
  if (config.IP_HASH_MASTER.startsWith("dev-only")) insecure.push("IP_HASH_MASTER");
  if (insecure.length) {
    throw new Error(
      `Refusing to start in production with default secrets: ${insecure.join(", ")}`,
    );
  }
}
