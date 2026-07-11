"use client";

import { useRef, useState } from "react";
import { useGeneratorStore } from "@/store/generator-store";
import { Checkbox } from "@/components/ui/fields";
import { IconImage, IconX } from "@/components/ui/icons";

const MAX_FILE_BYTES = 3 * 1024 * 1024;
const TARGET_PX = 512;

/**
 * Reads the file locally, downscales to ≤512px on a canvas, and stores a
 * compact PNG data-URL in memory. Nothing is ever uploaded — that's the
 * product's core privacy promise.
 */
async function fileToDataUrl(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("unreadable image"));
      img.src = url;
    });
    const scale = Math.min(1, TARGET_PX / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function LogoUploader() {
  const logo = useGeneratorStore((s) => s.style.logo);
  const patchStyle = useGeneratorStore((s) => s.patchStyle);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("Keep the logo under 3 MB.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      patchStyle({ logo: { dataUrl } });
    } catch {
      setError("Couldn't read that image — try a PNG or JPG.");
    }
  }

  return (
    <div>
      <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-fg-faint">
        Center logo
      </h3>

      {!logo.dataUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 flex h-20 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-line-strong text-fg-muted transition-colors hover:border-[var(--primary)] hover:text-fg"
        >
          <IconImage size={20} />
          <span className="text-[13px]">
            Add a logo — stays on your device
          </span>
        </button>
      ) : (
        <div className="mt-3 space-y-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.dataUrl}
              alt="Your logo preview"
              className="size-14 rounded-md border border-line bg-white object-contain p-1"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-fg-muted">Size</span>
                <span className="font-heading text-xs text-fg-faint">
                  {Math.round(logo.sizePct * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.12}
                max={0.26}
                step={0.01}
                value={logo.sizePct}
                aria-label="Logo size"
                onChange={(e) =>
                  patchStyle({ logo: { sizePct: Number(e.target.value) } })
                }
                className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-primary-soft accent-[var(--primary)]"
              />
            </div>
            <button
              type="button"
              onClick={() => patchStyle({ logo: { dataUrl: null } })}
              aria-label="Remove logo"
              title="Remove logo"
              className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-danger-soft hover:text-danger"
            >
              <IconX size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Checkbox
              id="logo-knockout"
              label="Clear space behind"
              checked={logo.knockout}
              onChange={(v) => patchStyle({ logo: { knockout: v } })}
            />
            <Checkbox
              id="logo-rounded"
              label="Rounded corners"
              checked={logo.rounded}
              onChange={(v) => patchStyle({ logo: { rounded: v } })}
            />
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </div>
  );
}
