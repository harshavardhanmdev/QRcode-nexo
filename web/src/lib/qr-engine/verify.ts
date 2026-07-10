import { svgToCanvas } from "./export";

/**
 * Empirical scannability check: rasterize the styled SVG and decode it with
 * a real QR reader (jsQR). Runs debounced after every style change and powers
 * the "Scannability verified" badge — proof, not heuristics.
 *
 * jsQR is ~40 KB so it loads lazily on first verification.
 */

export interface VerifyResult {
  pass: boolean;
  decoded: string | null;
  /** px size that succeeded (smaller = more scan headroom) */
  passedAt: number | null;
}

type JsQrFn = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
) => { data: string } | null;

let jsqrPromise: Promise<JsQrFn> | null = null;

function loadJsQr(): Promise<JsQrFn> {
  if (!jsqrPromise) {
    jsqrPromise = import("jsqr").then((m) => (m.default ?? m) as unknown as JsQrFn);
  }
  return jsqrPromise;
}

export async function verifyScannable(
  svg: string,
  expected: string,
): Promise<VerifyResult> {
  const jsQR = await loadJsQr();

  // 320px ≈ a small on-screen scan; 640px ≈ a comfortable one.
  for (const px of [320, 640]) {
    try {
      const canvas = await svgToCanvas(svg, px, true);
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      const { data, width, height } = ctx.getImageData(0, 0, px, px);
      const decoded = jsQR(data, width, height);
      if (decoded && decoded.data === expected) {
        return { pass: true, decoded: decoded.data, passedAt: px };
      }
    } catch {
      // rasterization hiccup → try the next size
    }
  }
  return { pass: false, decoded: null, passedAt: null };
}
