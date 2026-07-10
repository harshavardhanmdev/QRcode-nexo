import type {
  BgFill,
  EngineWarning,
  Fill,
  LetterMap,
  QrMatrix,
  QrStyle,
  RenderResult,
} from "./types";
import { modulePath, eyeFramePath, eyeDotPath, type Neighbors } from "./styles";
import { finderOrigins, isInFinder } from "./function-patterns";
import { checkContrast, parseHex, luminance as relLum } from "./contrast";

/**
 * Composes the final SVG string:
 *   defs (gradients) → background → data modules (dot layer + letter layer +
 *   tint layer) → function modules → finder eyes → logo → (frame handled by
 *   frames.ts wrapping this output).
 *
 * Deterministic output: ids derive from `idSuffix` only — SSR-safe, no Math.random.
 */

const LETTER_SCALE = 1.03;
const FUNC_SCALE = 0.94;

interface RenderOptions {
  matrix: QrMatrix;
  style: QrStyle;
  letterMap?: LetterMap | null;
  idSuffix?: string;
}

function fillAttr(fill: Fill, id: string): string {
  return fill.kind === "solid" ? fill.color : `url(#${id})`;
}

function gradientDef(fill: Fill, id: string, size: number): string {
  if (fill.kind === "solid") return "";
  const [s0, s1] = fill.stops;
  const stops =
    `<stop offset="${s0.at * 100}%" stop-color="${s0.color}"/>` +
    `<stop offset="${s1.at * 100}%" stop-color="${s1.color}"/>`;
  if (fill.kind === "radial") {
    const r = size * 0.72;
    return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${size / 2}" cy="${size / 2}" r="${r}">${stops}</radialGradient>`;
  }
  const rad = ((fill.angle - 90) * Math.PI) / 180;
  const cx = size / 2;
  const half = size / 2;
  const dx = Math.cos(rad) * half;
  const dy = Math.sin(rad) * half;
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${(cx - dx).toFixed(2)}" y1="${(cx - dy).toFixed(2)}" x2="${(cx + dx).toFixed(2)}" y2="${(cx + dy).toFixed(2)}">${stops}</linearGradient>`;
}

