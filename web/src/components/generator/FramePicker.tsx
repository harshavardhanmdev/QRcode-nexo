"use client";

import clsx from "clsx";
import { useGeneratorStore } from "@/store/generator-store";
import { ColorSwatchInput } from "./FillEditor";
import { TextInput } from "@/components/ui/fields";
import type { FrameOptions } from "@/lib/qr-engine";

const FRAMES: { id: FrameOptions["id"]; label: string }[] = [
  { id: "none", label: "None" },
  { id: "label-bottom", label: "Label below" },
  { id: "label-top", label: "Label above" },
  { id: "badge", label: "Badge" },
  { id: "ticket", label: "Ticket" },
];

function FramePreview({ id }: { id: FrameOptions["id"] }) {
  const stroke = "currentColor";
  switch (id) {
    case "none":
      return (
        <svg width="26" height="30" viewBox="0 0 26 30">
          <rect x="4" y="6" width="18" height="18" rx="2" fill="none" stroke={stroke} strokeWidth="1.6" strokeDasharray="2.5 2" />
        </svg>
      );
    case "label-bottom":
      return (
        <svg width="26" height="30" viewBox="0 0 26 30">
          <rect x="3" y="2" width="20" height="26" rx="2.5" fill="none" stroke={stroke} strokeWidth="1.6" />
          <rect x="3" y="21" width="20" height="7" rx="2" fill={stroke} />
        </svg>
      );
    case "label-top":
      return (
        <svg width="26" height="30" viewBox="0 0 26 30">
          <rect x="3" y="2" width="20" height="26" rx="2.5" fill="none" stroke={stroke} strokeWidth="1.6" />
          <rect x="3" y="2" width="20" height="7" rx="2" fill={stroke} />
        </svg>
      );
    case "badge":
      return (
        <svg width="26" height="30" viewBox="0 0 26 30">
          <rect x="3" y="3" width="20" height="20" rx="3" fill="none" stroke={stroke} strokeWidth="1.6" />
          <rect x="6" y="20" width="14" height="6.5" rx="3.25" fill={stroke} />
        </svg>
      );
    case "ticket":
      return (
        <svg width="26" height="30" viewBox="0 0 26 30">
          <rect x="3" y="2" width="20" height="26" rx="2" fill="none" stroke={stroke} strokeWidth="1.6" />
          <line x1="5" y1="21" x2="21" y2="21" stroke={stroke} strokeWidth="1.4" strokeDasharray="2.5 2" />
        </svg>
      );
  }
}

export function FramePicker() {
  const frame = useGeneratorStore((s) => s.style.frame);
  const patchStyle = useGeneratorStore((s) => s.patchStyle);

  return (
    <div>
      <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-fg-faint">
        Frame
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {FRAMES.map((f) => (
          <button
            key={f.id}
            type="button"
            title={f.label}
            aria-label={f.label}
            aria-pressed={frame.id === f.id}
            onClick={() => patchStyle({ frame: { id: f.id } })}
            className={clsx(
              "inline-flex h-12 w-11 cursor-pointer items-center justify-center rounded-md border transition-all duration-200",
              frame.id === f.id
                ? "border-transparent bg-primary-soft text-accent-text ring-2 ring-[var(--ring)]"
                : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
            )}
          >
            <FramePreview id={f.id} />
          </button>
        ))}
      </div>

      {frame.id !== "none" && (
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="frame-text"
              className="mb-1.5 block text-[13px] font-medium text-fg-muted"
            >
              Frame text
            </label>
            <TextInput
              id="frame-text"
              value={frame.text}
              maxLength={24}
              onChange={(e) => patchStyle({ frame: { text: e.target.value } })}
              placeholder="SCAN ME"
            />
          </div>
          <div className="flex flex-wrap gap-5">
            <ColorSwatchInput
              label="Frame"
              compact
              value={frame.color}
              onChange={(c) => patchStyle({ frame: { color: c } })}
            />
            <ColorSwatchInput
              label="Text"
              compact
              value={frame.textColor}
              onChange={(c) => patchStyle({ frame: { textColor: c } })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
