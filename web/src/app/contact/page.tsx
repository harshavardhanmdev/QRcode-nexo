import type { Metadata } from "next";
import { site } from "@/lib/site";
import { IconMail } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the qrdock team — questions, feedback, bug reports or partnership requests.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
        contact
      </p>
      <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Talk to us
      </h1>
      <p className="mt-3 max-w-xl text-fg-muted">
        Found a bug, want a feature, or need help with a code that won&apos;t
        scan? We read everything.
      </p>

      <div className="card mt-10 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-primary-soft text-accent-text">
          <IconMail size={24} />
        </div>
        <div>
          <h2 className="font-heading text-base font-semibold">Email us</h2>
          <a
            href={`mailto:${site.contactEmail}`}
            className="mt-1 inline-block text-sm text-accent-text underline underline-offset-4"
          >
            {site.contactEmail}
          </a>
          <p className="mt-1 text-sm text-fg-muted">
            We usually reply within one business day.
          </p>
        </div>
      </div>

      {/* The in-page contact form ships with the accounts backend (keeps
          this page honest: no fake forms that go nowhere). */}
      <p className="mt-6 text-sm text-fg-faint">
        Reporting abuse of a qrdock short link? Include the full link in your
        email — abuse reports are handled with priority.
      </p>
    </div>
  );
}