function rgba(hex: string, alpha: number): string {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

/** Fraction of the code area the logo may cover before scanning degrades. */
export function logoAreaBudget(letterEnabled: boolean): number {
  return letterEnabled ? 0.05 : 0.08; // area fraction (≈ 22% / 28% width)
}

export function renderSvg(opts: RenderOptions): RenderResult {
  const { matrix, style, letterMap = null, idSuffix = "0" } = opts;
  const { size, dark, functional } = matrix;
  const qz = Math.max(2, style.quietZone);
  const warnings: EngineWarning[] = [];

  const fgId = `qr-fg-${idSuffix}`;
  const bgId = `qr-bg-${idSuffix}`;

  const isDark = (r: number, c: number) =>
    r >= 0 && r < size && c >= 0 && c < size && dark[r * size + c] === 1;
  const isFunc = (r: number, c: number) => functional[r * size + c] === 1;
  const letterAt = (r: number, c: number): number =>
    letterMap ? letterMap.coverage[r * size + c] : 0;

  // --- logo knockout region (center square, cleared when knockout on) -----
  let knock = { active: false, r0: 0, r1: 0, c0: 0, c1: 0 };
  if (style.logo.dataUrl && style.logo.knockout) {
    const logoModules = Math.round(size * style.logo.sizePct) + 2; // padding ring
    const start = Math.floor((size - logoModules) / 2);
    knock = {
      active: true,
      r0: start,
      r1: start + logoModules,
      c0: start,
      c1: start + logoModules,
    };
  }
  const inKnockout = (r: number, c: number) =>
    knock.active && r >= knock.r0 && r < knock.r1 && c >= knock.c0 && c < knock.c1;

  // --- module layers -------------------------------------------------------
  const dotParts: string[] = [];
  const letterParts: string[] = [];
  const tintParts: string[] = [];
  const funcParts: string[] = [];

  const dotScale = style.letters.enabled
    ? Math.max(0.55, Math.min(0.8, style.letters.dotScale))
    : 1;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isInFinder(r, c, size)) continue; // eyes drawn separately
      if (inKnockout(r, c)) continue;

      const funcHere = isFunc(r, c);
      const darkHere = isDark(r, c);

      if (funcHere) {
        if (darkHere) {
          funcParts.push(modulePath("square", c, r, FUNC_SCALE, NO_NEIGHBORS));
        }
        continue;
      }

      const cov = letterAt(r, c);

      if (darkHere) {
        if (style.letters.enabled && cov === 2) {
          // letter stroke: oversized square fused with neighbors
          letterParts.push(modulePath("square", c, r, LETTER_SCALE, NO_NEIGHBORS));
        } else if (style.letters.enabled && cov === 1) {
          // stroke edge: intermediate emphasis smooths the glyph outline
          letterParts.push(modulePath("rounded", c, r, 0.92, NO_NEIGHBORS));
        } else {
          const shape = style.letters.enabled ? "dot" : style.moduleShape;
          const scale = style.letters.enabled ? dotScale : moduleScale(style.moduleShape);
          const n: Neighbors =
            shape === "classy"
              ? {
                  up: isDark(r - 1, c) && !isFunc(r - 1, c),
                  down: isDark(r + 1, c) && !isFunc(r + 1, c),
                  left: isDark(r, c - 1) && !isFunc(r, c - 1),
                  right: isDark(r, c + 1) && !isFunc(r, c + 1),
                }
              : NO_NEIGHBORS;
          dotParts.push(modulePath(shape, c, r, scale, n));
        }
      } else if (style.letters.enabled && cov === 2 && style.letters.tintAlpha > 0) {
        // light module inside a letter stroke: faint tint keeps the glyph
        // readable across white areas without breaking the 40% reflectance rule
        tintParts.push(modulePath("rounded", c, r, 0.9, NO_NEIGHBORS));
      }
    }
  }

  // --- eyes ----------------------------------------------------------------
  const eyeParts: string[] = [];
  for (const [orow, ocol] of finderOrigins(size)) {
    eyeParts.push(eyeFramePath(style.eyeFrame, ocol, orow));
  }
  const eyeDotParts: string[] = [];
  for (const [orow, ocol] of finderOrigins(size)) {
    eyeDotParts.push(eyeDotPath(style.eyeDot, ocol, orow));
  }

  // --- warnings & risk -----------------------------------------------------
  const contrast = checkContrast(style.fg, style.bg);
  let risk = 0;

  if (contrast.worstRatio < 4) {
    warnings.push({
      code: "low-contrast",
      message: `Foreground/background contrast is ${contrast.worstRatio.toFixed(1)}:1 — scanners want 4:1 or better.`,
      hint: "Darken the code color or lighten the background.",
    });
    risk += contrast.worstRatio < 2.5 ? 45 : 22;
  }
  if (contrast.inverted) {
    warnings.push({
      code: "inverted-colors",
      message: "Light code on a dark background — some older scanner apps refuse inverted codes.",
      hint: "Swap the colors for maximum compatibility.",
    });
    risk += 12;
  }
  if (contrast.transparentBg) {
    warnings.push({
      code: "transparent-bg",
      message: "Transparent background: scannability depends on the surface you place it on.",
      hint: "Keep the placement surface light and uncluttered.",
    });
    risk += 5;
  }
  if (style.logo.dataUrl) {
    const area = style.logo.sizePct * style.logo.sizePct;
    if (area > logoAreaBudget(style.letters.enabled)) {
      warnings.push({
        code: "logo-large",
        message: "The logo is eating more error-correction budget than is safe.",
        hint: style.letters.enabled
          ? "With letters on, keep the logo at 18% or smaller."
          : "Keep the logo at 26% width or smaller.",
      });
      risk += 25;
    } else {
      risk += Math.round(area * 120);
    }
  }
  if (matrix.version > 15 && style.letters.enabled) {
    warnings.push({
      code: "dense-version",
      message: `This payload needs a dense version-${matrix.version} code; the letters will print small.`,
      hint: "Shorten the content or use a dynamic short link.",
    });
    risk += 8;
  }
  risk = Math.min(100, risk);

  // --- compose -------------------------------------------------------------
  const view = size + qz * 2;
  const defs =
    gradientDef(style.fg, fgId, size) +
    (style.bg.kind !== "transparent" ? gradientDef(style.bg as Fill, bgId, size) : "");

  const fgFill = fillAttr(style.fg, fgId);
  // Eyes + timing/alignment must stay maximally dark: with a gradient fg they
  // use the darkest stop as a solid so no finder lands on a weak mid-tone.
  const solidFg =
    style.fg.kind === "solid"
      ? style.fg.color
      : [...style.fg.stops].sort(
          (a, b) => relLum(a.color) - relLum(b.color),
        )[0].color;
  const letterFill = style.letters.accent ?? fgFill;
  const tintColor =
    style.letters.accent && style.letters.accent.startsWith("#")
      ? rgba(style.letters.accent, style.letters.tintAlpha)
      : style.fg.kind === "solid"
        ? rgba(style.fg.color, style.letters.tintAlpha)
        : `rgba(0,0,0,${style.letters.tintAlpha.toFixed(3)})`;

  const bgRect =
    style.bg.kind === "transparent"
      ? ""
      : `<rect x="${-qz}" y="${-qz}" width="${view}" height="${view}" fill="${fillAttr(style.bg as Fill, bgId)}"/>`;

  // logo image (knockout already cleared modules)
  let logoEl = "";
  if (style.logo.dataUrl) {
    const w = size * style.logo.sizePct;
    const xy = (size - w) / 2;
    const rx = style.logo.rounded ? w * 0.18 : 0;
    logoEl = `<image href="${style.logo.dataUrl}" x="${xy}" y="${xy}" width="${w}" height="${w}" preserveAspectRatio="xMidYMid meet"${rx ? ` clip-path="inset(0 round ${rx.toFixed(2)}px)"` : ""}/>`;
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-qz} ${-qz} ${view} ${view}" shape-rendering="geometricPrecision">` +
    (defs ? `<defs>${defs}</defs>` : "") +
    bgRect +
    (dotParts.length ? `<path d="${dotParts.join("")}" fill="${fgFill}"/>` : "") +
    (tintParts.length ? `<path d="${tintParts.join("")}" fill="${tintColor}"/>` : "") +
    (letterParts.length ? `<path d="${letterParts.join("")}" fill="${letterFill}"/>` : "") +
    (funcParts.length ? `<path d="${funcParts.join("")}" fill="${solidFg}"/>` : "") +
    `<path d="${eyeParts.join(" ")}" fill="${solidFg}" fill-rule="evenodd"/>` +
    `<path d="${eyeDotParts.join(" ")}" fill="${solidFg}"/>` +
    logoEl +
    `</svg>`;

  return {
    svg,
    sizeModules: view,
    version: matrix.version,
    maskPattern: matrix.maskPattern,
    warnings,
    riskScore: risk,
  };
}

const NO_NEIGHBORS: Neighbors = { up: false, down: false, left: false, right: false };

function moduleScale(shape: string): number {
  switch (shape) {
    case "dot":
      return 0.82;
    case "rounded":
      return 0.94;
    case "diamond":
      return 1;
    default:
      return 1;
  }
}
