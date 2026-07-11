"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconCheck, IconCopy, IconScan, IconX } from "@/components/ui/icons";

type JsQrFn = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
) => { data: string } | null;

let jsqrPromise: Promise<JsQrFn> | null = null;
function loadJsQr(): Promise<JsQrFn> {
  if (!jsqrPromise) {
    jsqrPromise = import("jsqr").then((m) => (m.default ?? m) as unknown as JsQrFn);
  }
  return jsqrPromise;
}

async function decodeFile(file: File): Promise<string | null> {
  const jsQR = await loadJsQr();
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("unreadable"));
      img.src = url;
    });
    // try a couple of scales — tiny screenshots and huge photos both happen
    for (const target of [800, 1400, 400]) {
      const scale = Math.min(1, target / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);
      const hit = jsQR(data, w, h);
      if (hit?.data) return hit.data;
    }
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function classify(text: string): { kind: string; href: string | null } {
  if (/^https?:\/\//i.test(text)) return { kind: "Link", href: text };
  if (/^upi:\/\//i.test(text)) return { kind: "UPI payment", href: null };
  if (/^WIFI:/i.test(text)) return { kind: "Wi-Fi credentials", href: null };
  if (/^BEGIN:VCARD/i.test(text)) return { kind: "Contact card (vCard)", href: null };
  if (/^BEGIN:VEVENT/i.test(text)) return { kind: "Calendar event", href: null };
  if (/^mailto:/i.test(text)) return { kind: "Email", href: text };
  if (/^(SMSTO|sms):/i.test(text)) return { kind: "SMS", href: null };
  if (/^geo:/i.test(text)) return { kind: "Location", href: null };
  if (/^tel:/i.test(text)) return { kind: "Phone number", href: text };
  return { kind: "Text", href: null };
}

export function ScanDecoder() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handle = useCallback(async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    setFailed(false);
    setResult(null);
    try {
      const text = await decodeFile(file);
      if (text) setResult(text);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }, []);

  const meta = result ? classify(result) : null;

  return (
    <div className="card mx-auto max-w-2xl p-6 sm:p-8">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a QR code image to decode"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handle(e.dataTransfer.files?.[0]);
        }}
        className={`flex min-h-[11rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 text-center transition-colors duration-200 ${
          dragOver
            ? "border-[var(--primary)] bg-primary-soft"
            : "border-line-strong hover:border-[var(--primary)]"
        }`}
      >
        <IconScan size={32} className="text-accent-text" />
        <p className="text-sm text-fg-muted">
          {busy
            ? "Decoding…"
            : "Drop a QR code image here, or click to choose a file"}
        </p>
        <p className="text-xs text-fg-faint">
          Decoded on your device — the image is never uploaded.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />

      {failed && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
          <IconX size={16} />
          No QR code found — try a sharper, closer image with the full code visible.
        </p>
      )}

      {result && meta && (
        <div className="mt-5 rounded-lg border border-line bg-bg p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="font-heading rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-accent-text">
              {meta.kind}
            </span>
            <div className="flex gap-2">
              {meta.href && (
                <Button href={meta.href} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm">
                  Open
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(result);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
                Copy
              </Button>
            </div>
          </div>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-surface p-3 font-heading text-[13px] leading-relaxed text-fg">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
