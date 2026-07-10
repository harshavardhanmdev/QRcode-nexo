export const site = {
  /** Lowercase brand wordmark — always written "qrdock". */
  name: "qrdock",
  title: "qrdock — Free QR Code & Barcode Generator",
  description:
    "Create free QR codes and barcodes with logos, gradients, frames — and your name written into the QR pattern itself. No watermarks, no expiry, everything generated privately in your browser.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://qr.theslpl.in",
  company: "Nexorium Systems Private Limited",
  contactEmail: "saradapublications18@gmail.com",
  github: "https://github.com/harshavardhanmdev/QRcode-nexo",
  locale: "en",
} as const;

export type Site = typeof site;
