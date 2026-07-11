import type { FrameOptions } from "./types";
import { FRAME_FONT_B64 } from "./frame-font";

/**
 * Frame compositor — wraps the rendered QR SVG in a decorative frame with an
 * optional CTA label ("SCAN ME"). The label font is embedded as a data: URI
 * so the text renders correctly when the SVG is rasterized through <img>
 * (where external font URLs are blocked). Competitors routinely get this
 * wrong and export frames with fallback serif text.
 */

const FONT_FAMILY = "QrdockFrame";

function fontStyle(): string {
  return (
    `<style>@font-face{font-family:'${FONT_FAMILY}';` +
    `src:url(data:font/woff2;base64,${FRAME_FONT_B64}) format('woff2');}</style>`
  );
}

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param inner    the QR <svg> string from the renderer
 * @param sizeModules  the inner svg's viewBox side (modules incl. quiet zone)
 */
export function wrapFrame(
  inner: string,
  frame: FrameOptions,
  sizeModules: number,
): string {
  if (frame.id === "none") return inner;

  const S = 100; // work in a fixed 100-unit coordinate space
  const label = esc(frame.text.trim().toUpperCase() || "SCAN ME");
  const color = frame.color;
  const textColor = frame.textColor;
  const font = fontStyle();
  const qr = (x: number, y: number, w: number) =>
    inner.replace(
      "<svg ",
      `<svg x="${x}" y="${y}" width="${w}" height="${w}" `,
    );

  switch (frame.id) {
    case "label-bottom": {
      const H = 122;
      return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${H}">${font}` +
        `<rect x="1.5" y="1.5" width="${S - 3}" height="${H - 3}" rx="8" fill="#ffffff" stroke="${color}" stroke-width="3"/>` +
        qr(5, 5, 90) +
        `<rect x="1.5" y="${H - 24.5}" width="${S - 3}" height="23" rx="6" fill="${color}"/>` +
        `<rect x="1.5" y="${H - 30}" width="${S - 3}" height="12" fill="${color}"/>` +
        `<text x="${S / 2}" y="${H - 12}" text-anchor="middle" dominant-baseline="middle" font-family="'${FONT_FAMILY}',Arial,sans-serif" font-size="11" fill="${textColor}">${label}</text>` +
        `</svg>`
      );
    }
    case "label-top": {
      const H = 122;
      return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${H}">${font}` +
        `<rect x="1.5" y="1.5" width="${S - 3}" height="${H - 3}" rx="8" fill="#ffffff" stroke="${color}" stroke-width="3"/>` +
        `<rect x="1.5" y="1.5" width="${S - 3}" height="23" rx="6" fill="${color}"/>` +
        `<rect x="1.5" y="19" width="${S - 3}" height="12" fill="${color}"/>` +
        `<text x="${S / 2}" y="13.5" text-anchor="middle" dominant-baseline="middle" font-family="'${FONT_FAMILY}',Arial,sans-serif" font-size="11" fill="${textColor}">${label}</text>` +
        qr(5, 27, 90) +
        `</svg>`
      );
    }
    case "badge": {
      const H = 116;
      const bw = Math.min(86, 18 + label.length * 7);
      return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${H}">${font}` +
        `<rect x="1.5" y="1.5" width="${S - 3}" height="${S - 3}" rx="10" fill="#ffffff" stroke="${color}" stroke-width="3"/>` +
        qr(6, 6, 88) +
        `<rect x="${(S - bw) / 2}" y="${S - 9}" width="${bw}" height="17" rx="8.5" fill="${color}"/>` +
        `<text x="${S / 2}" y="${S + 0.2}" text-anchor="middle" dominant-baseline="middle" font-family="'${FONT_FAMILY}',Arial,sans-serif" font-size="9" fill="${textColor}">${label}</text>` +
        `</svg>`
      );
    }
    case "ticket": {
      const H = 126;
      return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${H}">${font}` +
        `<rect x="1.5" y="1.5" width="${S - 3}" height="${H - 3}" rx="7" fill="#ffffff" stroke="${color}" stroke-width="2.4"/>` +
        qr(5, 5, 90) +
        `<line x1="7" y1="${S - 1}" x2="${S - 7}" y2="${S - 1}" stroke="${color}" stroke-width="1.6" stroke-dasharray="4 3" stroke-linecap="round"/>` +
        `<circle cx="1.5" cy="${S - 1}" r="4.5" fill="${color}"/>` +
        `<circle cx="${S - 1.5}" cy="${S - 1}" r="4.5" fill="${color}"/>` +
        `<text x="${S / 2}" y="${S + 13}" text-anchor="middle" dominant-baseline="middle" font-family="'${FONT_FAMILY}',Arial,sans-serif" font-size="10.5" fill="${color}">${label}</text>` +
        `</svg>`
      );
    }
    default:
      return inner;
  }
}
