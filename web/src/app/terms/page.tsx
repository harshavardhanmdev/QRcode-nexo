import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of qrdock — free QR code and barcode generation, accounts, dynamic short links and acceptable use.",
  alternates: { canonical: "/terms" },
};

const updated = "10 July 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-fg-faint">Last updated: {updated}</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-fg-muted">
        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">1. The service</h2>
          <p className="mt-2">
            qrdock (&quot;the service&quot;) lets you generate, customize and
            download QR codes and barcodes, and — with a free account — create
            dynamic short links with scan statistics. The service is operated
            by {site.company} (&quot;we&quot;, &quot;us&quot;). By using it you
            agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            2. Your codes belong to you
          </h2>
          <p className="mt-2">
            You own the codes you generate and the content you encode. We claim
            no rights over your downloads and attach no watermarks. Static
            codes are self-contained; they keep working regardless of qrdock.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">3. Acceptable use</h2>
          <p className="mt-2">You must not use qrdock — in particular its dynamic short links — to:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>link to malware, phishing, credential-harvesting or other fraudulent content;</li>
            <li>impersonate another person or organization, or mislead people about a link&apos;s destination;</li>
            <li>distribute content that is illegal in India or in the jurisdiction of the people you target;</li>
            <li>probe, overload or disrupt the service (rate limits are enforced).</li>
          </ul>
          <p className="mt-2">
            We may disable any dynamic link or account that violates these
            rules, without notice where harm is active. Report abusive links to{" "}
            <a href={`mailto:${site.contactEmail}`} className="text-accent-text underline underline-offset-4">
              {site.contactEmail}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">4. Accounts</h2>
          <p className="mt-2">
            Accounts are free. You are responsible for keeping your credentials
            secure and for activity under your account. We may terminate
            accounts that breach these terms; you may delete your account at
            any time.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            5. Dynamic links depend on the service
          </h2>
          <p className="mt-2">
            Dynamic QR codes redirect through qrdock. We work to keep the
            redirect service highly available, but it is provided free of
            charge and we cannot guarantee uninterrupted operation. For
            mission-critical printed material, consider a static code.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">6. No warranty</h2>
          <p className="mt-2">
            The service is provided &quot;as is&quot; without warranties of any
            kind. Always test a customized code with your target devices before
            mass printing — the built-in verifier is a strong signal, not a
            guarantee for every scanner ever made.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            7. Limitation of liability
          </h2>
          <p className="mt-2">
            To the maximum extent permitted by law, {site.company} is not
            liable for indirect, incidental or consequential damages arising
            from use of the service, including losses caused by unscannable
            prints, third-party scanning apps, or downtime of dynamic links.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">8. Changes & law</h2>
          <p className="mt-2">
            We may update these terms as the product evolves; the date above
            reflects the latest revision, and continued use means acceptance.
            These terms are governed by the laws of India.
          </p>
        </section>
      </div>
    </div>
  );
}
