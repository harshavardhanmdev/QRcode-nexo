"use client";

import dynamic from "next/dynamic";
import type { QrType } from "@/lib/qr-engine";

/**
 * Client island wrapper: the generator (engine + forms) loads as its own
 * chunk after the page paints. The skeleton mirrors the shell's dimensions
 * exactly so layout never shifts (CLS 0).
 */
const GeneratorShell = dynamic(() => import("./GeneratorShell"), {
  ssr: false,
  loading: () => (
    <div
      aria-busy="true"
      aria-label="Loading generator"
      className="card grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_minmax(20rem,26rem)] lg:gap-10"
    >
      <div className="min-w-0">
        <div className="skeleton h-10 w-full rounded-full" />
        <div className="mt-5 space-y-3">
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="skeleton h-11 w-full rounded-md" />
          <div className="skeleton h-11 w-full rounded-md" />
        </div>
        <div className="mt-8 space-y-3">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-11 w-full rounded-md" />
          <div className="skeleton h-11 w-3/4 rounded-md" />
        </div>
      </div>
      <div>
        <div className="skeleton mx-auto aspect-square w-full max-w-[26rem] rounded-lg" />
        <div className="skeleton mx-auto mt-5 h-12 w-full max-w-[26rem] rounded-md" />
      </div>
    </div>
  ),
});

export function GeneratorIsland({ presetType }: { presetType?: QrType }) {
  return <GeneratorShell presetType={presetType} />;
}
