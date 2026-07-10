import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "qrdock is a free, privacy-first QR code and barcode generator built by Nexorium Systems Private Limited — no watermarks, no expiring codes, everything generated in your browser.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
        about
      </p>
      <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Why qrdock exists
      </h1>

      <div className="prose-custom mt-8 space-y-5 leading-relaxed text-fg-muted">
        <p>
          Most “free” QR code generators aren&apos;t free. They watermark your
          downloads, silently create codes that expire after a trial, paywall
          vector exports, and upload everything you type — links, Wi-Fi
          passwords, payment IDs — to their servers.
        </p>
        <p>
          <span className="font-semibold text-fg">qrdock</span> was built to be
          the opposite. Every code is generated inside your browser, so your
          data never leaves your device. Static codes never expire because they
          can&apos;t — they don&apos;t depend on us. Downloads are free in every
          format we support, watermark-free, forever.
        </p>
        <p>
          And because a QR code is usually the most boring pixel on a poster,
          we gave qrdock something nobody else has: a{" "}
          <a href="/qr-code-with-letters" className="text-accent-text underline underline-offset-4">
            letter-forge engine
          </a>{" "}
          that weaves up to four letters into the module pattern itself — your
          initials, brand or campaign code, visible in the texture of a fully
          scannable QR.
        </p>
        <p>
          A real decoder re-reads every design as you edit, so the “will it
          scan?” anxiety is gone before you download. If you need editable
          destinations and scan analytics, a free account adds dynamic codes on
          top.
        </p>
        <p>
          qrdock is developed and operated by{" "}
          <span className="font-medium text-fg">{site.company}</span>, India.
          Questions, ideas or partnership requests are welcome at{" "}
          <a
            href={`mailto:${site.contactEmail}`}
            className="text-accent-text underline underline-offset-4"
          >
            {site.contactEmail}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
