import type { BgFill, Fill, QrStyle, QrType } from "@/lib/qr-engine";
import type { DeepPartial } from "@/store/generator-store";

/**
 * Compact, human-tolerable URL codec for generator state.
 * Used by SEO landing pages to preconfigure the generator
 * (/qr-code-generator/wifi?ssid=Cafe) and by "copy share link".
 * Logos are never serialized (privacy + size).
 */

const QR_TYPES: QrType[] = [
  "url", "text", "wifi", "vcard", "email", "sms", "whatsapp", "upi", "location", "event",
];

const HEX_RE = /^[0-9a-fA-F]{6}$/;

function encodeFill(fill: Fill): string {
  if (fill.kind === "solid") return fill.color.replace("#", "");
  const a = fill.stops[0].color.replace("#", "");
  const b = fill.stops[1].color.replace("#", "");
  return fill.kind === "linear" ? `l${a}-${b}-${Math.round(fill.angle)}` : `r${a}-${b}`;
}

function decodeFill(raw: string): Fill | null {
  if (HEX_RE.test(raw)) return { kind: "solid", color: `#${raw.toLowerCase()}` };
  const m = raw.match(/^([lr])([0-9a-fA-F]{6})-([0-9a-fA-F]{6})(?:-(-?\d{1,3}))?$/);
  if (!m) return null;
  const stops: [{ color: string; at: number }, { color: string; at: number }] = [
    { color: `#${m[2].toLowerCase()}`, at: 0 },
    { color: `#${m[3].toLowerCase()}`, at: 1 },
  ];
  return m[1] === "l"
    ? { kind: "linear", stops, angle: m[4] ? Number(m[4]) : 45 }
    : { kind: "radial", stops, angle: 0 };
}

function encodeBg(bg: BgFill): string {
  return bg.kind === "transparent" ? "t" : encodeFill(bg);
}

function decodeBg(raw: string): BgFill | null {
  if (raw === "t") return { kind: "transparent" };
  return decodeFill(raw);
}

/** Reserved (style/meta) keys — everything else is treated as a form field. */
const STYLE_KEYS = new Set([
  "t", "fg", "bg", "ms", "ef", "ed", "lt", "la", "ta", "ds", "ecc", "qz", "fr", "ft",
]);

export interface HydratedState {
  type?: QrType;
  fields: Record<string, string>;
  style: DeepPartial<QrStyle>;
}

export function fromParams(sp: Record<string, string | string[] | undefined>): HydratedState {
  const get = (k: string): string | undefined => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const out: HydratedState = { fields: {}, style: {} };

  const t = get("t");
  if (t && (QR_TYPES as string[]).includes(t)) out.type = t as QrType;

  const fg = get("fg") && decodeFill(get("fg")!);
  if (fg) out.style.fg = fg;
  const bg = get("bg") && decodeBg(get("bg")!);
  if (bg) out.style.bg = bg;

  const ms = get("ms");
  if (ms && ["square", "dot", "rounded", "classy", "diamond"].includes(ms)) {
    out.style.moduleShape = ms as QrStyle["moduleShape"];
  }
  const ef = get("ef");
  if (ef && ["square", "rounded", "circle", "leaf"].includes(ef)) {
    out.style.eyeFrame = ef as QrStyle["eyeFrame"];
  }
  const ed = get("ed");
  if (ed && ["square", "dot", "rounded"].includes(ed)) {
    out.style.eyeDot = ed as QrStyle["eyeDot"];
  }

  const lt = get("lt");
  if (lt) {
    const text = lt.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    if (text) {
      out.style.letters = { enabled: true, text };
      const la = get("la");
      if (la && HEX_RE.test(la)) out.style.letters.accent = `#${la.toLowerCase()}`;
    }
  }

  const ecc = get("ecc");
  if (ecc && ["L", "M", "Q", "H"].includes(ecc)) out.style.ecc = ecc as QrStyle["ecc"];

  // remaining params → form fields (only simple string values)
  for (const [k, v] of Object.entries(sp)) {
    if (STYLE_KEYS.has(k) || v === undefined) continue;
    const val = Array.isArray(v) ? v[0] : v;
    if (typeof val === "string" && val.length <= 512) out.fields[k] = val;
  }

  return out;
}

export function toShareParams(
  type: QrType,
  fields: Record<string, string>,
  style: QrStyle,
): URLSearchParams {
  const p = new URLSearchParams();
  p.set("t", type);
  for (const [k, v] of Object.entries(fields)) {
    if (v && !STYLE_KEYS.has(k)) p.set(k, v.slice(0, 512));
  }
  const d = defaultsForCompare;
  if (encodeFill(style.fg) !== d.fg) p.set("fg", encodeFill(style.fg));
  if (encodeBg(style.bg) !== d.bg) p.set("bg", encodeBg(style.bg));
  if (style.moduleShape !== "square") p.set("ms", style.moduleShape);
  if (style.eyeFrame !== "square") p.set("ef", style.eyeFrame);
  if (style.eyeDot !== "square") p.set("ed", style.eyeDot);
  if (style.letters.enabled && style.letters.text) {
    p.set("lt", style.letters.text);
    if (style.letters.accent) p.set("la", style.letters.accent.replace("#", ""));
  }
  if (style.ecc !== "M") p.set("ecc", style.ecc);
  return p;
}

const defaultsForCompare = { fg: "111827", bg: "ffffff" };
