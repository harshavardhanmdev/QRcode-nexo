"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import JSZip from "jszip";
import { Button } from "@/components/ui/Button";
import { ColorSwatchInput } from "./FillEditor";
import {
  defaultStyle,
  generateStyledQr,
  rasterize,
  type Fill,
} from "@/lib/qr-engine";
import { downloadBlob } from "@/lib/qr-engine/export";
import { IconCheck, IconDownload, IconLayers, IconX } from "@/components/ui/icons";

const MAX_ROWS = 500;

interface Row {
  content: string;
  filename: string;
}

function parseCsv(text: string): { rows: Row[]; error: string | null } {
  const parsed = Papa.parse<string[]>(text.trim(), { skipEmptyLines: true });
  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    return { rows: [], error: "Couldn't parse that CSV." };
  }
  let data = parsed.data;
  // optional header row: "content,filename" (case-insensitive)
  if (
    data[0] &&
    data[0][0]?.trim().toLowerCase() === "content"
  ) {
    data = data.slice(1);
  }
  const rows: Row[] = data
    .filter((r) => r[0] && r[0].trim())
    .map((r, i) => ({
      content: r[0].trim(),
      filename:
        (r[1]?.trim() || `qr-${String(i + 1).padStart(3, "0")}`)
          .replace(/[^a-z0-9-_]+/gi, "-")
          .toLowerCase(),
    }));
  if (rows.length === 0) return { rows: [], error: "No rows found — one QR content per line." };
  if (rows.length > MAX_ROWS) {
    return { rows: [], error: `Keep it under ${MAX_ROWS} rows per batch.` };
  }
  return { rows, error: null };
}

export function BulkGenerator() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState("");
  const [fg, setFg] = useState("#111827");
  const [bg, setBg] = useState("#ffffff");
  const [format, setFormat] = useState<"png" | "svg">("png");
  const [progress, setProgress] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { rows, error: parseError } = csvText.trim()
    ? parseCsv(csvText)
    : { rows: [] as Row[], error: null };

  async function generate() {
    if (rows.length === 0) return;
    setError(null);
    setDone(false);
    setProgress(0);
    try {
      const style = {
        ...defaultStyle(),
        fg: { kind: "solid", color: fg } as Fill,
        bg: { kind: "solid", color: bg } as Fill,
      };
      const zip = new JSZip();
      const seen = new Set<string>();
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let name = row.filename;
        for (let n = 2; seen.has(name); n++) name = `${row.filename}-${n}`;
        seen.add(name);

        const result = generateStyledQr({
          payload: row.content,
          style,
          idSuffix: `bulk${i}`,
        });
        if (format === "svg") {
          zip.file(`${name}.svg`, result.svg);
        } else {
          const blob = await rasterize(result.svg, 1024, "png");
          zip.file(`${name}.png`, blob);
        }
        setProgress(Math.round(((i + 1) / rows.length) * 100));
        // yield to the main thread so the page stays responsive
        if (i % 5 === 4) await new Promise((r) => setTimeout(r, 0));
      }
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `qrdock-bulk-${rows.length}.zip`);
      setDone(true);
    } catch {
      setError("Generation failed part-way — check the rows for content that's too long.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="card mx-auto max-w-3xl p-6 sm:p-8">
      <label htmlFor="bulk-csv" className="mb-1.5 block text-[13px] font-medium text-fg-muted">
        CSV rows — <span className="font-heading">content,filename</span> (filename optional)
      </label>
      <textarea
        id="bulk-csv"
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        rows={8}
        placeholder={`https://example.com/table-1,table-1\nhttps://example.com/table-2,table-2\nWIFI:T:WPA;S:CafeGuest;P:secret;;,cafe-wifi`}
        spellCheck={false}
        className="font-heading w-full rounded-md border border-line bg-bg px-3.5 py-2.5 text-[13px] leading-relaxed text-fg placeholder:text-fg-faint focus:border-line-strong focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      />
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer text-[13px] text-accent-text underline underline-offset-4 hover:opacity-80"
        >
          …or upload a .csv file
        </button>
        <span className="font-heading text-xs text-fg-faint">
          {rows.length > 0 && `${rows.length} codes ready`}
        </span>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) setCsvText(await f.text());
        }}
      />

      {(parseError || error) && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-warn-soft px-3 py-2 text-[13px] text-warn">
          <IconX size={15} />
          {parseError ?? error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
        <ColorSwatchInput label="Code" value={fg} onChange={setFg} compact />
        <ColorSwatchInput label="Background" value={bg} onChange={setBg} compact />
        <div role="radiogroup" aria-label="File format" className="flex rounded-md border border-line p-0.5">
          {(["png", "svg"] as const).map((f) => (
            <button
              key={f}
              role="radio"
              aria-checked={format === f}
              onClick={() => setFormat(f)}
              className={`h-8 cursor-pointer rounded-[0.3rem] px-3 font-heading text-[11px] font-semibold uppercase transition-colors ${
                format === f ? "bg-primary text-primary-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Button
          onClick={generate}
          disabled={rows.length === 0 || progress !== null}
          size="lg"
          className="w-full sm:w-auto"
        >
          {done ? <IconCheck size={18} /> : <IconLayers size={18} />}
          {progress !== null
            ? `Generating… ${progress}%`
            : done
              ? "Downloaded — generate again"
              : `Generate ${rows.length || ""} codes as ZIP`}
        </Button>
        {progress !== null && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary-soft">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-fg-faint">
          <IconDownload size={13} />
          Everything is generated in your browser — your CSV never leaves this page.
        </p>
      </div>
    </div>
  );
}

export default BulkGenerator;
