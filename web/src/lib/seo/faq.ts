export type Faq = { q: string; a: string };

/** Site-wide FAQ — rendered on /faq and embedded as FAQPage JSON-LD. */
export const faqs: Faq[] = [
  {
    q: "Is qrdock really free?",
    a: "Yes. Every QR code and barcode you create on qrdock is free to download, with no watermarks and no expiry. Your first 10 downloads need no account at all; after that a free account keeps downloads unlimited and unlocks saved designs, dynamic QR codes and bulk generation.",
  },
  {
    q: "Do my QR codes expire?",
    a: "Never. Static QR codes generated on qrdock encode your data directly, so they work forever — they don't depend on our servers at all. Dynamic QR codes (the editable kind) stay active as long as your free account exists.",
  },
  {
    q: "Is my data uploaded to your servers?",
    a: "No. qrdock generates QR codes and barcodes entirely inside your browser. The text, Wi-Fi password, contact card or UPI ID you enter never leaves your device. That's different from most QR generators, which send your data to their servers.",
  },
  {
    q: "How do the letters inside the QR code work?",
    a: "Our letter-forge engine styles the QR's own modules — the letters are drawn by making the modules under the letter strokes bold solid squares while the rest stay as smaller dots. No data is destroyed, so the code stays fully scannable, and a built-in scanner verifies every design live.",
  },
  {
    q: "Will a customized QR code still scan?",
    a: "qrdock decodes your design with a real QR reader every time you change a color, logo or letters, and shows a live 'Scannability verified' badge. If a combination gets risky (low contrast, oversized logo), you get a specific warning and a one-tap fix suggestion.",
  },
  {
    q: "What is a dynamic QR code?",
    a: "A dynamic QR code points to a short qrdock link that redirects to your destination. You can change the destination any time without reprinting the code, and see scan analytics — total scans, scans per day, countries and devices. Free accounts include 5 dynamic codes.",
  },
  {
    q: "Can I add my logo to the QR code?",
    a: "Yes — upload any PNG, JPG or SVG and qrdock places it in the center with an optional knockout so it stays readable. Error correction is raised automatically and the risk meter tells you if the logo is too large to scan reliably.",
  },
  {
    q: "Which barcode formats are supported?",
    a: "Code 128, EAN-13, EAN-8, UPC-A, Code 39 and ITF-14, with correct checksum validation for retail formats. You can customize colors, bar height and text, then export as SVG or high-resolution PNG.",
  },
  {
    q: "What file formats can I download?",
    a: "SVG (perfect for print at any size), PNG up to 4096 px, JPEG and WebP. You can also copy the QR code straight to your clipboard as an image.",
  },
  {
    q: "Can I make a UPI payment QR code?",
    a: "Yes. Enter your UPI ID (VPA), payee name and an optional amount, and qrdock builds a standards-compliant upi:// QR code that works with GPay, PhonePe, Paytm, BHIM and every other UPI app.",
  },
  {
    q: "How big should I print a QR code?",
    a: "Rule of thumb: printed width should be at least 1/10 of the scanning distance. A code scanned from 25 cm should be at least 2.5 cm wide. qrdock's export panel shows the physical print size of your chosen resolution at 300 DPI.",
  },
];
