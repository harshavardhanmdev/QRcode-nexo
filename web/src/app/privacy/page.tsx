import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "qrdock privacy policy — QR codes are generated in your browser and your content never reaches our servers. What little we do store, and why.",
  alternates: { canonical: "/privacy" },
};

const updated = "10 July 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-fg-faint">Last updated: {updated}</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-fg-muted">
        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            The short version
          </h2>
          <p className="mt-2">
            qrdock generates QR codes and barcodes entirely in your browser.
            The content you encode — links, text, Wi-Fi credentials, contact
            details, UPI IDs — is processed on your device and{" "}
            <strong className="text-fg">never transmitted to our servers</strong>.
            We collect the minimum needed to run accounts, dynamic codes and
            abuse prevention, and we don&apos;t sell data to anyone.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            1. What happens in your browser
          </h2>
          <p className="mt-2">
            Code generation, styling, logo embedding, letter rendering and
            scannability verification all run locally via JavaScript. Uploaded
            logo images are read into browser memory only and are never sent to
            qrdock. We keep a small counter of your downloads and your style
            preferences in your browser&apos;s localStorage; you can clear it at
            any time in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            2. What we store if you create an account
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Your email address and a salted, hashed password (never the password itself), or your Google account identifier if you sign in with Google.</li>
            <li>Designs you explicitly save (their style configuration, including any logo you chose to attach to a saved design).</li>
            <li>Your dynamic QR codes: the short-link slug and the destination URL you set.</li>
            <li>A session cookie (httpOnly, first-party) that keeps you signed in. No cross-site tracking cookies.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            3. Dynamic QR scan analytics
          </h2>
          <p className="mt-2">
            When someone scans a dynamic code, our redirect service records a
            timestamp, a coarse device class (mobile / desktop / tablet) and,
            when available, a country code. We do <strong className="text-fg">not</strong>{" "}
            store the scanner&apos;s IP address; IPs used for rate limiting are
            processed as salted hashes whose keys rotate monthly, making them
            unlinkable after rotation.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            4. Analytics and advertising
          </h2>
          <p className="mt-2">
            We use cookieless, aggregate web analytics to understand overall
            traffic. If advertising (e.g. Google AdSense) is enabled on some
            pages, the ad provider may use cookies or similar technologies
            under its own policy; where required, you will be shown a consent
            prompt before any advertising cookies are set. Ads never appear
            inside the generator workspace.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            5. Emails
          </h2>
          <p className="mt-2">
            We email you only for account essentials (verification, password
            reset) and replies to messages you send us. No marketing lists, no
            newsletters unless you explicitly opt in.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            6. Data retention and deletion
          </h2>
          <p className="mt-2">
            Scan events are retained for up to 13 months, then deleted. You can
            delete saved designs and dynamic codes at any time from your
            account, and you can request full account deletion by emailing{" "}
            <a href={`mailto:${site.contactEmail}`} className="text-accent-text underline underline-offset-4">
              {site.contactEmail}
            </a>{" "}
            — we complete deletions within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-fg">
            7. Who we are
          </h2>
          <p className="mt-2">
            qrdock is operated by {site.company}, India. For any privacy
            question or complaint, contact{" "}
            <a href={`mailto:${site.contactEmail}`} className="text-accent-text underline underline-offset-4">
              {site.contactEmail}
            </a>
            . We will update this policy as the product evolves and always
            change the date above when we do.
          </p>
        </section>
      </div>
    </div>
  );
}
