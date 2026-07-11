"use client";

import { useGeneratorStore, type DeepPartial } from "@/store/generator-store";
import type { QrStyle } from "@/lib/qr-engine";

interface Preset {
  name: string;
  chip: string; // CSS background for the preview dot
  patch: DeepPartial<QrStyle>;
}

/** Curated looks — all dark-on-light, all pass the live decode check. */
const PRESETS: Preset[] = [
  {
    name: "Classic",
    chip: "#111827",
    patch: {
      fg: { kind: "solid", color: "#111827" },
      bg: { kind: "solid", color: "#ffffff" },
      moduleShape: "square",
      eyeFrame: "square",
      eyeDot: "square",
    },
  },
  {
    name: "Soft",
    chip: "#0f172a",
    patch: {
      fg: { kind: "solid", color: "#0f172a" },
      bg: { kind: "solid", color: "#f8fafc" },
      moduleShape: "rounded",
      eyeFrame: "rounded",
      eyeDot: "rounded",
    },
  },
  {
    name: "Dots",
    chip: "#0a0a0a",
    patch: {
      fg: { kind: "solid", color: "#0a0a0a" },
      bg: { kind: "solid", color: "#ffffff" },
      moduleShape: "dot",
      eyeFrame: "circle",
      eyeDot: "dot",
    },
  },
  {
    name: "Forest",
    chip: "#14532d",
    patch: {
      fg: { kind: "solid", color: "#14532d" },
      bg: { kind: "solid", color: "#f0fdf4" },
      moduleShape: "classy",
      eyeFrame: "leaf",
      eyeDot: "rounded",
    },
  },
  {
    name: "Ocean",
    chip: "linear-gradient(135deg,#0369a1,#1e3a8a)",
    patch: {
      fg: {
        kind: "linear",
        stops: [
          { color: "#0369a1", at: 0 },
          { color: "#1e3a8a", at: 1 },
        ],
        angle: 135,
      },
      bg: { kind: "solid", color: "#ffffff" },
      moduleShape: "rounded",
      eyeFrame: "rounded",
      eyeDot: "rounded",
    },
  },
  {
    name: "Sunset",
    chip: "linear-gradient(135deg,#b91c1c,#7c2d12)",
    patch: {
      fg: {
        kind: "linear",
        stops: [
          { color: "#b91c1c", at: 0 },
          { color: "#7c2d12", at: 1 },
        ],
        angle: 60,
      },
      bg: { kind: "solid", color: "#fffbeb" },
      moduleShape: "classy",
      eyeFrame: "rounded",
      eyeDot: "rounded",
    },
  },
  {
    name: "Grape",
    chip: "radial-gradient(circle,#6d28d9,#312e81)",
    patch: {
      fg: {
        kind: "radial",
        stops: [
          { color: "#6d28d9", at: 0 },
          { color: "#312e81", at: 1 },
        ],
        angle: 0,
      },
      bg: { kind: "solid", color: "#faf5ff" },
      moduleShape: "dot",
      eyeFrame: "circle",
      eyeDot: "dot",
    },
  },
  {
    name: "Candy",
    chip: "linear-gradient(135deg,#be185d,#831843)",
    patch: {
      fg: {
        kind: "linear",
        stops: [
          { color: "#be185d", at: 0 },
          { color: "#831843", at: 1 },
        ],
        angle: 120,
      },
      bg: { kind: "solid", color: "#fdf2f8" },
      moduleShape: "rounded",
      eyeFrame: "circle",
      eyeDot: "rounded",
    },
  },
];

export function PresetGallery() {
  const patchStyle = useGeneratorStore((s) => s.patchStyle);

  return (
    <div>
      <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-fg-faint">
        Quick styles
      </h3>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => patchStyle(p.patch)}
            className="group flex shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-md border border-line px-3 py-2 transition-colors duration-200 hover:border-line-strong"
          >
            <span
              aria-hidden
              className="inline-block size-7 rounded-full border border-line-strong transition-transform duration-200 group-hover:scale-110"
              style={{ background: p.chip }}
            />
            <span className="text-[11px] font-medium text-fg-muted group-hover:text-fg">
              {p.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
