import { createHmac } from "node:crypto";
import { config } from "../config.js";

/**
 * Privacy-preserving IP bucketing: HMAC keyed by a month-derived key.
 * When the month rolls over, old hashes become unlinkable — we can rate-limit
 * without ever storing (or being able to recover) an IP address.
 */
export function ipHash(ip: string): string {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthKey = createHmac("sha256", config.IP_HASH_MASTER).update(month).digest();
  return createHmac("sha256", monthKey).update(ip).digest("hex").slice(0, 32);
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
