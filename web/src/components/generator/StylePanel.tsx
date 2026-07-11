"use client";

import clsx from "clsx";
import { useGeneratorStore } from "@/store/generator-store";
import type { EyeDotShape, EyeFrameShape, ModuleShape } from "@/lib/qr-engine";
import { PresetGallery } from "./PresetGallery";
import { FillEditor } from "./FillEditor";
import { LogoUploader } from "./LogoUploader";
import { FramePicker } from "./FramePicker";

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

const EYE_FRAMES: { id: EyeFrameShape; label: string }[] = [
  { id: "square", label: "Square eyes" },
  { id: "rounded", label: "Rounded eyes" },
  { id: "circle", label: "Circle eyes" },
  { id: "leaf", label: "Leaf eyes" },
];

const EYE_DOTS: { id: EyeDotShape; label: string }[] = [
  { id: "square", label: "Square pupil" },
  { id: "dot", label: "Round pupil" },
  { id: "rounded", label: "Soft pupil" },
];

export function StylePanel() {
  const style = useGeneratorStore((s) => s.style);
  const patchStyle = useGeneratorStore((s) => s.patchStyle);

  return (
    <div className="space-y-7">
      <PresetGallery />
      <FillEditor />

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
                  {e.id === "circle" ? (
                    <circle cx="9" cy="9" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
                  ) : e.id === "leaf" ? (
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
                      rx={e.id === "rounded" ? 4 : 0}
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

      <LogoUploader />
      <FramePicker />
    </div>
  );
}
