import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarcodeIsland } from "@/components/generator/BarcodeIsland";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/seo/JsonLd";
import { barcodeLanding, barcodeLandings } from "@/lib/seo/landing-content";
import { barcodeFormats, barcodeSpec } from "@/lib/qr-engine/barcode";

export function generateStaticParams() {
  return barcodeLandings.map((l) => ({ format: l.format }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ format: string }>;
}): Promise<Metadata> {
  const { format } = await params;
  const content = barcodeLanding(format);
  if (!content) return {};
  return {
    title: content.title,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: `/barcode-generator/${content.format}` },
  };
}

function Highlighted({ text, highlight }: { text: string; highlight: string }) {
  const i = text.indexOf(highlight);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-gradient">{highlight}</span>
      {text.slice(i + highlight.length)}
    </>
  );
}

export default async function BarcodeFormatPage({
  params,
}: {
  params: Promise<{ format: string }>;
}) {
  const { format } = await params;
  const content = barcodeLanding(format);
  if (!content) notFound();
  const spec = barcodeSpec(content.format);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "qrdock", path: "/" },
            { name: "Barcode Generator", path: "/barcode-generator" },
            { name: spec.label, path: `/barcode-generator/${content.format}` },
          ]),
          faqLd(content.faqs),
        ]}
      />

      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:px-6">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
            free · automatic checksum · no watermark
          </p>
          <h1 className="font-heading mx-auto mt-3 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            <Highlighted text={content.h1} highlight={content.h1Highlight} />
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
            {content.intro}
          </p>
        </div>
      </section>

      <section
        id="generator"
        aria-label={`${spec.label} barcode generator`}
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6"
      >
        <BarcodeIsland presetFormat={content.format} />
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <FaqAccordion items={content.faqs} />
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <nav aria-label="Other barcode formats" className="card p-6 sm:p-8">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-fg-faint">
              Other barcode formats
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {barcodeFormats
                .filter((f) => f.id !== content.format)
                .map((f) => (
                  <li key={f.id}>
                    <Link
                      href={`/barcode-generator/${f.id}`}
                      className="inline-flex min-h-9 items-center rounded-full border border-line bg-bg px-3.5 py-1.5 text-sm text-fg-muted transition-colors duration-200 hover:border-line-strong hover:text-accent-text"
                    >
                      {f.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-9 items-center rounded-full border border-line bg-bg px-3.5 py-1.5 text-sm text-accent-text transition-colors duration-200 hover:border-line-strong"
                >
                  Need a QR code instead? →
                </Link>
              </li>
            </ul>
          </nav>
        </Reveal>
      </section>
    </>
  );
}
