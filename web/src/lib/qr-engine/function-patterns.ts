/**
 * Function-pattern classification per ISO/IEC 18004.
 * The style pass must never restyle these modules — finders, separators,
 * timing, alignment, format info, version info and the dark module — so we
 * compute an authoritative mask independent of the encoder.
 */

/** Alignment pattern center coordinates per version (ISO 18004 Annex E). */
const ALIGNMENT_POSITIONS: number[][] = [
  [], // v1
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170],
];

export function versionSize(version: number): number {
  return version * 4 + 17;
}

export function alignmentCenters(version: number): [number, number][] {
  const coords = ALIGNMENT_POSITIONS[version - 1] ?? [];
  const size = versionSize(version);
  const centers: [number, number][] = [];
  for (const r of coords) {
    for (const c of coords) {
      // skip the three corners that collide with finder patterns
      const topLeft = r <= 8 && c <= 8;
      const topRight = r <= 8 && c >= size - 9;
      const bottomLeft = r >= size - 9 && c <= 8;
      if (topLeft || topRight || bottomLeft) continue;
      centers.push([r, c]);
    }
  }
  return centers;
}

/**
 * Row-major Uint8Array: 1 = function module (or reserved area), 0 = data.
 * Regions:
 *  - three 9×9 corner blocks (finder 7×7 + separator + format-info strips
 *    + the dark module which sits at (size-8, 8))
 *  - timing row/col 6
 *  - alignment 5×5 blocks
 *  - version info (v≥7): 6×3 above bottom-left finder’s right edge? No —
 *    per spec: 3×6 block at rows 0..5, cols size-11..size-9 (top-right)
 *    and 6×3 at rows size-11..size-9, cols 0..5 (bottom-left)
 */
export function buildFunctionMask(version: number): Uint8Array {
  const size = versionSize(version);
  const mask = new Uint8Array(size * size);
  const set = (r: number, c: number) => {
    if (r >= 0 && r < size && c >= 0 && c < size) mask[r * size + c] = 1;
  };

  // corner blocks (finders + separators + format info + dark module)
  for (let r = 0; r <= 8; r++) {
    for (let c = 0; c <= 8; c++) set(r, c); // top-left
    for (let c = size - 8; c < size; c++) set(r, c); // top-right
  }
  for (let r = size - 8; r < size; r++) {
    for (let c = 0; c <= 8; c++) set(r, c); // bottom-left
  }

  // timing patterns
  for (let i = 0; i < size; i++) {
    set(6, i);
    set(i, 6);
  }

  // alignment patterns (5×5 around each center)
  for (const [ar, ac] of alignmentCenters(version)) {
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) set(ar + dr, ac + dc);
    }
  }

  // version information blocks (v ≥ 7)
  if (version >= 7) {
    for (let r = 0; r < 6; r++) {
      for (let c = size - 11; c <= size - 9; c++) set(r, c); // top-right 6×3
    }
    for (let r = size - 11; r <= size - 9; r++) {
      for (let c = 0; c < 6; c++) set(r, c); // bottom-left 3×6
    }
  }

  return mask;
}

/** Finder centers (top-left corner coordinates of each 7×7 eye). */
export function finderOrigins(size: number): [number, number][] {
  return [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ];
}

export function isInFinder(r: number, c: number, size: number): boolean {
  return (
    (r < 7 && c < 7) ||
    (r < 7 && c >= size - 7) ||
    (r >= size - 7 && c < 7)
  );
}
