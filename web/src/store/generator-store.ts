"use client";

import { create } from "zustand";
import {
  defaultStyle,
  type ExportFormat,
  type ExportSize,
  type QrStyle,
  type QrType,
  type RenderResult,
} from "@/lib/qr-engine";

type FieldsByType = Partial<Record<QrType, Record<string, string>>>;

export interface GeneratorState {
  type: QrType;
  /** fields are kept per type so switching tabs never loses input */
  fields: FieldsByType;
  style: QrStyle;
  output: { format: ExportFormat; px: ExportSize };
  /** engine output — written by the debounced effect in GeneratorShell */
  result: RenderResult | null;
  payloadError: string | null;
  /** live decode status (Milestone C wires the real verifier) */
  verify: "idle" | "testing" | "pass" | "fail";

  setType(t: QrType): void;
  setField(key: string, value: string): void;
  patchStyle(patch: DeepPartial<QrStyle>): void;
  setOutput(patch: Partial<GeneratorState["output"]>): void;
  setResult(result: RenderResult | null, payloadError: string | null): void;
  setVerify(v: GeneratorState["verify"]): void;
  reset(): void;
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function mergeStyle(base: QrStyle, patch: DeepPartial<QrStyle>): QrStyle {
  const next = { ...base } as unknown as Record<string, unknown>;
  for (const k of Object.keys(patch) as (keyof QrStyle)[]) {
    const v = patch[k];
    if (v === undefined) continue;
    const cur = base[k];
    if (
      v !== null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      cur !== null &&
      typeof cur === "object" &&
      !("kind" in (v as object)) // fills are replaced wholesale
    ) {
      next[k] = { ...cur, ...v };
    } else {
      next[k] = v;
    }
  }
  return next as unknown as QrStyle;
}

export const useGeneratorStore = create<GeneratorState>((set) => ({
  type: "url",
  fields: {},
  style: defaultStyle(),
  output: { format: "png", px: 1024 },
  result: null,
  payloadError: null,
  verify: "idle",

  setType: (type) => set({ type }),
  setField: (key, value) =>
    set((s) => ({
      fields: {
        ...s.fields,
        [s.type]: { ...(s.fields[s.type] ?? {}), [key]: value },
      },
    })),
  patchStyle: (patch) => set((s) => ({ style: mergeStyle(s.style, patch) })),
  setOutput: (patch) => set((s) => ({ output: { ...s.output, ...patch } })),
  setResult: (result, payloadError) => set({ result, payloadError }),
  setVerify: (verify) => set({ verify }),
  reset: () =>
    set({ fields: {}, style: defaultStyle(), payloadError: null, verify: "idle" }),
}));

const EMPTY_FIELDS: Record<string, string> = {};

/** Current type's fields — stable reference when empty (zustand v5 snapshot rule). */
export function selectFields(s: GeneratorState): Record<string, string> {
  return s.fields[s.type] ?? EMPTY_FIELDS;
}
