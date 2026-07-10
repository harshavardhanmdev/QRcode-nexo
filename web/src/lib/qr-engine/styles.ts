import type { EyeDotShape, EyeFrameShape, ModuleShape } from "./types";

/**
 * Path builders for data modules and finder eyes.
 * All coordinates are in module units (1 module = 1 unit).
 */

export interface Neighbors {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

const f = (n: number) => Number(n.toFixed(3));

/** Rounded rect with per-corner radii [tl, tr, br, bl]. */
function roundedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  radii: [number, number, number, number],
): string {
  const [tl, tr, br, bl] = radii.map((r) => Math.min(r, w / 2, h / 2));
  return (
    `M${f(x + tl)} ${f(y)}` +
    `h${f(w - tl - tr)}` +
    (tr ? `a${f(tr)} ${f(tr)} 0 0 1 ${f(tr)} ${f(tr)}` : "") +
    `v${f(h - tr - br)}` +
    (br ? `a${f(br)} ${f(br)} 0 0 1 ${f(-br)} ${f(br)}` : "") +
    `h${f(-(w - br - bl))}` +
    (bl ? `a${f(bl)} ${f(bl)} 0 0 1 ${f(-bl)} ${f(-bl)}` : "") +
    `v${f(-(h - bl - tl))}` +
    (tl ? `a${f(tl)} ${f(tl)} 0 0 1 ${f(tl)} ${f(-tl)}` : "") +
    `Z`
  );
}

function circlePath(cx: number, cy: number, r: number): string {
  return (
    `M${f(cx - r)} ${f(cy)}` +
    `a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0` +
    `a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0Z`
  );
}

/**
 * Path for one data module.
 * @param col,row grid position
 * @param scale   0–1.06 module size (1.03+ fuses neighbors — letter strokes)
 */
export function modulePath(
  shape: ModuleShape,
  col: number,
  row: number,
  scale: number,
  n: Neighbors,
): string {
  const inset = (1 - scale) / 2;
  const x = col + inset;
  const y = row + inset;
  const s = scale;

  switch (shape) {
    case "square":
      return `M${f(x)} ${f(y)}h${f(s)}v${f(s)}h${f(-s)}Z`;
    case "dot":
      return circlePath(col + 0.5, row + 0.5, s / 2);
    case "rounded":
      return roundedRect(x, y, s, s, [s * 0.32, s * 0.32, s * 0.32, s * 0.32]);
    case "classy": {
      // round only the corners that face empty space → connected, flowing look
      const r = s * 0.5;
      const tl = !n.up && !n.left ? r : 0;
      const tr = !n.up && !n.right ? r : 0;
      const br = !n.down && !n.right ? r : 0;
      const bl = !n.down && !n.left ? r : 0;
      return roundedRect(x, y, s, s, [tl, tr, br, bl]);
    }
    case "diamond": {
      const cx = col + 0.5;
      const cy = row + 0.5;
      const h = s / 2;
      return `M${f(cx)} ${f(cy - h)}L${f(cx + h)} ${f(cy)}L${f(cx)} ${f(cy + h)}L${f(cx - h)} ${f(cy)}Z`;
    }
  }
}

/** 7×7 finder ring (outer minus 5×5 hole, fill-rule evenodd). */
export function eyeFramePath(
  shape: EyeFrameShape,
  ox: number,
  oy: number,
): string {
  switch (shape) {
    case "square":
      return (
        `M${ox} ${oy}h7v7h-7Z ` +
        `M${ox + 1} ${oy + 1}v5h5v-5Z`
      );
    case "rounded":
      return (
        roundedRect(ox, oy, 7, 7, [2.1, 2.1, 2.1, 2.1]) +
        " " +
        roundedRect(ox + 1, oy + 1, 5, 5, [1.3, 1.3, 1.3, 1.3])
      );
    case "circle":
      return (
        circlePath(ox + 3.5, oy + 3.5, 3.5) + " " + circlePath(ox + 3.5, oy + 3.5, 2.5)
      );
    case "leaf":
      return (
        roundedRect(ox, oy, 7, 7, [2.6, 0, 2.6, 0]) +
        " " +
        roundedRect(ox + 1, oy + 1, 5, 5, [1.7, 0, 1.7, 0])
      );
  }
}

/** 3×3 finder pupil, origin at eye corner. */
export function eyeDotPath(shape: EyeDotShape, ox: number, oy: number): string {
  const x = ox + 2;
  const y = oy + 2;
  switch (shape) {
    case "square":
      return `M${x} ${y}h3v3h-3Z`;
    case "dot":
      return circlePath(x + 1.5, y + 1.5, 1.5);
    case "rounded":
      return roundedRect(x, y, 3, 3, [0.9, 0.9, 0.9, 0.9]);
  }
}
