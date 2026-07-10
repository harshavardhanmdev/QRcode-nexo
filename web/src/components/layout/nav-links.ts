export type NavLink = { href: string; label: string; highlight?: boolean };

export const navLinks: NavLink[] = [
  { href: "/qr-code-generator/url", label: "QR Codes" },
  { href: "/barcode-generator", label: "Barcodes" },
  { href: "/qr-code-with-letters", label: "Letters QR", highlight: true },
  { href: "/scan", label: "Scan" },
  { href: "/faq", label: "FAQ" },
];
