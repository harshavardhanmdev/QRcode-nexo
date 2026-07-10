import type { BgFill, Fill } from "./types";

/** WCAG relative luminance from a hex color (#rgb, #rrggbb, #rrggbbaa). */
export function luminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function parseHex(hex: string): { r: number; g: number; b: number; a: number } {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  const a = h.length >= 8 ? (parseInt(h.slice(6, 8), 16) || 0) / 255 : 1;
  return { r, g, b, a };
}

export function contrastRatio(l1: number, l2: number): number {
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function fillLuminances(fill: Fill): number[] {
  if (fill.kind === "solid") return [luminance(fill.color)];
  return fill.stops.map((s) => luminance(s.color));
}

export interface ContrastReport {
  /** worst-case ratio between any fg stop and the background */
  worstRatio: number;
  /** true when the foreground is lighter than the background (inverted code) */
  inverted: boolean;
  transparentBg: boolean;
}

/**
 * Scanner-oriented contrast check. ISO 18004 wants dark/light reflectance
 * difference ≥ 40%; a WCAG ratio of ~4:1 comfortably clears it, below ~2.5:1
 * scanning gets unreliable.
 */
export function checkContrast(fg: Fill, bg: BgFill): ContrastReport {
  const fgLums = fillLuminances(fg);
  const transparentBg = bg.kind === "transparent";
  // transparent backgrounds are *assumed* to land on white paper
  const bgLums = transparentBg ? [1] : fillLuminances(bg as Fill);

  let worst = Infinity;
  for (const fl of fgLums) {
    for (const bl of bgLums) {
      worst = Math.min(worst, contrastRatio(fl, bl));
    }
  }

  const avgFg = fgLums.reduce((a, b) => a + b, 0) / fgLums.length;
  const avgBg = bgLums.reduce((a, b) => a + b, 0) / bgLums.length;

  return {
    worstRatio: worst,
    inverted: avgFg > avgBg,
    transparentBg,
  };
}
