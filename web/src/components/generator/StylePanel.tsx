"use client";

import clsx from "clsx";
import { useId } from "react";
import { useGeneratorStore } from "@/store/generator-store";
import type { EyeDotShape, EyeFrameShape, Fill, ModuleShape } from "@/lib/qr-engine";
import { IconRefresh } from "@/components/ui/icons";

/** Curated fg/bg pairs — every one passes the contrast guardrail. */
const SWATCHES: { fg: string; bg: string; name: string }[] = [
  { fg: "#111827", bg: "#ffffff", name: "Classic" },
  { fg: "#0f172a", bg: "#f1f5f9", name: "Slate" },
  { fg: "#14532d", bg: "#f0fdf4", name: "Forest" },
  { fg: "#1e3a8a", bg: "#eff6ff", name: "Navy" },
  { fg: "#6d28d9", bg: "#faf5ff", name: "Violet" },
  { fg: "#9a3412", bg: "#fff7ed", name: "Ember" },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative size-11 shrink-0 overflow-hidden rounded-md border border-line">
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
          className="w-24 bg-transparent font-heading text-sm text-fg outline-none"
        />
      </div>
    </div>
  );
}

function ShapeButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={clsx(
        "inline-flex size-11 cursor-pointer items-center justify-center rounded-md border transition-all duration-200",
        active
          ? "border-transparent bg-primary-soft text-accent-text ring-2 ring-[var(--ring)]"
          : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

const MODULE_SHAPES: { id: ModuleShape; label: string; preview: React.ReactNode }[] = [
  { id: "square", label: "Square modules", preview: <svg width="18" height="18" viewBox="0 0 18 18"><rect x="1" y="1" width="7" height="7" fill="currentColor"/><rect x="10" y="1" width="7" height="7" fill="currentColor"/><rect x="1" y="10" width="7" height="7" fill="currentColor"/></svg> },
  { id: "dot", label: "Dot modules", preview: <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="4.5" cy="4.5" r="3.2" fill="currentColor"/><circle cx="13.5" cy="4.5" r="3.2" fill="currentColor"/><circle cx="4.5" cy="13.5" r="3.2" fill="currentColor"/></svg> },
  { id: "rounded", label: "Rounded modules", preview: <svg width="18" height="18" viewBox="0 0 18 18"><rect x="1" y="1" width="7" height="7" rx="2.2" fill="currentColor"/><rect x="10" y="1" width="7" height="7" rx="2.2" fill="currentColor"/><rect x="1" y="10" width="7" height="7" rx="2.2" fill="currentColor"/></svg> },
  { id: "classy", label: "Classy modules", preview: <svg width="18" height="18" viewBox="0 0 18 18"><path d="M1 4.5A3.5 3.5 0 0 1 4.5 1H8v7H1V4.5Z" fill="currentColor"/><path d="M10 1h7v7h-3.5A3.5 3.5 0 0 1 10 4.5V1Z" fill="currentColor"/><path d="M1 10h7v7H4.5A3.5 3.5 0 0 1 1 13.5V10Z" fill="currentColor"/></svg> },
  { id: "diamond", label: "Diamond modules", preview: <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4.5 1 8 4.5 4.5 8 1 4.5Z" fill="currentColor"/><path d="M13.5 1 17 4.5 13.5 8 10 4.5Z" fill="currentColor"/><path d="M4.5 10 8 13.5 4.5 17 1 13.5Z" fill="currentColor"/></svg> },
];

const EYE_FRAMES: { id: EyeFrameShape; label: string; rx: number; circle?: boolean; leaf?: boolean }[] = [
  { id: "square", label: "Square eyes", rx: 0 },
  { id: "rounded", label: "Rounded eyes", rx: 4 },
  { id: "circle", label: "Circle eyes", rx: 0, circle: true },
  { id: "leaf", label: "Leaf eyes", rx: 0, leaf: true },
];

const EYE_DOTS: { id: EyeDotShape; label: string }[] = [
  { id: "square", label: "Square pupil" },
  { id: "dot", label: "Round pupil" },
  { id: "rounded", label: "Soft pupil" },
];

export function StylePanel() {
  const style = useGeneratorStore((s) => s.style);
  const patchStyle = useGeneratorStore((s) => s.patchStyle);

  const fgHex = style.fg.kind === "solid" ? style.fg.color : "#111827";
  const bgHex = style.bg.kind === "solid" ? style.bg.color : "#ffffff";

  const setFg = (color: string) => patchStyle({ fg: { kind: "solid", color } as Fill });
  const setBg = (color: string) => patchStyle({ bg: { kind: "solid", color } as Fill });

  return (
    <div className="space-y-6">
      {/* colors */}
      <div>
        <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-fg-faint">
          Colors
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-5">
          <ColorField label="Code" value={fgHex} onChange={setFg} />
          <ColorField label="Background" value={bgHex} onChange={setBg} />
          <button
            type="button"
            onClick={() => {
              setFg(bgHex);
              setBg(fgHex);
            }}
            aria-label="Swap colors"
            title="Swap colors"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <IconRefresh size={17} />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SWATCHES.map((s) => (
            <button
              key={s.name}
              type="button"
              title={s.name}
              aria-label={`${s.name} color pair`}
              onClick={() => {
                setFg(s.fg);
                setBg(s.bg);
              }}
              className="size-8 cursor-pointer rounded-full border border-line transition-transform duration-200 hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${s.fg} 50%, ${s.bg} 50%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* module shape */}
      <div>
        <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-fg-faint">
          Module shape
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {MODULE_SHAPES.map((s) => (
            <ShapeButton
              key={s.id}
              label={s.label}
              active={style.moduleShape === s.id}
              onClick={() => patchStyle({ moduleShape: s.id })}
            >
              {s.preview}
            </ShapeButton>
          ))}
        </div>
      </div>

      {/* eyes */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-fg-faint">
            Eye frame
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {EYE_FRAMES.map((e) => (
              <ShapeButton
                key={e.id}
                label={e.label}
                active={style.eyeFrame === e.id}
                onClick={() => patchStyle({ eyeFrame: e.id })}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  {e.circle ? (
                    <circle cx="9" cy="9" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
                  ) : e.leaf ? (
                    <path
                      d="M7 1.5h9.5V11a5.5 5.5 0 0 1-5.5 5.5H1.5V7A5.5 5.5 0 0 1 7 1.5Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                    />
                  ) : (
                    <rect
                      x="1.5"
                      y="1.5"
                      width="15"
                      height="15"
                      rx={e.rx}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                    />
                  )}
                </svg>
              </ShapeButton>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-fg-faint">
            Eye pupil
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {EYE_DOTS.map((e) => (
              <ShapeButton
                key={e.id}
                label={e.label}
                active={style.eyeDot === e.id}
                onClick={() => patchStyle({ eyeDot: e.id })}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  {e.id === "dot" ? (
                    <circle cx="9" cy="9" r="5.5" fill="currentColor" />
                  ) : (
                    <rect x="3.5" y="3.5" width="11" height="11" rx={e.id === "rounded" ? 3.4 : 0} fill="currentColor" />
                  )}
                </svg>
              </ShapeButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
