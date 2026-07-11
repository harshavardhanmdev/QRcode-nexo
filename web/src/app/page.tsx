import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HeroQr } from "@/components/marketing/HeroQr";
import { GeneratorIsland } from "@/components/generator/GeneratorIsland";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { JsonLd, faqLd, softwareAppLd } from "@/components/seo/JsonLd";
import { faqs } from "@/lib/seo/faq";
import {
  IconLetters,
  IconShield,
  IconSparkles,
  IconDownload,
  IconScan,
  IconChart,
  IconArrowRight,
} from "@/components/ui/icons";

const features = [
  {
    icon: IconLetters,
    title: "Letters woven into the code",
    body: "Type up to 4 letters and watch them emerge from the QR modules themselves — bold strokes inside a sea of dots. Still 100% scannable.",
  },
  {
    icon: IconShield,
    title: "Private by architecture",
    body: "Everything is generated in your browser. Your links, Wi-Fi passwords and UPI IDs never touch our servers.",
  },
  {
    icon: IconSparkles,
    title: "No watermarks. No expiry.",
    body: "Static codes work forever and downloads are never branded. What you make is entirely yours.",
  },
  {
    icon: IconDownload,
    title: "Print-grade exports",
    body: "Crisp SVG for print at any size, PNG up to 4096 px, JPEG and WebP — plus one-click copy to clipboard.",
  },
  {
    icon: IconScan,
    title: "Scannability, verified live",
    body: "A real QR decoder re-reads your design after every tweak and shows a verified badge — with specific fixes when contrast or logos get risky.",
  },
  {
    icon: IconChart,
    title: "Dynamic codes + analytics",
    body: "Free account: editable destinations, scan counts by day, country and device. Reprint nothing, learn everything.",
  },
];

const qrTypes = [
  ["url", "Website / URL"],
  ["wifi", "Wi-Fi"],
  ["vcard", "vCard contact"],
  ["upi", "UPI payment"],
  ["whatsapp", "WhatsApp"],
  ["email", "Email"],
  ["sms", "SMS"],
  ["text", "Plain text"],
  ["location", "Location"],
  ["event", "Calendar event"],
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLd data={[softwareAppLd(), faqLd(faqs.slice(0, 6))]} />
      {/* HERO ---------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        {/* ambient gradient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-[80%] rounded-full opacity-25 blur-3xl motion-safe:animate-blob-a"
          style={{ background: "radial-gradient(circle, var(--brand-a), transparent 65%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] h-[30rem] w-[30rem] rounded-full opacity-20 blur-3xl motion-safe:animate-blob-b"
          style={{ background: "radial-gradient(circle, var(--brand-c), transparent 65%)" }}
        />
        <div aria-hidden className="bg-grid absolute inset-0" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-24">
          <div>
            <p className="font-heading inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-fg-muted">
              <span className="inline-block size-1.5 rounded-full bg-primary" />
              free · in-browser · no watermarks
            </p>
            <h1 className="font-heading mt-5 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              QR codes that spell <span className="text-gradient">your name</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-fg-muted">
              qrdock generates QR codes and barcodes with logos, gradients,
              frames — and up to four letters formed by the pattern itself.
              Verified scannable, exported print-ready, generated entirely in
              your browser.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/#generator" size="lg">
                Create a QR code
                <IconArrowRight size={18} />
              </Button>
              <Button href="/qr-code-with-letters" variant="secondary" size="lg">
                See the letters trick
              </Button>
            </div>
            <p className="mt-4 text-sm text-fg-faint">
              First 10 downloads free — no account needed.
            </p>
          </div>

          <Reveal y={16} className="relative mx-auto w-full max-w-md">
            <div className="card relative p-6 text-fg shadow-pop sm:p-8">
              <HeroQr className="h-auto w-full" />
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="font-heading text-xs uppercase tracking-[0.14em] text-fg-faint">
                  letter forge · preview
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-accent-text">
                  <span className="inline-block size-1.5 rounded-full bg-primary" />
                  scannable
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GENERATOR ------------------------------------------------------ */}
      <section
        id="generator"
        aria-label="QR code generator"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6"
      >
        <GeneratorIsland />
      </section>

      {/* FEATURES ------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="font-heading max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Everything the big QR sites charge for.{" "}
            <span className="text-gradient">Free, and better.</span>
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <article className="card group h-full p-6 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1">
                <div className="inline-flex size-11 items-center justify-center rounded-md bg-primary-soft text-accent-text">
                  <f.icon size={22} />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {f.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* QR TYPE STRIP -------------------------------------------------- */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="card p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold">
              One generator, every kind of code
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              Purpose-built forms with correct encoding for each type — no
              hand-crafted strings, no broken scans.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {qrTypes.map(([slug, label]) => (
                <li key={slug}>
                  <Link
                    href={`/qr-code-generator/${slug}`}
                    className="inline-flex min-h-9 items-center rounded-full border border-line bg-bg px-3.5 py-1.5 text-sm text-fg-muted transition-colors duration-200 hover:border-line-strong hover:text-accent-text"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/barcode-generator"
                  className="inline-flex min-h-9 items-center rounded-full border border-line bg-bg px-3.5 py-1.5 text-sm text-fg-muted transition-colors duration-200 hover:border-line-strong hover:text-accent-text"
                >
                  Barcodes →
                </Link>
              </li>
            </ul>
          </div>
        </Reveal>
      </section>

      {/* CTA BAND ------------------------------------------------------ */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="card relative overflow-hidden p-8 text-center sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.16]"
              style={{
                background:
                  "linear-gradient(120deg, var(--brand-a), var(--brand-b) 50%, var(--brand-c))",
              }}
            />
            <h2 className="font-heading relative text-3xl font-bold tracking-tight sm:text-4xl">
              Make a QR code people remember
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-fg-muted">
              Your brand colors, your logo, your initials in the pattern —
              downloaded in seconds, scannable for a lifetime.
            </p>
            <div className="relative mt-7 flex justify-center">
              <Button href="/#generator" size="lg">
                Start generating — it&apos;s free
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
