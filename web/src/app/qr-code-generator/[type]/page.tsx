import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GeneratorIsland } from "@/components/generator/GeneratorIsland";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { Reveal } from "@/components/motion/Reveal";
import {
  JsonLd,
  breadcrumbLd,
  faqLd,
  howToLd,
} from "@/components/seo/JsonLd";
import { qrLanding, qrLandings } from "@/lib/seo/landing-content";
import { specFor } from "@/lib/form-specs";
import type { QrType } from "@/lib/qr-engine";

export function generateStaticParams() {
  return qrLandings.map((l) => ({ type: l.type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const content = qrLanding(type);
  if (!content) return {};
  return {
    title: content.title,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: `/qr-code-generator/${content.type}` },
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

export default async function QrTypeLandingPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const content = qrLanding(type);
  if (!content) notFound();

  const others = qrLandings.filter((l) => l.type !== content.type);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "qrdock", path: "/" },
            { name: "QR Code Generator", path: "/qr-code-generator/url" },
            { name: specFor(content.type).label, path: `/qr-code-generator/${content.type}` },
          ]),
          howToLd(content.title, content.steps),
          faqLd(content.faqs),
        ]}
      />

      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:px-6">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
            free · private · no watermark
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
        aria-label={`${specFor(content.type).label} QR code generator`}
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6"
      >
        <GeneratorIsland presetType={content.type as QrType} />
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="card h-full p-6 sm:p-8">
              <h2 className="font-heading text-lg font-semibold">How it works</h2>
              <ol className="mt-4 space-y-3">
                {content.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-fg-muted">
                    <span className="font-heading inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-accent-text">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="h-full">
              <FaqAccordion items={content.faqs} />
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <nav aria-label="Other QR code types" className="card p-6 sm:p-8">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-fg-faint">
              More QR code generators
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((l) => (
                <li key={l.type}>
                  <Link
                    href={`/qr-code-generator/${l.type}`}
                    className="inline-flex min-h-9 items-center rounded-full border border-line bg-bg px-3.5 py-1.5 text-sm text-fg-muted transition-colors duration-200 hover:border-line-strong hover:text-accent-text"
                  >
                    {specFor(l.type).label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/qr-code-with-letters"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-bg px-3.5 py-1.5 text-sm text-accent-text transition-colors duration-200 hover:border-line-strong"
                >
                  QR with your letters
                  <span aria-hidden className="inline-block size-1.5 rounded-full bg-primary" />
                </Link>
              </li>
            </ul>
          </nav>
        </Reveal>
      </section>
    </>
  );
}
