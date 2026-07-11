"use client";

import { useEffect, useRef } from "react";
import { m, springs } from "@/components/motion/Motion";
import { ContentTabs } from "./ContentTabs";
import { DynamicForm } from "./DynamicForm";
import { StylePanel } from "./StylePanel";
import { LetterForgeControl } from "./LetterForgeControl";
import { PreviewPane } from "./PreviewPane";
import { ExportBar } from "./ExportBar";
import {
  buildLetterMap,
  buildPayload,
  ensureLetterFont,
  generateStyledQr,
  sanitizeLetters,
  verifyScannable,
  type QrType,
} from "@/lib/qr-engine";
import { selectFields, useGeneratorStore } from "@/store/generator-store";
import { fromParams } from "@/lib/url-state";

/**
 * The generator island. Client-only (dynamic import, ssr:false).
 * - hydrates once from ?query params (deep links from landing pages / share links)
 * - runs the engine debounced 120 ms after any content/style change
 */
export function GeneratorShell({
  presetType,
  presetLetters,
}: {
  presetType?: QrType;
  presetLetters?: string;
}) {
  const hydrated = useRef(false);

  // one-time hydration from URL + preset
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const s = useGeneratorStore.getState();
    if (presetType) s.setType(presetType);
    if (presetLetters) {
      s.patchStyle({
        letters: { enabled: true, text: sanitizeLetters(presetLetters) },
      });
    }
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
  }, [presetType, presetLetters]);

  // engine loop — debounced regeneration
  const type = useGeneratorStore((s) => s.type);
  const fields = useGeneratorStore(selectFields);
  const style = useGeneratorStore((s) => s.style);

  useEffect(() => {
    let stale = false;
    const timer = setTimeout(async () => {
      const { setResult } = useGeneratorStore.getState();
      const { payload, error } = buildPayload(type, fields);
      if (!payload) {
        if (!stale) setResult(null, error ?? null);
        return;
      }
      try {
        const lettersOn =
          style.letters.enabled && sanitizeLetters(style.letters.text).length > 0;
        if (lettersOn) await ensureLetterFont();
        if (stale) return;
        const result = generateStyledQr({
          payload,
          style,
          idSuffix: "live",
          buildLetterMap: lettersOn ? buildLetterMap : undefined,
        });
        if (!stale) setResult(result, error ?? null);
      } catch {
        if (!stale)
          setResult(null, "This content is too long for a QR code — shorten it.");
      }
    }, 120);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [type, fields, style]);

  // live scannability verification — a real decoder re-reads every design
  const resultSvg = useGeneratorStore((s) => s.result?.svg);
  useEffect(() => {
    const { setVerify } = useGeneratorStore.getState();
    if (!resultSvg) {
      setVerify("idle");
      return;
    }
    setVerify("testing");
    let stale = false;
    const timer = setTimeout(async () => {
      const s = useGeneratorStore.getState();
      const { payload } = buildPayload(s.type, s.fields[s.type] ?? {});
      if (!payload) return;
      const res = await verifyScannable(resultSvg, payload);
      if (!stale) setVerify(res.pass ? "pass" : "fail");
    }, 400);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [resultSvg]);

  return (
    <m.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.soft}
      className="card grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_minmax(20rem,26rem)] lg:gap-10">
      {/* left: content + style */}
      <div className="min-w-0">
        <ContentTabs />
        <div className="mt-5">
          <DynamicForm />
        </div>
        <hr className="my-6 border-line" />
        <LetterForgeControl />
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
    </m.div>
  );
}

export default GeneratorShell;
