import type { LetterMap, QrStyle, RenderResult } from "./types";
import { createMatrix } from "./matrix";
import { renderSvg } from "./svg-renderer";
import { wrapFrame } from "./frames";

export * from "./types";
export { buildPayload } from "./payloads";
export type { PayloadResult, PayloadFields } from "./payloads";
export { checkContrast } from "./contrast";
export { downloadCode, copyPngToClipboard, rasterize } from "./export";
export type { ExportFormat, ExportSize } from "./export";
export { buildLetterMap, ensureLetterFont, sanitizeLetters } from "./letter-forge";
export { verifyScannable } from "./verify";
export type { VerifyResult } from "./verify";

/** Min version by letter count — glyphs need module resolution to read well. */
const LETTER_MIN_VERSION: Record<number, number> = { 1: 5, 2: 5, 3: 6, 4: 7 };

export interface GenerateOptions {
  payload: string;
  style: QrStyle;
  idSuffix?: string;
  /**
   * Letter-map factory (browser-only, needs canvas). Injected so the core
   * stays importable server-side; returns coverage for a given matrix.
   */
  buildLetterMap?: (matrixSize: number, functional: Uint8Array, text: string) => LetterMap;
}

/**
 * The engine's front door: payload + style → styled, warned, scored SVG.
 * Letter mode: forces ECC H, floors the version, and searches all 8 mask
 * patterns for the one that puts the most dark modules under the strokes.
 */
export function generateStyledQr(opts: GenerateOptions): RenderResult {
  const { payload, style, idSuffix, buildLetterMap } = opts;

  const lettersOn =
    style.letters.enabled && style.letters.text.length > 0 && !!buildLetterMap;

  const ecc = lettersOn || style.logo.dataUrl ? "H" : style.ecc;
  const minVersion = lettersOn
    ? LETTER_MIN_VERSION[Math.min(4, style.letters.text.length)]
    : undefined;

  if (!lettersOn) {
    const matrix = createMatrix(payload, { ecc, minVersion });
    const result = renderSvg({ matrix, style, idSuffix });
    result.svg = wrapFrame(result.svg, style.frame, result.sizeModules);
    return result;
  }

  // Mask-pattern search: all 8 masks are spec-legal (decoders read the mask id
  // from format info) — pick the one with the most ink under the letters.
  let best: { matrix: ReturnType<typeof createMatrix>; map: LetterMap } | null = null;
  for (let mask = 0; mask < 8; mask++) {
    const matrix = createMatrix(payload, { ecc, minVersion, maskPattern: mask });
    const map = buildLetterMap(matrix.size, matrix.functional, style.letters.text);
    // score: dark coverage inside letter strokes
    let inside = 0;
    let insideDark = 0;
    for (let i = 0; i < matrix.size * matrix.size; i++) {
      if (map.coverage[i] === 2 && matrix.functional[i] === 0) {
        inside++;
        if (matrix.dark[i] === 1) insideDark++;
      }
    }
    const ratio = inside > 0 ? insideDark / inside : 0;
    const scored = { matrix, map: { ...map, inkRatio: ratio } };
    if (!best || ratio > best.map.inkRatio) best = scored;
  }

  const { matrix, map } = best!;
  const result = renderSvg({ matrix, style, letterMap: map, idSuffix });
  result.svg = wrapFrame(result.svg, style.frame, result.sizeModules);
  return result;
}

/** Sensible starting style for the generator UI. */
export function defaultStyle(): QrStyle {
  return {
    fg: { kind: "solid", color: "#111827" },
    bg: { kind: "solid", color: "#ffffff" },
    moduleShape: "square",
    eyeFrame: "square",
    eyeDot: "square",
    letters: { enabled: false, text: "", accent: null, tintAlpha: 0.14, dotScale: 0.62 },
    logo: { dataUrl: null, sizePct: 0.2, knockout: true, rounded: true },
    frame: { id: "none", text: "SCAN ME", color: "#111827", textColor: "#ffffff" },
    ecc: "M",
    quietZone: 4,
  };
}
