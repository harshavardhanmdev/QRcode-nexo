import type { Metadata } from "next";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { JsonLd, faqLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { faqs } from "@/lib/seo/faq";

export const metadata: Metadata = {
  title: "FAQ — QR codes, barcodes & how qrdock works",
  description:
    "Answers about qrdock: free downloads, QR codes that never expire, letters inside the pattern, dynamic QR analytics, UPI payment codes, supported barcode formats and more.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={faqLd(faqs)} />
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
        support
      </p>
      <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-3 text-fg-muted">
        Everything about how qrdock generates, verifies and exports your codes.
        Something missing?{" "}
        <a href="/contact" className="text-accent-text underline underline-offset-4">
          Ask us directly
        </a>
        .
      </p>
      <div className="mt-10">
        <FaqAccordion items={faqs} />
      </div>
      <AdSlot />
    </div>
  );
}
