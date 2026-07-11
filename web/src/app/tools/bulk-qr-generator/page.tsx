import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import { JsonLd, breadcrumbLd, howToLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Bulk QR Code Generator — CSV to ZIP, free",
  description:
    "Generate hundreds of QR codes at once from a CSV: one row per code, custom colors, PNG or SVG in a single ZIP. Free and processed entirely in your browser.",
  alternates: { canonical: "/tools/bulk-qr-generator" },
  keywords: ["bulk qr code generator", "csv to qr codes", "batch qr code generator free"],
};

const steps = [
  "Paste CSV rows (or upload a .csv): first column is the QR content, optional second column names the file.",
  "Pick colors and PNG or SVG output.",
  "Generate — every code is built in your browser and packed into one ZIP.",
];

export default function BulkPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "qrdock", path: "/" },
            { name: "Bulk QR generator", path: "/tools/bulk-qr-generator" },
          ]),
          howToLd("Generate QR codes in bulk from CSV", steps),
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
            power tool
          </p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Bulk QR codes <span className="text-gradient">from a CSV</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-fg-muted">
            Table numbers, asset tags, event tickets, per-store links — one row
            per code, one ZIP out. Up to 500 codes per batch, free.
          </p>
        </div>

        <div className="mt-10">
          <BulkIsland />
        </div>
      </div>
    </>
  );
}

const BulkIsland = dynamicImport(
  () => import("@/components/generator/BulkGenerator"),
  {
    loading: () => (
      <div className="card mx-auto max-w-3xl p-6 sm:p-8" aria-busy="true">
        <div className="skeleton h-40 w-full rounded-md" />
        <div className="skeleton mt-6 h-12 w-48 rounded-md" />
      </div>
    ),
  },
);
