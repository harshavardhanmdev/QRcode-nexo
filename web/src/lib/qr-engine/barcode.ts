import JsBarcode from "jsbarcode";

/**
 * 1D barcode generation via JsBarcode with per-format validation and hints.
 * Browser-only (renders onto a detached SVG element, then serializes).
 */

export type BarcodeFormat =
  | "code128"
  | "ean13"
  | "ean8"
  | "upca"
  | "code39"
  | "itf14";

export interface BarcodeFormatSpec {
  id: BarcodeFormat;
  label: string;
  jsbarcode: string;
  placeholder: string;
  hint: string;
  /** returns an error message, or null when the value can pass to JsBarcode */
  precheck: (v: string) => string | null;
}

const digits = (n: number, m?: number) => (v: string) =>
  new RegExp(`^\\d{${n}${m ? `,${m}` : ""}}$`).test(v);

export const barcodeFormats: BarcodeFormatSpec[] = [
  {
    id: "code128",
    label: "Code 128",
    jsbarcode: "CODE128",
    placeholder: "QRDOCK-0001",
    hint: "Any text or numbers (letters, digits, symbols) — the everyday logistics format.",
    precheck: (v) =>
      v.length === 0
        ? "Enter the barcode content"
        : v.length > 48
          ? "Keep it under 48 characters for reliable scanning"
          : /^[\x20-\x7e]+$/.test(v)
            ? null
            : "Code 128 supports plain ASCII characters only",
  },
  {
    id: "ean13",
    label: "EAN-13",
    jsbarcode: "EAN13",
    placeholder: "8901234123457",
    hint: "12 digits (checksum added automatically) or full 13 — retail products worldwide.",
    precheck: (v) =>
      digits(12, 13)(v) ? null : "EAN-13 needs 12 digits (or 13 with checksum)",
  },
  {
    id: "ean8",
    label: "EAN-8",
    jsbarcode: "EAN8",
    placeholder: "9638507",
    hint: "7 digits (checksum added automatically) — small retail packaging.",
    precheck: (v) =>
      digits(7, 8)(v) ? null : "EAN-8 needs 7 digits (or 8 with checksum)",
  },
  {
    id: "upca",
    label: "UPC-A",
    jsbarcode: "UPC",
    placeholder: "03600029145",
    hint: "11 digits (checksum added automatically) — North American retail.",
    precheck: (v) =>
      digits(11, 12)(v) ? null : "UPC-A needs 11 digits (or 12 with checksum)",
  },
  {
    id: "code39",
    label: "Code 39",
    jsbarcode: "CODE39",
    placeholder: "QRDOCK 39",
    hint: "A–Z, 0–9 and - . $ / + % space — legacy industrial format.",
    precheck: (v) =>
      v.length === 0
        ? "Enter the barcode content"
        : /^[A-Z0-9\-. $/+%]+$/.test(v.toUpperCase())
          ? null
          : "Code 39 supports A–Z, 0–9 and - . $ / + % only",
  },
  {
    id: "itf14",
    label: "ITF-14",
    jsbarcode: "ITF14",
    placeholder: "1540014128876",
    hint: "13 digits (checksum added automatically) — shipping cartons (GTIN-14).",
    precheck: (v) =>
      digits(13, 14)(v) ? null : "ITF-14 needs 13 digits (or 14 with checksum)",
  },
];

export function barcodeSpec(id: BarcodeFormat): BarcodeFormatSpec {
  return barcodeFormats.find((f) => f.id === id) ?? barcodeFormats[0];
}

export interface BarcodeOptions {
  format: BarcodeFormat;
  value: string;
  lineColor: string;
  background: string; // "" = transparent
  height: number; // bar height px
  showText: boolean;
}

export interface BarcodeResult {
  svg: string | null;
  width: number;
  height: number;
  error: string | null;
}

export function generateBarcodeSvg(opts: BarcodeOptions): BarcodeResult {
  const spec = barcodeSpec(opts.format);
  const value =
    opts.format === "code39" ? opts.value.toUpperCase() : opts.value.trim();

  const pre = spec.precheck(value);
  if (pre) return { svg: null, width: 0, height: 0, error: pre };

  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  let valid = true;
  try {
    JsBarcode(el, value, {
      format: spec.jsbarcode,
      lineColor: opts.lineColor,
      background: opts.background || "rgba(0,0,0,0)",
      height: opts.height,
      displayValue: opts.showText,
      font: "monospace", // generic family renders correctly in svg-as-image export
      fontSize: 16,
      textMargin: 4,
      margin: 16,
      valid: (v: boolean) => {
        valid = v;
      },
    });
  } catch {
    valid = false;
  }
  if (!valid) {
    return {
      svg: null,
      width: 0,
      height: 0,
      error: "That value isn't valid for this format — check the digits/checksum.",
    };
  }

  const width = Number(el.getAttribute("width")) || 200;
  const height = Number(el.getAttribute("height")) || opts.height + 40;
  // ensure a viewBox so the preview and raster scale cleanly
  if (!el.getAttribute("viewBox")) {
    el.setAttribute("viewBox", `0 0 ${width} ${height}`);
  }
  return { svg: el.outerHTML, width, height, error: null };
}
