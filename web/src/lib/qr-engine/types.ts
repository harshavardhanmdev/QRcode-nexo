/** Shared types for the qrdock QR engine. Pure — no React, no DOM at type level. */

export type QrType =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "email"
  | "sms"
  | "whatsapp"
  | "upi"
  | "location"
  | "event";

export type EccLevel = "L" | "M" | "Q" | "H";

export type ModuleShape = "square" | "dot" | "rounded" | "classy" | "diamond";
export type EyeFrameShape = "square" | "rounded" | "circle" | "leaf";
export type EyeDotShape = "square" | "dot" | "rounded";

export type Fill =
  | { kind: "solid"; color: string }
  | {
      kind: "linear" | "radial";
      stops: [{ color: string; at: number }, { color: string; at: number }];
      /** degrees, linear only */
      angle: number;
    };

export type BgFill = Fill | { kind: "transparent" };

export interface LetterOptions {
  enabled: boolean;
  /** 1–4 chars, A–Z / 0–9 */
  text: string;
  /** accent color for letter modules; null = use foreground fill */
  accent: string | null;
  /** 0–0.35 tint painted on light modules inside letter strokes */
  tintAlpha: number;
  /** 0.55–0.8 scale of non-letter dark modules */
  dotScale: number;
}

export interface LogoOptions {
  /** data: URL kept in memory only — never uploaded, never in share links */
  dataUrl: string | null;
  /** logo width as fraction of code width, 0.12–0.26 */
  sizePct: number;
  /** clear the modules behind the logo */
  knockout: boolean;
  rounded: boolean;
}

export interface FrameOptions {
  id: "none" | "label-bottom" | "label-top" | "badge" | "ticket";
  text: string;
  color: string;
  textColor: string;
}

export interface QrStyle {
  fg: Fill;
  bg: BgFill;
  moduleShape: ModuleShape;
  eyeFrame: EyeFrameShape;
  eyeDot: EyeDotShape;
  letters: LetterOptions;
  logo: LogoOptions;
  frame: FrameOptions;
  ecc: EccLevel;
  /** modules of quiet zone, min 2, default 4 */
  quietZone: number;
}

export type WarningCode =
  | "low-contrast"
  | "gradient-weak-stop"
  | "inverted-colors"
  | "transparent-bg"
  | "logo-large"
  | "dense-version"
  | "tint-clamped"
  | "letters-trimmed";

export interface EngineWarning {
  code: WarningCode;
  message: string;
  /** suggested one-tap fix, shown in the UI */
  hint?: string;
}

export interface QrMatrix {
  size: number;
  version: number;
  maskPattern: number;
  /** row-major darkness */
  dark: Uint8Array;
  /** row-major: 1 = function pattern (finder/timing/alignment/format/version) */
  functional: Uint8Array;
}

export interface LetterMap {
  /** row-major: 0 = outside, 1 = edge, 2 = inside letter stroke */
  coverage: Uint8Array;
  /** letter cells that are dark (higher = better-looking letters) */
  inkRatio: number;
}

export interface RenderResult {
  svg: string;
  /** viewBox size in modules incl. quiet zone */
  sizeModules: number;
  version: number;
  maskPattern: number;
  warnings: EngineWarning[];
  /** 0 (safe) – 100 (unscannable), drives the RiskMeter */
  riskScore: number;
}
