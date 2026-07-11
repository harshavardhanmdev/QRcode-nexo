import type { Metadata } from "next";
import Link from "next/link";
import { BarcodeIsland } from "@/components/generator/BarcodeIsland";
import { Reveal } from "@/components/motion/Reveal";
import { barcodeFormats } from "@/lib/qr-engine/barcode";

export const metadata: Metadata = {
  title: "Free Barcode Generator — Code 128, EAN-13, UPC & more",
  description:
    "Generate print-ready barcodes free: Code 128, EAN-13, EAN-8, UPC-A, Code 39 and ITF-14 with automatic checksums, custom colors and SVG/PNG export. No watermarks, generated in your browser.",
  alternates: { canonical: "/barcode-generator" },
  keywords: [
    "barcode generator",
    "free barcode generator",
    "code 128 generator",
    "ean-13 barcode",
    "upc barcode generator",
  ],
};

export default function BarcodeGeneratorPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 text-center sm:px-6">
          <h1 className="font-heading mx-auto max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            Barcode generator that&apos;s{" "}
            <span className="text-accent-text">actually free</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
            Six retail and logistics formats with automatic checksum
            validation, custom colors, and crisp SVG or 2048&nbsp;px PNG
            downloads. Generated in your browser — your product data never
            leaves your device.
          </p>
        </div>
      </section>

      <section
        id="generator"
        aria-label="Barcode generator"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6"
      >
        <BarcodeIsland />
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="card p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold">
              Which barcode format do I need?
            </h2>
            <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {barcodeFormats.map((f) => (
                <div key={f.id}>
                  <dt>
                    <Link
                      href={`/barcode-generator/${f.id}`}
                      className="font-heading text-sm font-semibold text-accent-text underline-offset-4 hover:underline"
                    >
                      {f.label}
                    </Link>
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-fg-muted">
                    {f.hint}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-fg-muted">
              Need a QR code instead?{" "}
              <Link href="/" className="text-accent-text underline underline-offset-4">
                The QR generator
              </Link>{" "}
              handles links, Wi-Fi, UPI payments, contacts and more — including{" "}
              <Link
                href="/qr-code-with-letters"
                className="text-accent-text underline underline-offset-4"
              >
                letters woven into the pattern
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
