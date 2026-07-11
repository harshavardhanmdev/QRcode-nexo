"use client";

import { useId } from "react";
import clsx from "clsx";
import { useGeneratorStore } from "@/store/generator-store";
import type { BgFill, Fill } from "@/lib/qr-engine";
import { IconRefresh } from "@/components/ui/icons";

export function ColorSwatchInput({
  label,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  compact?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={clsx(
          "relative shrink-0 overflow-hidden rounded-md border border-line",
          compact ? "size-9" : "size-11",
        )}
      >
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} color picker`}
          className="absolute -inset-2 size-[calc(100%+1rem)] cursor-pointer"
        />
      </div>
      <div className="min-w-0">
        <label htmlFor={id} className="block text-[13px] font-medium text-fg-muted">
          {label}
        </label>
        <input
          key={value}
          type="text"
          defaultValue={value}
          onChange={(e) => {
            const v = e.target.value.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
          }}
          aria-label={`${label} hex value`}
          spellCheck={false}
          className="w-20 bg-transparent font-heading text-sm text-fg outline-none"
        />
      </div>
    </div>
  );
}

/** Curated fg/bg pairs — every one passes the contrast guardrail. */
const SWATCHES: { fg: string; bg: string; name: string }[] = [
  { fg: "#111827", bg: "#ffffff", name: "Classic" },
  { fg: "#0f172a", bg: "#f1f5f9", name: "Slate" },
  { fg: "#14532d", bg: "#f0fdf4", name: "Forest" },
  { fg: "#1e3a8a", bg: "#eff6ff", name: "Navy" },
  { fg: "#6d28d9", bg: "#faf5ff", name: "Violet" },
  { fg: "#9a3412", bg: "#fff7ed", name: "Ember" },
];

type FillMode = "solid" | "linear" | "radial";

export function FillEditor() {
  const fg = useGeneratorStore((s) => s.style.fg);
  const bg = useGeneratorStore((s) => s.style.bg);
  const patchStyle = useGeneratorStore((s) => s.patchStyle);

  const mode: FillMode = fg.kind;
  const stops: [string, string] =
    fg.kind === "solid"
      ? [fg.color, "#1e3a8a"]
      : [fg.stops[0].color, fg.stops[1].color];
  const angle = fg.kind === "linear" ? fg.angle : 45;
  const bgHex = bg.kind === "solid" ? bg.color : "#ffffff";
  const bgTransparent = bg.kind === "transparent";

  const setMode = (m: FillMode) => {
    if (m === "solid") {
      patchStyle({ fg: { kind: "solid", color: stops[0] } as Fill });
    } else {
      patchStyle({
        fg: {
          kind: m,
          stops: [
            { color: stops[0], at: 0 },
            { color: stops[1], at: 1 },
          ],
          angle,
        } as Fill,
      });
    }
  };

  const setStop = (i: 0 | 1, color: string) => {
    if (fg.kind === "solid") {
      patchStyle({ fg: { kind: "solid", color } as Fill });
      return;
    }
    const next: Fill = {
      ...fg,
      stops: [
        { color: i === 0 ? color : fg.stops[0].color, at: 0 },
        { color: i === 1 ? color : fg.stops[1].color, at: 1 },
      ],
    };
    patchStyle({ fg: next });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-fg-faint">
          Code fill
        </h3>
        <div role="radiogroup" aria-label="Fill type" className="flex rounded-md border border-line p-0.5">
          {(["solid", "linear", "radial"] as FillMode[]).map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={clsx(
                "h-7 cursor-pointer rounded-[0.3rem] px-2.5 text-[11px] font-medium capitalize transition-colors",
                mode === m ? "bg-primary text-primary-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
        {mode === "solid" ? (
          <ColorSwatchInput label="Code" value={stops[0]} onChange={(c) => setStop(0, c)} />
        ) : (
          <>
            <ColorSwatchInput label="From" value={stops[0]} onChange={(c) => setStop(0, c)} />
            <ColorSwatchInput label="To" value={stops[1]} onChange={(c) => setStop(1, c)} />
          </>
        )}
        <ColorSwatchInput
          label="Background"
          value={bgHex}
          onChange={(c) => patchStyle({ bg: { kind: "solid", color: c } as BgFill })}
        />
        <button
          type="button"
          onClick={() => {
            if (fg.kind === "solid" && bg.kind === "solid") {
              patchStyle({
                fg: { kind: "solid", color: bgHex } as Fill,
                bg: { kind: "solid", color: stops[0] } as BgFill,
              });
            }
          }}
          aria-label="Swap colors"
          title="Swap colors (solid mode)"
          disabled={fg.kind !== "solid" || bg.kind !== "solid"}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-40"
        >
          <IconRefresh size={17} />
        </button>
      </div>

      {mode === "linear" && (
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-fg-muted">Angle</span>
            <span className="font-heading text-xs text-fg-faint">{angle}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={angle}
            aria-label="Gradient angle"
            onChange={(e) =>
              fg.kind === "linear" &&
              patchStyle({ fg: { ...fg, angle: Number(e.target.value) } as Fill })
            }
            className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-primary-soft accent-[var(--primary)]"
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {SWATCHES.map((s) => (
          <button
            key={s.name}
            type="button"
            title={s.name}
            aria-label={`${s.name} color pair`}
            onClick={() =>
              patchStyle({
                fg: { kind: "solid", color: s.fg } as Fill,
                bg: { kind: "solid", color: s.bg } as BgFill,
              })
            }
            className="size-8 cursor-pointer rounded-full border border-line-strong transition-transform duration-200 hover:scale-110"
            style={{ background: `linear-gradient(135deg, ${s.fg} 55%, ${s.bg} 55%)` }}
          />
        ))}
        <label className="ml-1 flex cursor-pointer select-none items-center gap-2 text-[13px] text-fg-muted">
          <input
            type="checkbox"
            checked={bgTransparent}
            onChange={(e) =>
              patchStyle({
                bg: e.target.checked
                  ? ({ kind: "transparent" } as BgFill)
                  : ({ kind: "solid", color: "#ffffff" } as BgFill),
              })
            }
            className="size-4 cursor-pointer accent-[var(--primary)]"
          />
          Transparent background
        </label>
      </div>
    </div>
  );
}
