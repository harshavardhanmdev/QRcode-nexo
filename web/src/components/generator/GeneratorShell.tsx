"use client";

import { useEffect, useRef } from "react";
import { ContentTabs } from "./ContentTabs";
import { DynamicForm } from "./DynamicForm";
import { StylePanel } from "./StylePanel";
import { PreviewPane } from "./PreviewPane";
import { ExportBar } from "./ExportBar";
import { buildPayload, generateStyledQr, type QrType } from "@/lib/qr-engine";
import { selectFields, useGeneratorStore } from "@/store/generator-store";
import { fromParams } from "@/lib/url-state";

/**
 * The generator island. Client-only (dynamic import, ssr:false).
 * - hydrates once from ?query params (deep links from landing pages / share links)
 * - runs the engine debounced 120 ms after any content/style change
 */
export function GeneratorShell({ presetType }: { presetType?: QrType }) {
  const hydrated = useRef(false);

  // one-time hydration from URL + preset
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const s = useGeneratorStore.getState();
    if (presetType) s.setType(presetType);
    if (location.search.length > 1) {
      const parsed = fromParams(
        Object.fromEntries(new URLSearchParams(location.search)),
      );
      if (parsed.type) s.setType(parsed.type);
      if (Object.keys(parsed.style).length) s.patchStyle(parsed.style);
      const t = parsed.type ?? presetType ?? s.type;
      for (const [k, v] of Object.entries(parsed.fields)) {
        useGeneratorStore.setState((prev) => ({
          fields: { ...prev.fields, [t]: { ...(prev.fields[t] ?? {}), [k]: v } },
        }));
      }
    }
  }, [presetType]);

  // engine loop — debounced regeneration
  const type = useGeneratorStore((s) => s.type);
  const fields = useGeneratorStore(selectFields);
  const style = useGeneratorStore((s) => s.style);

  useEffect(() => {
    const timer = setTimeout(() => {
      const { setResult } = useGeneratorStore.getState();
      const { payload, error } = buildPayload(type, fields);
      if (!payload) {
        setResult(null, error ?? null);
        return;
      }
      try {
        const result = generateStyledQr({ payload, style, idSuffix: "live" });
        setResult(result, error ?? null);
      } catch {
        setResult(null, "This content is too long for a QR code — shorten it.");
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [type, fields, style]);

  return (
    <div className="card grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_minmax(20rem,26rem)] lg:gap-10">
      {/* left: content + style */}
      <div className="min-w-0">
        <ContentTabs />
        <div className="mt-5">
          <DynamicForm />
        </div>
        <hr className="my-6 border-line" />
        <StylePanel />
      </div>

      {/* right: preview + export */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <PreviewPane />
        <div className="mt-5">
          <ExportBar />
        </div>
      </div>
    </div>
  );
}

export default GeneratorShell;
