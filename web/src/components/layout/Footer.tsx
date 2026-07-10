import Link from "next/link";
import { Wordmark } from "@/components/layout/Wordmark";
import { site } from "@/lib/site";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Generators",
    links: [
      { href: "/qr-code-generator/url", label: "URL QR code" },
      { href: "/qr-code-generator/wifi", label: "Wi-Fi QR code" },
      { href: "/qr-code-generator/vcard", label: "vCard QR code" },
      { href: "/qr-code-generator/upi", label: "UPI payment QR" },
      { href: "/barcode-generator", label: "Barcode generator" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/qr-code-with-letters", label: "QR with letters" },
      { href: "/scan", label: "Scan a QR code" },
      { href: "/tools/bulk-qr-generator", label: "Bulk QR (CSV)" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              Free QR codes &amp; barcodes with logos, gradients and letters
              woven into the pattern. Generated privately in your browser — no
              watermarks, no expiry.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-fg-faint">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-fg-muted transition-colors duration-200 hover:text-accent-text"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-fg-faint">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-fg-faint">
            Powered by {site.company}
          </p>
        </div>
      </div>
    </footer>
  );
}
