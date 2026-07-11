"use client";

/**
 * The 10-free-downloads gate. Counted in localStorage (client-side by
 * design — see plan: CGNAT makes IPs the wrong key), mirrored to the server
 * only as a fire-and-forget abuse ceiling. Downloads NEVER block on the
 * network; signed-in users are never gated.
 */

const KEY = "qrdock.downloads";
export const FREE_LIMIT = 10;

export function downloadsUsed(): number {
  if (typeof localStorage === "undefined") return 0;
  const n = Number(localStorage.getItem(KEY));
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function remainingFree(): number {
  return Math.max(0, FREE_LIMIT - downloadsUsed());
}

/** true → allowed to download; false → show the sign-up gate */
export function checkGate(isSignedIn: boolean): boolean {
  if (isSignedIn) return true;
  return downloadsUsed() < FREE_LIMIT;
}

export function recordDownload(): void {
  try {
    localStorage.setItem(KEY, String(downloadsUsed() + 1));
  } catch {
    /* private mode etc. */
  }
  // fire-and-forget server-side abuse counter
  void fetch("/api/quota/consume", {
    method: "POST",
    credentials: "include",
    headers: { "x-requested-with": "fetch", "content-type": "application/json" },
    body: "{}",
  }).catch(() => {});
}
