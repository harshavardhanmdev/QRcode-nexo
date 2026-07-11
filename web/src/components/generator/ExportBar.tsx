"use client";

import { useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/fields";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconLink,
  IconLayers,
} from "@/components/ui/icons";
import {
  copyPngToClipboard,
  downloadCode,
  type ExportFormat,
  type ExportSize,
} from "@/lib/qr-engine";
import { useGeneratorStore } from "@/store/generator-store";
import { toShareParams } from "@/lib/url-state";
import { useDownloadGate } from "@/components/auth/useDownloadGate";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api-client";

const FORMATS: ExportFormat[] = ["png", "svg", "jpeg", "webp"];
const SIZES: ExportSize[] = [512, 1024, 2048, 4096];

/** cm at 300 DPI for a given px size — the print-size helper. */
function printCm(px: number): string {
  return ((px / 300) * 2.54).toFixed(1);
}

export function ExportBar() {
  const result = useGeneratorStore((s) => s.result);
  const output = useGeneratorStore((s) => s.output);
  const setOutput = useGeneratorStore((s) => s.setOutput);
  const type = useGeneratorStore((s) => s.type);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<"copied" | "shared" | "saved" | null>(null);
  const { guard, gateModal } = useDownloadGate();
  const user = useAuthStore((s) => s.user);

  const disabled = !result;

  async function onDownload() {
    if (!result) return;
    await guard(async () => {
      setBusy(true);
      try {
        await downloadCode({
          svg: result.svg,
          format: output.format,
          px: output.px,
          baseName: `qrdock-${type}`,
        });
      } finally {
        setBusy(false);
      }
    });
  }

  async function onSave() {
    const s = useGeneratorStore.getState();
    const params = toShareParams(s.type, s.fields[s.type] ?? {}, s.style);
    try {
      await api.post("/api/designs", {
        name: `${s.type} · ${new Date().toLocaleDateString()}`,
        kind: "qr",
        config: Object.fromEntries(params),
      });
      setFlash("saved");
      setTimeout(() => setFlash(null), 1600);
    } catch {
      /* surfaced on the account page; keep the bar quiet */
    }
  }

  async function onCopy() {
    if (!result) return;
    await copyPngToClipboard(result.svg);
    setFlash("copied");
    setTimeout(() => setFlash(null), 1600);
  }

  async function onShare() {
    const s = useGeneratorStore.getState();
    const params = toShareParams(s.type, s.fields[s.type] ?? {}, s.style);
    const url = `${location.origin}/?${params.toString()}#generator`;
    await navigator.clipboard.writeText(url);
    setFlash("shared");
    setTimeout(() => setFlash(null), 1600);
  }

  return (
    <div className="mx-auto w-full max-w-[26rem]">
      <div className="flex gap-2">
        {/* format pills */}
        <div
          role="radiogroup"
          aria-label="Download format"
          className="flex min-w-0 flex-1 rounded-md border border-line p-1"
        >
          {FORMATS.map((f) => (
            <button
              key={f}
              role="radio"
              aria-checked={output.format === f}
              onClick={() => setOutput({ format: f })}
              className={clsx(
                "font-heading h-9 min-w-0 flex-1 cursor-pointer rounded-[0.4rem] text-[11px] font-semibold uppercase tracking-wide transition-colors duration-150",
                output.format === f
                  ? "bg-primary text-primary-fg"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* raster size (Select is w-full inside a fixed-width wrapper) */}
        <div className="w-28 shrink-0">
          <Select
            aria-label="Image size"
            value={String(output.px)}
            disabled={output.format === "svg"}
            onChange={(e) => setOutput({ px: Number(e.target.value) as ExportSize })}
            className="h-11 disabled:opacity-40"
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s} px
              </option>
            ))}
          </Select>
        </div>
      </div>

      <p className="mt-1.5 text-right text-[11px] text-fg-faint">
        {output.format === "svg"
          ? "Vector — infinitely sharp at any print size"
          : `≈ ${printCm(output.px)} cm wide at 300 DPI print`}
      </p>

      <div className="mt-3 flex gap-2">
        <Button
          onClick={onDownload}
          disabled={disabled || busy}
          size="lg"
          className="flex-1"
        >
          <IconDownload size={18} />
          {busy ? "Preparing…" : "Download"}
        </Button>
        <Button
          onClick={onCopy}
          disabled={disabled}
          variant="secondary"
          size="lg"
          aria-label="Copy PNG to clipboard"
          title="Copy PNG to clipboard"
          className="w-12 shrink-0 px-0"
        >
          {flash === "copied" ? <IconCheck size={18} /> : <IconCopy size={18} />}
        </Button>
        <Button
          onClick={onShare}
          disabled={disabled}
          variant="secondary"
          size="lg"
          aria-label="Copy share link"
          title="Copy a link to this design"
          className="w-12 shrink-0 px-0"
        >
          {flash === "shared" ? <IconCheck size={18} /> : <IconLink size={18} />}
        </Button>
        {user && (
          <Button
            onClick={onSave}
            disabled={disabled}
            variant="secondary"
            size="lg"
            aria-label="Save design to your account"
            title="Save design to your account"
            className="w-12 shrink-0 px-0"
          >
            {flash === "saved" ? <IconCheck size={18} /> : <IconLayers size={18} />}
          </Button>
        )}
      </div>
      {gateModal}
    </div>
  );
}
