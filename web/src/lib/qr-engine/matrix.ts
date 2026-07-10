import QRCode from "qrcode";
import type { EccLevel, QrMatrix } from "./types";
import { buildFunctionMask } from "./function-patterns";

interface CreateOptions {
  ecc: EccLevel;
  /** force at least this version (letters need room) */
  minVersion?: number;
  /** force a specific mask pattern 0–7 (letter-forge searches all eight) */
  maskPattern?: number;
}

/**
 * Encode a payload into a module matrix via `qrcode`, then attach our own
 * function-pattern classification for the style pass.
 */
export function createMatrix(payload: string, opts: CreateOptions): QrMatrix {
  const base = {
    errorCorrectionLevel: opts.ecc,
    ...(opts.maskPattern !== undefined
      ? { maskPattern: opts.maskPattern as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 }
      : {}),
  };

  let qr;
  if (opts.minVersion) {
    try {
      qr = QRCode.create(payload, { ...base, version: opts.minVersion });
    } catch {
      // payload too large for the floor version → let the encoder pick
      // (it will land on something bigger than the floor)
      qr = QRCode.create(payload, base);
    }
  } else {
    qr = QRCode.create(payload, base);
  }

  const size = qr.modules.size;
  const dark = new Uint8Array(size * size);
  for (let i = 0; i < size * size; i++) {
    dark[i] = qr.modules.data[i] ? 1 : 0;
  }

  return {
    size,
    version: qr.version,
    maskPattern: (qr as unknown as { maskPattern: number }).maskPattern ?? -1,
    dark,
    functional: buildFunctionMask(qr.version),
  };
}
