import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "qrdock — free QR code and barcode generator with letters inside the pattern";

// Decorative QR-ish dot field (deterministic).
function dots() {
  const cells: { x: number; y: number; c: string; s: number }[] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const palette = ["#22c55e", "#6366f1", "#22d3ee", "#334155", "#334155", "#334155"];
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 9; c++) {
      if (rand() < 0.45) continue;
      cells.push({
        x: c * 34,
        y: r * 34,
        c: palette[Math.floor(rand() * palette.length)],
        s: rand() < 0.25 ? 24 : 14,
      });
    }
  }
  return cells;
}

export default async function OgImage() {
  const font = await readFile(
    path.join(process.cwd(), "src", "assets", "jetbrains-mono-bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#090e1a",
          color: "#f4f6fb",
          fontFamily: "JetBrains Mono",
          position: "relative",
          padding: 72,
        }}
      >
        {/* dot field, right side */}
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 105,
            width: 320,
            height: 420,
            display: "flex",
          }}
        >
          {dots().map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.x + (24 - d.s) / 2,
                top: d.y + (24 - d.s) / 2,
                width: d.s,
                height: d.s,
                background: d.c,
                borderRadius: d.s < 20 ? 999 : 5,
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 720,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 64, fontWeight: 700 }}>qrdock</span>
            <div
              style={{
                width: 22,
                height: 44,
                background: "#22c55e",
                borderRadius: 6,
                marginLeft: 8,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 44,
              lineHeight: 1.25,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>QR codes that spell</span>
            <span style={{ color: "#22c55e" }}>your name.</span>
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 24,
              color: "#9aa7bd",
              display: "flex",
            }}
          >
            Free · No watermarks · Generated in your browser
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "JetBrains Mono", data: font, weight: 700, style: "normal" },
      ],
    },
  );
}
