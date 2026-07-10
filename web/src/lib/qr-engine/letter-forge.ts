import type { LetterMap } from "./types";

/**
 * Letter forge — rasterizes 1–4 glyphs into a per-module coverage map.
 *
 * The letters are never allowed to flip a module's darkness (that would eat
 * error-correction budget); they only change how modules are DRAWN:
 *   coverage 2 (inside stroke)  → dark modules become fused full squares,
 *                                 light modules get a faint tint
 *   coverage 1 (stroke edge)    → dark modules get intermediate emphasis
 *   coverage 0 (outside)        → dark modules render as small dots
 *
 * Browser-only (offscreen canvas). The glyph font is fetched lazily the first
 * time letters are enabled, so it costs nothing on normal generator use.
 */

const SS = 8; // supersample: raster pixels per module side
const INSIDE_THRESHOLD = 0.45;
const EDGE_THRESHOLD = 0.18;

const FONT_FAMILY = "QrdockGlyph";
const FONT_URL = "/fonts/archivo-black.woff2";
const FONT_FALLBACK = `"Arial Black", "Segoe UI", system-ui, sans-serif`;

let fontPromise: Promise<void> | null = null;

/** Load the bundled glyph font once; resolve even on failure (system fallback). */
export function ensureLetterFont(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (!fontPromise) {
    fontPromise = (async () => {
      try {
        const face = new FontFace(FONT_FAMILY, `url(${FONT_URL})`, {
          weight: "400",
          display: "swap",
        });
        await face.load();
        document.fonts.add(face);
      } catch {
        // fall back to system bold sans — coverage thresholds are tolerant
      }
    })();
  }
  return fontPromise;
}

export function sanitizeLetters(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
}

/**
 * Build the coverage map for a matrix of the given size.
 * `functional` cells are always coverage 0 — finders, timing, alignment,
 * format and version info must never look letter-styled.
 */
export function buildLetterMap(
  matrixSize: number,
  functional: Uint8Array,
  rawText: string,
): LetterMap {
  const text = sanitizeLetters(rawText);
  const coverage = new Uint8Array(matrixSize * matrixSize);
  if (!text || typeof document === "undefined") {
    return { coverage, inkRatio: 0 };
  }

  // ---- band geometry ------------------------------------------------------
  const bandH = Math.max(9, Math.min(13, Math.round(matrixSize * 0.28)));
  const centerRow = matrixSize / 2;
  // columns must clear the finder zones (8 modules each side) + 1 margin
  const colStart = 9;
  const colEnd = matrixSize - 9;
  const availWpx = (colEnd - colStart) * SS;
  const bandHpx = bandH * SS;

  // ---- rasterize glyphs ---------------------------------------------------
  const px = matrixSize * SS;
  const canvas = document.createElement("canvas");
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { coverage, inkRatio: 0 };

  ctx.clearRect(0, 0, px, px);
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // letter-spacing via manual per-glyph placement for even module coverage
  let fontPx = bandHpx * 1.06; // cap-height of Archivo Black ≈ 0.72em → fills band
  ctx.font = `${fontPx}px ${FONT_FAMILY}, ${FONT_FALLBACK}`;
  const gap = SS * 1.2;
  const measure = () =>
    text.split("").reduce((w, ch) => w + ctx.measureText(ch).width, 0) +
    gap * (text.length - 1);

  let total = measure();
  if (total > availWpx) {
    fontPx *= availWpx / total;
    ctx.font = `${fontPx}px ${FONT_FAMILY}, ${FONT_FALLBACK}`;
    total = measure();
  }

  let x = (px - total) / 2;
  const cy = centerRow * SS;
  for (const ch of text) {
    const w = ctx.measureText(ch).width;
    ctx.fillText(ch, x + w / 2, cy);
    x += w + gap;
  }

  // ---- sample coverage per module -----------------------------------------
  const data = ctx.getImageData(0, 0, px, px).data;
  const rowMin = Math.max(0, Math.floor(centerRow - bandH / 2) - 1);
  const rowMax = Math.min(matrixSize - 1, Math.ceil(centerRow + bandH / 2) + 1);

  let insideCells = 0;
  for (let r = rowMin; r <= rowMax; r++) {
    for (let c = colStart; c < colEnd; c++) {
      const idx = r * matrixSize + c;
      if (functional[idx] === 1) continue;
      let ink = 0;
      const y0 = r * SS;
      const x0 = c * SS;
      for (let dy = 0; dy < SS; dy++) {
        let p = ((y0 + dy) * px + x0) * 4 + 3; // alpha channel
        for (let dx = 0; dx < SS; dx++, p += 4) {
          if (data[p] > 96) ink++;
        }
      }
      const frac = ink / (SS * SS);
      if (frac >= INSIDE_THRESHOLD) {
        coverage[idx] = 2;
        insideCells++;
      } else if (frac >= EDGE_THRESHOLD) {
        coverage[idx] = 1;
      }
    }
  }

  // Degenerate raster (font missing, size too small): report zero coverage so
  // the caller can fall back to plain styling rather than invisible letters.
  if (insideCells < text.length * 4) {
    coverage.fill(0);
    return { coverage, inkRatio: 0 };
  }

  return { coverage, inkRatio: 0 };
}
