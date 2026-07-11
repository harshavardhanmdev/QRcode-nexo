"use client";

import dynamic from "next/dynamic";
import type { BarcodeFormat } from "@/lib/qr-engine/barcode";

const BarcodeGenerator = dynamic(() => import("./BarcodeGenerator"), {
  ssr: false,
  loading: () => (
    <div
      aria-busy="true"
      aria-label="Loading barcode generator"
      className="card grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_minmax(20rem,26rem)] lg:gap-10"
    >
      <div className="min-w-0">
        <div className="skeleton h-10 w-full rounded-full" />
        <div className="mt-5 space-y-3">
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="skeleton h-11 w-full rounded-md" />
        </div>
        <div className="mt-8 space-y-3">
          <div className="skeleton h-11 w-full rounded-md" />
          <div className="skeleton h-11 w-3/4 rounded-md" />
        </div>
      </div>
      <div>
        <div className="skeleton mx-auto min-h-[16rem] w-full max-w-[26rem] rounded-lg" />
        <div className="skeleton mx-auto mt-5 h-12 w-full max-w-[26rem] rounded-md" />
      </div>
    </div>
  ),
});

export function BarcodeIsland({ presetFormat }: { presetFormat?: BarcodeFormat }) {
  return <BarcodeGenerator presetFormat={presetFormat} />;
}
