/**
 * Decorative hero QR — a hand-laid 25×25 grid that previews the product's
 * signature output: dot modules with the letters "QR" fused into the pattern.
 * Pure server-rendered SVG (deterministic, zero JS). Not a scannable code —
 * the live generator below produces the real thing.
 */

const SIZE = 25;

// 5×7 pixel glyphs
const GLYPHS: Record<string, number[]> = {
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function buildGrid() {
  const rand = seededRandom(20260710);
  const dark: boolean[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => rand() < 0.46),
  );
  const letter: boolean[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => false),
  );

  // letters "QR" centered: 2 glyphs × 5 wide + 1 gap = 11 cols, 7 rows
  const startCol = Math.floor((SIZE - 11) / 2);
  const startRow = Math.floor((SIZE - 7) / 2);
  (["Q", "R"] as const).forEach((ch, gi) => {
    const rows = GLYPHS[ch];
    rows.forEach((bits, r) => {
      for (let c = 0; c < 5; c++) {
        if ((bits >> (4 - c)) & 1) {
          const rr = startRow + r;
          const cc = startCol + gi * 6 + c;
          letter[rr][cc] = true;
          dark[rr][cc] = true;
        }
      }
    });
  });

  return { dark, letter };
}

function isFinderZone(r: number, c: number) {
  return (r < 8 && c < 8) || (r < 8 && c >= SIZE - 8) || (r >= SIZE - 8 && c < 8);
}

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={6}
        height={6}
        rx={1.6}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.9} fill="var(--brand-b)" />
    </g>
  );
}

export function HeroQr({ className }: { className?: string }) {
  const { dark, letter } = buildGrid();
  const cells: React.ReactNode[] = [];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (isFinderZone(r, c)) continue;
      if (!dark[r][c]) continue;
      if (letter[r][c]) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c - 0.03}
            y={r - 0.03}
            width={1.06}
            height={1.06}
            fill="var(--primary)"
          />,
        );
      } else {
        cells.push(
          <circle
            key={`${r}-${c}`}
            cx={c + 0.5}
            cy={r + 0.5}
            r={0.31}
            fill="currentColor"
          />,
        );
      }
    }
  }

  return (
    <svg
      viewBox={`-2 -2 ${SIZE + 4} ${SIZE + 4}`}
      className={className}
      role="img"
      aria-label="Stylized QR code with the letters Q R visible inside the pattern"
    >
      {cells}
      <Finder x={0} y={0} />
      <Finder x={SIZE - 7} y={0} />
      <Finder x={0} y={SIZE - 7} />
    </svg>
  );
}
