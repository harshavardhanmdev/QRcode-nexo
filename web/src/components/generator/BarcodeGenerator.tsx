"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { m, springs } from "@/components/motion/Motion";
import { Button } from "@/components/ui/Button";
import { Label, TextInput, Checkbox } from "@/components/ui/fields";
import { ColorSwatchInput } from "./FillEditor";
import { centerInRow, scrollRowClass } from "./ContentTabs";
import {
  barcodeFormats,
  barcodeSpec,
  generateBarcodeSvg,
  type BarcodeFormat,
  type BarcodeResult,
} from "@/lib/qr-engine/barcode";
import { downloadBlob, svgToCanvasRect } from "@/lib/qr-engine/export";
import { IconAlert, IconBarcode, IconCheck, IconDownload } from "@/components/ui/icons";

function svgBlobOf(svg: string): Blob {
  return new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
}

export function BarcodeGenerator({
  presetFormat = "code128",
}: {
  presetFormat?: BarcodeFormat;
}) {
  const [format, setFormat] = useState<BarcodeFormat>(presetFormat);
  const [value, setValue] = useState("");
  const [lineColor, setLineColor] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [transparent, setTransparent] = useState(false);
  const [height, setHeight] = useState(90);
  const [showText, setShowText] = useState(true);
  const [result, setResult] = useState<BarcodeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(false);

  const spec = useMemo(() => barcodeSpec(format), [format]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!value.trim()) {
        setResult(null);
        return;
      }
      setResult(
        generateBarcodeSvg({
          format,
          value,
          lineColor,
          background: transparent ? "" : background,
          height,
          showText,
        }),
      );
    }, 120);
    return () => clearTimeout(t);
  }, [format, value, lineColor, background, transparent, height, showText]);

  async function onDownload(kind: "svg" | "png") {
    if (!result?.svg) return;
    setBusy(true);
    try {
      const base = `qrdock-barcode-${format}`;
      if (kind === "svg") {
        downloadBlob(svgBlobOf(result.svg), `${base}.svg`);
      } else {
        const scale = 2048 / result.width;
        const canvas = await svgToCanvasRect(
          result.svg,
          2048,
          Math.round(result.height * scale),
          !transparent,
        );
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, "image/png"),
        );
        if (blob) downloadBlob(blob, `${base}-2048px.png`);
      }
      setFlash(true);
      setTimeout(() => setFlash(false), 1500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_minmax(20rem,26rem)] lg:gap-10">
      <div className="min-w-0">
        {/* format tabs */}
        <div
          role="tablist"
          aria-label="Barcode format"
          className={scrollRowClass}
        >
          {barcodeFormats.map((f) => {
            const active = format === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={(e) => {
                  setFormat(f.id);
                  centerInRow(e.currentTarget.parentElement, e.currentTarget);
                }}
                className={clsx(
                  "relative flex h-10 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-medium transition-colors duration-200",
                  active
                    ? "border-transparent text-primary-fg"
                    : "border-line bg-bg text-fg-muted hover:border-line-strong hover:text-fg",
                )}
              >
                {active && (
                  <m.span
                    layoutId="barcode-tab-pill"
                    transition={springs.snap}
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-fg-muted">{spec.hint}</p>

        <div className="mt-4">
          <Label htmlFor="barcode-value" required>
            Content
          </Label>
          <TextInput
            id="barcode-value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={spec.placeholder}
            spellCheck={false}
            className="font-heading"
          />
          {result?.error && value.trim() && (
            <p
              role="status"
              className="mt-2 inline-flex items-center gap-2 rounded-md bg-warn-soft px-3 py-2 text-[13px] text-warn"
            >
              <IconAlert size={15} />
              {result.error}
            </p>
          )}
        </div>

        <hr className="my-6 border-line" />

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <ColorSwatchInput label="Bars" value={lineColor} onChange={setLineColor} />
          <ColorSwatchInput label="Background" value={background} onChange={setBackground} />
          <label className="flex cursor-pointer select-none items-center gap-2 text-[13px] text-fg-muted">
            <input
              type="checkbox"
              checked={transparent}
              onChange={(e) => setTransparent(e.target.checked)}
              className="size-4 cursor-pointer accent-[var(--primary)]"
            />
            Transparent
          </label>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-fg-muted">Bar height</span>
              <span className="font-heading text-xs text-fg-faint">{height}px</span>
            </div>
            <input
              type="range"
              min={40}
              max={160}
              step={5}
              value={height}
              aria-label="Bar height"
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-primary-soft accent-[var(--primary)]"
            />
          </div>
          <Checkbox
            id="barcode-text"
            label="Show value under bars"
            checked={showText}
            onChange={setShowText}
          />
        </div>
      </div>

      {/* preview + export */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div
          className="relative mx-auto flex min-h-[16rem] w-full max-w-[26rem] items-center justify-center overflow-hidden rounded-lg border border-line p-4"
          style={
            transparent
              ? {
                  backgroundImage:
                    "conic-gradient(var(--color-line) 0 25%, transparent 0 50%, var(--color-line) 0 75%, transparent 0)",
                  backgroundSize: "20px 20px",
                }
              : { background: background }
          }
        >
          {result?.svg ? (
            <m.div
              key={result.svg.length}
              initial={{ opacity: 0.4, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springs.ui}
              className="w-full [&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: result.svg }}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-fg-faint">
              <IconBarcode size={44} />
              <p className="max-w-[16rem] text-center text-sm">
                Enter the content and your barcode appears here.
              </p>
            </div>
          )}
        </div>

        <div className="mx-auto mt-5 flex w-full max-w-[26rem] gap-2">
          <Button
            onClick={() => onDownload("png")}
            disabled={!result?.svg || busy}
            size="lg"
            className="flex-1"
          >
            {flash ? <IconCheck size={18} /> : <IconDownload size={18} />}
            {busy ? "Preparing…" : "Download PNG"}
          </Button>
          <Button
            onClick={() => onDownload("svg")}
            disabled={!result?.svg || busy}
            variant="secondary"
            size="lg"
          >
            SVG
          </Button>
        </div>
        <p className="mx-auto mt-2 w-full max-w-[26rem] text-right text-[11px] text-fg-faint">
          PNG exports at 2048 px wide — print-ready.
        </p>
      </div>
    </div>
  );
}

export default BarcodeGenerator;
