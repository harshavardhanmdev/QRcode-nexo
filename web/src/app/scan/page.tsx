import type { Metadata } from "next";
import Link from "next/link";
import { ScanDecoder } from "@/components/generator/ScanDecoder";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Scan a QR Code Online — free image decoder",
  description:
    "Decode any QR code from an image, free and private: drop a screenshot or photo and read the link, Wi-Fi credentials, UPI ID or text inside. Nothing is uploaded — decoding happens in your browser.",
  alternates: { canonical: "/scan" },
  keywords: ["scan qr code online", "qr code reader online", "decode qr code from image"],
};

export default function ScanPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "qrdock", path: "/" },
          { name: "Scan a QR code", path: "/scan" },
        ])}
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
            decoder
          </p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Scan a QR code <span className="text-gradient">from an image</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-fg-muted">
            Got a screenshot or photo of a QR code? Drop it below and see
            exactly what's inside before you open it — links, Wi-Fi
            credentials, payment details, anything.
          </p>
        </div>

        <div className="mt-10">
          <ScanDecoder />
        </div>

        <p className="mt-8 text-center text-sm text-fg-muted">
          Made something worth scanning?{" "}
          <Link href="/" className="text-accent-text underline underline-offset-4">
            Generate your own QR code
          </Link>{" "}
          — free, no watermark.
        </p>
      </div>
    </>
  );
}
