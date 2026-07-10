import type { QrType } from "./types";

/**
 * Payload builders — turn structured form fields into spec-correct QR strings.
 * Every builder validates enough to prevent silently-broken codes.
 */

export type PayloadFields = Record<string, string>;

export interface PayloadResult {
  payload: string;
  /** human-readable problem when the fields can't make a valid payload */
  error?: string;
}

/** WIFI: escape \ ; , : " per the de-facto (ZXing) syntax. */
function escapeWifi(v: string): string {
  return v.replace(/([\\;,:"'])/g, "\\$1");
}

/** vCard 3.0 value escaping: backslash, newline, comma, semicolon. */
function escapeVcard(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function normalizeUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(t)) return t; // has scheme
  return `https://${t}`;
}

const VPA_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,}@[a-zA-Z][a-zA-Z0-9]{1,63}$/;

function icsDate(local: string): string {
  // input: yyyy-MM-ddTHH:mm from <input type="datetime-local">
  return local.replace(/[-:]/g, "");
}

export const payloadBuilders: Record<
  QrType,
  (f: PayloadFields) => PayloadResult
> = {
  url(f) {
    const url = normalizeUrl(f.url ?? "");
    if (!url) return { payload: "", error: "Enter a link" };
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return { payload: url, error: "Only http(s) links are supported" };
      }
    } catch {
      return { payload: url, error: "That doesn't look like a valid link yet" };
    }
    return { payload: url };
  },

  text(f) {
    const t = f.text ?? "";
    if (!t.trim()) return { payload: "", error: "Enter some text" };
    return { payload: t };
  },

  wifi(f) {
    const ssid = f.ssid ?? "";
    const enc = (f.enc ?? "WPA").toUpperCase(); // WPA | WEP | nopass
    const hidden = f.hidden === "true";
    if (!ssid) return { payload: "", error: "Enter the network name (SSID)" };
    if (enc !== "NOPASS" && !f.password) {
      return { payload: "", error: "Enter the Wi-Fi password" };
    }
    const parts = [
      `WIFI:T:${enc === "NOPASS" ? "nopass" : enc};`,
      `S:${escapeWifi(ssid)};`,
      enc === "NOPASS" ? "" : `P:${escapeWifi(f.password ?? "")};`,
      hidden ? "H:true;" : "",
      ";",
    ];
    return { payload: parts.join("") };
  },

  vcard(f) {
    const first = (f.firstName ?? "").trim();
    const last = (f.lastName ?? "").trim();
    if (!first && !last) return { payload: "", error: "Enter a name" };
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${escapeVcard(last)};${escapeVcard(first)};;;`,
      `FN:${escapeVcard([first, last].filter(Boolean).join(" "))}`,
    ];
    if (f.org) lines.push(`ORG:${escapeVcard(f.org)}`);
    if (f.title) lines.push(`TITLE:${escapeVcard(f.title)}`);
    if (f.phone) lines.push(`TEL;TYPE=CELL:${escapeVcard(f.phone)}`);
    if (f.workPhone) lines.push(`TEL;TYPE=WORK:${escapeVcard(f.workPhone)}`);
    if (f.email) lines.push(`EMAIL:${escapeVcard(f.email)}`);
    if (f.website) lines.push(`URL:${escapeVcard(normalizeUrl(f.website))}`);
    if (f.address) lines.push(`ADR;TYPE=WORK:;;${escapeVcard(f.address)};;;;`);
    lines.push("END:VCARD");
    return { payload: lines.join("\n") };
  },

  email(f) {
    const to = (f.to ?? "").trim();
    if (!to) return { payload: "", error: "Enter the recipient address" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return { payload: "", error: "That email address looks incomplete" };
    }
    const params = new URLSearchParams();
    if (f.subject) params.set("subject", f.subject);
    if (f.body) params.set("body", f.body);
    const qs = params.toString().replace(/\+/g, "%20");
    return { payload: `mailto:${to}${qs ? `?${qs}` : ""}` };
  },

  sms(f) {
    const phone = (f.phone ?? "").replace(/[^\d+]/g, "");
    if (!phone) return { payload: "", error: "Enter a phone number" };
    // SMSTO:<number>:<message> — the ZXing-standard form, widest scanner support
    return { payload: `SMSTO:${phone}:${(f.message ?? "").trim()}` };
  },

  whatsapp(f) {
    const phone = (f.phone ?? "").replace(/[^\d]/g, "");
    if (!phone) {
      return { payload: "", error: "Enter the number with country code (e.g. 91…)" };
    }
    const text = f.message ? `?text=${encodeURIComponent(f.message)}` : "";
    return { payload: `https://wa.me/${phone}${text}` };
  },

  upi(f) {
    const vpa = (f.vpa ?? "").trim();
    const name = (f.name ?? "").trim();
    if (!vpa) return { payload: "", error: "Enter your UPI ID (e.g. name@bank)" };
    if (!VPA_RE.test(vpa)) {
      return { payload: "", error: "That UPI ID doesn't look valid (name@bank)" };
    }
    if (!name) return { payload: "", error: "Enter the payee name" };
    const params = new URLSearchParams({ pa: vpa, pn: name });
    const amount = (f.amount ?? "").trim();
    if (amount) {
      if (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) {
        return { payload: "", error: "Amount must be a positive number (max 2 decimals)" };
      }
      params.set("am", amount);
    }
    if (f.note) params.set("tn", f.note.slice(0, 80));
    params.set("cu", "INR");
    return { payload: `upi://pay?${params.toString().replace(/\+/g, "%20")}` };
  },

  location(f) {
    const lat = Number((f.lat ?? "").trim());
    const lng = Number((f.lng ?? "").trim());
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return { payload: "", error: "Enter latitude and longitude" };
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return { payload: "", error: "Coordinates out of range" };
    }
    return { payload: `geo:${lat},${lng}` };
  },

  event(f) {
    const title = (f.title ?? "").trim();
    const start = (f.start ?? "").trim();
    if (!title) return { payload: "", error: "Enter an event title" };
    if (!start) return { payload: "", error: "Pick a start date & time" };
    const lines = [
      "BEGIN:VEVENT",
      `SUMMARY:${escapeVcard(title)}`,
      `DTSTART:${icsDate(start)}00`,
    ];
    if (f.end) lines.push(`DTEND:${icsDate(f.end)}00`);
    if (f.venue) lines.push(`LOCATION:${escapeVcard(f.venue)}`);
    if (f.details) lines.push(`DESCRIPTION:${escapeVcard(f.details)}`);
    lines.push("END:VEVENT");
    return { payload: lines.join("\n") };
  },
};

export function buildPayload(type: QrType, fields: PayloadFields): PayloadResult {
  return payloadBuilders[type](fields);
}
