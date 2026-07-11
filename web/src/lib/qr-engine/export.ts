/**
 * Export pipeline — SVG string → file download / raster / clipboard.
 * Browser-only (uses canvas + Blob); never imported by server components.
 */

export type RasterFormat = "png" | "jpeg" | "webp";
export type ExportFormat = RasterFormat | "svg";
export type ExportSize = 512 | 1024 | 2048 | 4096;

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // give the browser a beat before revoking
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function svgBlob(svg: string): Blob {
  return new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
}

/** Render the SVG string onto a fresh canvas at w×h. */
export async function svgToCanvasRect(
  svg: string,
  w: number,
  h: number,
  matteWhite = false,
): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(svgBlob(svg));
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("SVG rasterization failed"));
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas 2D unavailable");

    if (matteWhite) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Square convenience wrapper (QR codes). */
export function svgToCanvas(
  svg: string,
  px: number,
  matteWhite = false,
): Promise<HTMLCanvasElement> {
  return svgToCanvasRect(svg, px, px, matteWhite);
}

/** Rasterize the SVG at `px` and return a Blob in the requested format. */
export async function rasterize(
  svg: string,
  px: number,
  format: RasterFormat,
): Promise<Blob> {
  // JPEG has no alpha — matte on white like print would
  const canvas = await svgToCanvas(svg, px, format === "jpeg");
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, `image/${format}`, format === "jpeg" ? 0.92 : undefined),
  );
  if (!blob) throw new Error(`Export to ${format} failed`);
  return blob;
}

export async function downloadCode(opts: {
  svg: string;
  format: ExportFormat;
  px: ExportSize;
  baseName: string;
}): Promise<void> {
  const name = opts.baseName.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() || "qrdock";
  if (opts.format === "svg") {
    downloadBlob(svgBlob(opts.svg), `${name}.svg`);
    return;
  }
  const blob = await rasterize(opts.svg, opts.px, opts.format);
  downloadBlob(blob, `${name}-${opts.px}px.${opts.format}`);
}

/**
 * Copy as PNG. The ClipboardItem must be constructed synchronously within the
 * user gesture (Safari), so it wraps the pending blob promise.
 */
export async function copyPngToClipboard(svg: string, px = 1024): Promise<void> {
  const item = new ClipboardItem({ "image/png": rasterize(svg, px, "png") });
  await navigator.clipboard.write([item]);
}
