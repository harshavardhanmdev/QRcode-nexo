import type { Metadata } from "next";
import { GeneratorIsland } from "@/components/generator/GeneratorIsland";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { IconLetters, IconScan, IconShield } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "QR Code with Letters — your name inside the pattern",
  description:
    "Create a QR code with your name, initials or brand letters visibly formed by the QR pattern itself. Free, fully scannable (live-verified), no watermarks. The only generator with letter forge.",
  alternates: { canonical: "/qr-code-with-letters" },
  keywords: [
    "qr code with letters",
    "qr code with name",
    "qr code with initials",
    "custom qr code design",
    "personalized qr code",
  ],
};

const steps = [
  {
    icon: IconLetters,
    title: "Type up to 4 letters",
    body: "Initials, a brand code, a table number — A–Z and 0–9.",
  },
  {
    icon: IconShield,
    title: "The pattern redraws itself",
    body: "Modules under the letter strokes become bold squares; the rest become dots. No data is destroyed — error correction stays untouched.",
  },
  {
    icon: IconScan,
    title: "Verified before you download",
    body: "A real decoder re-reads the design after every tweak. You export only codes that scan.",
  },
];

export default function LettersLandingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 text-center sm:px-6 lg:pt-20">
          <p className="font-heading inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-fg-muted">
            <span className="inline-block size-1.5 rounded-full bg-primary" />
            qrdock exclusive
          </p>
          <h1 className="font-heading mx-auto mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            A QR code with <span className="text-gradient">your letters</span>{" "}
            in the pattern
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
            Not a logo pasted on top — the code itself spells your name. Up to
            four letters emerge from the modules, and the code stays fully
            scannable. Try it: your initials are one keystroke away.
          </p>
        </div>
      </section>

      <section
        id="generator"
        aria-label="Letters QR generator"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6"
      >
        <GeneratorIsland presetType="url" presetLetters="QR" />
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="font-heading text-center text-3xl font-bold tracking-tight">
            How letters survive inside a QR code
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <StaggerItem key={s.title}>
              <article className="card h-full p-6 text-center">
                <div className="mx-auto inline-flex size-11 items-center justify-center rounded-md bg-primary-soft text-accent-text">
                  <s.icon size={22} />
                </div>
                <p className="font-heading mt-3 text-xs text-fg-faint">
                  step {i + 1}
                </p>
                <h3 className="font-heading mt-1 text-base font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {s.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-12">
          <div className="card mx-auto max-w-3xl p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold">
              Why this doesn&apos;t break scanning
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              A QR scanner samples the <em>center</em> of each module and only
              cares whether it reads dark or light. qrdock&apos;s letter forge
              never flips a module — dark modules under your letters are drawn
              as bold connected squares, dark modules elsewhere shrink into
              dots (never below the safe sampling size), and light modules
              inside the letters get a tint far too faint to register as dark.
              The data, and the error-correction budget, are untouched. We
              even test all eight legal mask patterns and pick the one that
              puts the most ink under your letters.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
