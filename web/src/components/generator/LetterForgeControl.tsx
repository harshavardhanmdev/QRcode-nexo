"use client";

import { useId } from "react";
import clsx from "clsx";
import { AnimatePresence, m, springs } from "@/components/motion/Motion";
import { useGeneratorStore } from "@/store/generator-store";
import { sanitizeLetters } from "@/lib/qr-engine";
import { IconSparkles } from "@/components/ui/icons";

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] font-medium text-fg-muted">
          {label}
        </label>
        <span className="font-heading text-xs text-fg-faint">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-primary-soft accent-[var(--primary)]"
      />
    </div>
  );
}

export function LetterForgeControl() {
  const letters = useGeneratorStore((s) => s.style.letters);
  const patchStyle = useGeneratorStore((s) => s.patchStyle);
  const inputId = useId();
  const accentId = useId();

  return (
    <div
      className={clsx(
        "rounded-lg border p-4 transition-colors duration-300",
        letters.enabled
          ? "border-transparent bg-primary-soft ring-1 ring-[var(--ring)]"
          : "border-line",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <IconSparkles size={18} className="text-accent-text" />
          <div>
            <h3 className="font-heading text-sm font-semibold">
              Letter forge
            </h3>
            <p className="text-xs text-fg-muted">
              Your letters, formed by the pattern itself
            </p>
          </div>
        </div>
        {/* toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={letters.enabled}
          aria-label="Enable letters in the QR pattern"
          onClick={() => patchStyle({ letters: { enabled: !letters.enabled } })}
          className={clsx(
            "relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200",
            letters.enabled ? "bg-primary" : "bg-line-strong",
          )}
        >
          <m.span
            layout
            transition={springs.snap}
            className={clsx(
              "absolute top-1 block size-5 rounded-full bg-white shadow-sm",
              letters.enabled ? "right-1" : "left-1",
            )}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {letters.enabled && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4 pt-1">
              <div>
                <label
                  htmlFor={inputId}
                  className="mb-1.5 block text-[13px] font-medium text-fg-muted"
                >
                  Letters (max 4 — A–Z, 0–9)
                </label>
                <input
                  id={inputId}
                  type="text"
                  value={letters.text}
                  maxLength={4}
                  onChange={(e) =>
                    patchStyle({ letters: { text: sanitizeLetters(e.target.value) } })
                  }
                  placeholder="HARV"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="font-heading h-13 w-full rounded-md border border-line bg-bg px-4 text-center text-2xl font-bold tracking-[0.35em] text-fg placeholder:text-fg-faint focus:border-line-strong focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative size-9 shrink-0 overflow-hidden rounded-md border border-line">
                  <input
                    id={accentId}
                    type="color"
                    value={letters.accent ?? "#16a34a"}
                    onChange={(e) => patchStyle({ letters: { accent: e.target.value } })}
                    aria-label="Letter accent color"
                    className="absolute -inset-2 size-[calc(100%+1rem)] cursor-pointer"
                  />
                </div>
                <label htmlFor={accentId} className="text-[13px] text-fg-muted">
                  Accent color for the letters
                </label>
                {letters.accent && (
                  <button
                    type="button"
                    onClick={() => patchStyle({ letters: { accent: null } })}
                    className="ml-auto cursor-pointer text-xs text-fg-faint underline underline-offset-2 hover:text-fg"
                  >
                    use code color
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Slider
                  label="Background dots"
                  min={0.55}
                  max={0.8}
                  step={0.01}
                  value={letters.dotScale}
                  onChange={(v) => patchStyle({ letters: { dotScale: v } })}
                  format={(v) => `${Math.round(v * 100)}%`}
                />
                <Slider
                  label="Letter glow on light areas"
                  min={0}
                  max={0.18}
                  step={0.01}
                  value={letters.tintAlpha}
                  onChange={(v) => patchStyle({ letters: { tintAlpha: v } })}
                  format={(v) => (v === 0 ? "off" : `${Math.round(v * 100)}%`)}
                />
              </div>

              <p className="text-xs leading-relaxed text-fg-faint">
                Letters never damage the code — they restyle it. Error
                correction is raised to maximum and every change is re-scanned
                live.
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
