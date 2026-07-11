/**
 * Decorative hero QR — a hand-laid 25×25 grid styled EXACTLY like the
 * product's real output: white sticker plate, dark ink, solid green letters
 * built from modules. Server-rendered SVG with deterministic per-cell
 * animation delays (build-in stagger + a few twinkling modules).
 * Not a scannable code — the live generator below produces the real thing.
 */

const SIZE = 25;
const INK = "#111827";
const ACCENT = "#16a34a";

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
  const rand = seededRandom(20260711);
  const dark: boolean[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => rand() < 0.44),
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

function delayFor(r: number, c: number): string {
  return `${Math.round((r + c) * 24)}ms`;
}

function Finder({ x, y, delay }: { x: number; y: number; delay: string }) {
  return (
    <g className="hero-cell" style={{ animationDelay: delay }}>
      <path
        fillRule="evenodd"
        fill={INK}
        d={`M${x} ${y + 2}a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2Z M${x + 1} ${y + 2.1}a1.1 1.1 0 0 1 1.1-1.1h2.8a1.1 1.1 0 0 1 1.1 1.1v2.8a1.1 1.1 0 0 1-1.1 1.1h-2.8a1.1 1.1 0 0 1-1.1-1.1Z`}
      />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.9} fill={ACCENT} />
    </g>
  );
}

export function HeroQr({ className }: { className?: string }) {
  const { dark, letter } = buildGrid();
  const rand = seededRandom(7);
  const cells: React.ReactNode[] = [];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (isFinderZone(r, c)) continue;
      if (!dark[r][c]) continue;
      const twinkle = !letter[r][c] && rand() < 0.05;
      const cls = twinkle ? "hero-cell hero-twinkle" : "hero-cell";
      const style = {
        animationDelay: twinkle
          ? `${delayFor(r, c)}, ${Math.round(rand() * 2600)}ms`
          : delayFor(r, c),
      };
      if (letter[r][c]) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            className="hero-cell"
            style={{ animationDelay: delayFor(r, c) }}
            x={c - 0.04}
            y={r - 0.04}
            width={1.08}
            height={1.08}
            fill={ACCENT}
          />,
        );
      } else {
        cells.push(
          <circle
            key={`${r}-${c}`}
            className={cls}
            style={style}
            cx={c + 0.5}
            cy={r + 0.5}
            r={0.34}
            fill={INK}
          />,
        );
      }
    }
  }

  return (
    <svg
      viewBox={`-1.5 -1.5 ${SIZE + 3} ${SIZE + 3}`}
      className={className}
      role="img"
      aria-label="Stylized QR code with the letters Q R built from its modules"
    >
      {cells}
      <Finder x={0} y={0} delay="80ms" />
      <Finder x={SIZE - 7} y={0} delay="360ms" />
      <Finder x={0} y={SIZE - 7} delay="620ms" />
    </svg>
  );
}
