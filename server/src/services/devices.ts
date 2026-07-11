/** Coarse device classification for scan analytics — no fingerprinting. */
export function classifyDevice(ua: string | undefined): {
  device: "mobile" | "tablet" | "desktop" | "unknown";
  isBot: boolean;
} {
  if (!ua) return { device: "unknown", isBot: false };
  const s = ua.toLowerCase();
  if (/(bot|crawler|spider|slurp|curl|wget|python-requests|headless)/.test(s)) {
    return { device: "unknown", isBot: true };
  }
  if (/(ipad|tablet|kindle|silk)/.test(s)) return { device: "tablet", isBot: false };
  if (/(mobi|iphone|android)/.test(s)) return { device: "mobile", isBot: false };
  return { device: "desktop", isBot: false };
}
