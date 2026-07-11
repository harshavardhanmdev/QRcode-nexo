import type { QrType } from "@/lib/qr-engine";
import type { BarcodeFormat } from "@/lib/qr-engine/barcode";
import type { Faq } from "@/lib/seo/faq";

/**
 * Programmatic-SEO content source. Every landing page (10 QR types +
 * 6 barcode formats) renders from these records via server components,
 * with the matching JSON-LD (HowTo, FAQPage, Breadcrumb) built from the
 * same data — copy and structured data can never drift apart.
 */

export interface LandingContent {
  type: QrType;
  title: string;
  metaDescription: string;
  h1: string;
  /** the word(s) inside h1 to paint with the brand gradient */
  h1Highlight: string;
  intro: string;
  steps: string[];
  faqs: Faq[];
  keywords: string[];
}

export const qrLandings: LandingContent[] = [
  {
    type: "url",
    title: "URL QR Code Generator — free, no expiry, no watermark",
    metaDescription:
      "Turn any link into a QR code free: custom colors, logo, frames, even your initials inside the pattern. Codes never expire and downloads are watermark-free (SVG, PNG up to 4096 px).",
    h1: "Turn any link into a QR code",
    h1Highlight: "QR code",
    intro:
      "Paste a link, style the code, download it print-ready. URL QR codes made on qrdock are static — they encode the address itself, so they keep working forever without depending on anyone's server, including ours.",
    steps: [
      "Paste your link — https:// is added automatically if you skip it.",
      "Style it: colors, module shapes, a center logo, a SCAN ME frame, or your initials with letter forge.",
      "Watch the live badge — a real decoder verifies every change scans.",
      "Download SVG for print or PNG up to 4096 px. Free, no watermark.",
    ],
    faqs: [
      {
        q: "Does a URL QR code expire?",
        a: "Not on qrdock. The link is encoded directly into the pattern, so the code works as long as your website does. Nothing routes through our servers.",
      },
      {
        q: "Should the link be short?",
        a: "Shorter links produce sparser, easier-to-scan codes. Long URLs still work, but if your link is very long, a free qrdock account gives you a short dynamic link that also lets you change the destination later.",
      },
      {
        q: "Can I track how many people scan it?",
        a: "Static codes can't be tracked by design — that's the privacy trade-off. If you want scan counts by day, country and device, create a dynamic QR code with a free account.",
      },
    ],
    keywords: ["url qr code generator", "link to qr code", "website qr code free"],
  },
  {
    type: "text",
    title: "Text QR Code Generator — encode any message free",
    metaDescription:
      "Create a QR code containing plain text: serial numbers, instructions, notes or messages. Works offline forever, generated privately in your browser, free SVG/PNG download.",
    h1: "Put any text inside a QR code",
    h1Highlight: "any text",
    intro:
      "A text QR code shows its content directly in the scanner — no website needed, no internet needed. Perfect for serial numbers, equipment instructions, scavenger hunts and notes that must outlive any URL.",
    steps: [
      "Type your text — up to a few hundred characters scans comfortably.",
      "Style the code; error correction adapts automatically.",
      "Download as SVG or high-resolution PNG.",
    ],
    faqs: [
      {
        q: "How much text fits in a QR code?",
        a: "Technically up to ~4,000 characters, but density grows with length and phone cameras struggle beyond a few hundred. qrdock warns you when the code gets dense and suggests alternatives.",
      },
      {
        q: "Does the reader need internet?",
        a: "No. The text lives inside the pattern itself, so it displays even in airplane mode — one of the few truly offline QR types.",
      },
    ],
    keywords: ["text qr code generator", "qr code for text message", "offline qr code"],
  },
  {
    type: "wifi",
    title: "Wi-Fi QR Code Generator — scan to connect, free",
    metaDescription:
      "Make a Wi-Fi QR code guests can scan to join your network instantly — no password typing. WPA/WPA2/WPA3 supported, generated privately in your browser so your password never leaves your device.",
    h1: "Let guests join your Wi-Fi with one scan",
    h1Highlight: "one scan",
    intro:
      "Print it at the reception desk, frame it in the café, stick it on the fridge. Phones recognize Wi-Fi QR codes natively — the camera app offers to join the network, password included. And because qrdock generates everything in your browser, your Wi-Fi password never touches the internet.",
    steps: [
      "Enter the network name (SSID) and password exactly as configured.",
      "Pick the security type — WPA/WPA2/WPA3 covers almost every modern router.",
      "Style it, verify the live scan badge, and download for print.",
    ],
    faqs: [
      {
        q: "Is it safe to type my Wi-Fi password here?",
        a: "Yes — qrdock builds the code entirely inside your browser. The password is never sent to us or anyone else; you can even load the page, disconnect from the internet, and generate offline.",
      },
      {
        q: "Which phones support Wi-Fi QR codes?",
        a: "iPhone (iOS 11+) and Android (10+ natively, earlier via Google Lens) both join networks straight from the camera app.",
      },
      {
        q: "What if my network is hidden?",
        a: "Tick the 'hidden network' option — the code then tells the phone to connect without waiting to see the SSID broadcast.",
      },
    ],
    keywords: ["wifi qr code generator", "wi-fi qr code", "scan to connect wifi"],
  },
  {
    type: "vcard",
    title: "vCard QR Code Generator — scan-to-save business card",
    metaDescription:
      "Create a vCard QR code that adds your name, phone, email and company to contacts in one scan. Free, no watermark, personal data processed only in your browser.",
    h1: "Your business card, saved in one scan",
    h1Highlight: "one scan",
    intro:
      "A vCard QR code opens the scanner's contact form pre-filled with your details — name, numbers, email, company, website, address. Put it on business cards, email signatures, conference badges and shop signage. Your details are encoded in your browser and never uploaded.",
    steps: [
      "Fill in the contact fields you want to share — only the name is required.",
      "Add your logo or initials so the card looks unmistakably yours.",
      "Verify and download. Test-scan once with your own phone before printing a batch.",
    ],
    faqs: [
      {
        q: "vCard or a link to my website — which is better for business cards?",
        a: "vCard saves the contact instantly and works with zero internet. A URL depends on connectivity but can carry richer content. Many cards carry a vCard QR on the back and a printed URL on the front.",
      },
      {
        q: "Why is my vCard QR code so dense?",
        a: "Every field adds data. Skip optional fields you don't need — dropping the postal address alone often shrinks the code by a version or two and makes small prints scan better.",
      },
    ],
    keywords: ["vcard qr code generator", "business card qr code", "contact qr code"],
  },
  {
    type: "email",
    title: "Email QR Code Generator — pre-filled mailto in one scan",
    metaDescription:
      "Generate a QR code that opens a pre-addressed email with subject and message filled in. Free, customizable, no watermark — great for feedback, support and inquiries.",
    h1: "Open a ready-to-send email with a scan",
    h1Highlight: "a scan",
    intro:
      "An email QR code opens the scanner's mail app with the recipient, subject and body already filled in. Lower the friction and more people actually write — perfect for feedback posters, support stickers and 'report an issue' tags on equipment.",
    steps: [
      "Enter the destination address, plus an optional subject and message template.",
      "Style and verify the code.",
      "Download and place it where people have a question in their hands.",
    ],
    faqs: [
      {
        q: "Can I pre-fill the subject and body?",
        a: "Yes — both are encoded into the mailto link. Pre-filling a template ('Feedback about table 4: …') dramatically raises response rates.",
      },
      {
        q: "Does it work with Gmail and Outlook?",
        a: "It opens whatever mail app the phone has set as default — Gmail, Outlook, Apple Mail, anything that registers for mailto links.",
      },
    ],
    keywords: ["email qr code generator", "mailto qr code", "qr code for email address"],
  },
  {
    type: "sms",
    title: "SMS QR Code Generator — pre-typed text message",
    metaDescription:
      "Create a QR code that opens the messaging app with your number and message pre-typed. Free and customizable — ideal for opt-ins, RSVPs and quick contact.",
    h1: "A text message, pre-typed by a scan",
    h1Highlight: "pre-typed",
    intro:
      "SMS QR codes open the phone's messaging app with the number and message ready to send — the classic mechanic behind 'text JOIN to subscribe' campaigns, RSVP cards and service callback requests.",
    steps: [
      "Enter the phone number (with country code for international audiences).",
      "Optionally pre-type the message — keywords like JOIN or RSVP work great.",
      "Style, verify, download.",
    ],
    faqs: [
      {
        q: "Will carriers charge the person scanning?",
        a: "Sending the SMS costs whatever their normal plan charges — the QR code itself adds nothing. Most plans include unlimited texts.",
      },
    ],
    keywords: ["sms qr code generator", "text message qr code", "qr code to send sms"],
  },
  {
    type: "whatsapp",
    title: "WhatsApp QR Code Generator — start a chat instantly",
    metaDescription:
      "Free WhatsApp QR code: customers scan and a chat with your number opens, message pre-typed. Perfect for storefronts, packaging and Instagram bios. No watermark.",
    h1: "From poster to WhatsApp chat in one scan",
    h1Highlight: "WhatsApp chat",
    intro:
      "For businesses across India and much of the world, WhatsApp is the storefront. This code opens a chat with your number — message pre-typed — the moment someone scans. Stick it on the counter, the delivery bag, the visiting card.",
    steps: [
      "Enter your WhatsApp number with country code (91 for India), digits only.",
      "Pre-type the opening message — 'Hi! I'd like to order…' removes all friction.",
      "Style it with your brand colors, verify, download.",
    ],
    faqs: [
      {
        q: "Does this work with WhatsApp Business?",
        a: "Yes — wa.me links open chats with any WhatsApp number, personal or Business. Business accounts additionally show your catalog and quick replies.",
      },
      {
        q: "The scan says the number isn't on WhatsApp — why?",
        a: "The number must be entered with its country code and without +, spaces or dashes. For an Indian number like 98765 43210, enter 919876543210.",
      },
    ],
    keywords: ["whatsapp qr code generator", "wa.me qr code", "whatsapp chat qr code"],
  },
  {
    type: "upi",
    title: "UPI QR Code Generator — free payment QR for GPay, PhonePe, Paytm",
    metaDescription:
      "Make a standards-compliant UPI payment QR code free: enter your UPI ID and name, optionally fix the amount. Works with GPay, PhonePe, Paytm and BHIM. Your VPA never leaves your browser.",
    h1: "Accept UPI payments with your own QR code",
    h1Highlight: "UPI payments",
    intro:
      "Every shop counter in India runs on UPI QR codes — but the printed ones lock you into one app's branding. qrdock builds a clean, standards-compliant upi:// code from your own UPI ID that every app can pay: GPay, PhonePe, Paytm, BHIM, all of them. Style it with your shop's colors, add your logo, print it once.",
    steps: [
      "Enter your UPI ID (VPA) — like yourname@oksbi or shop@ybl — and your payee name.",
      "Optionally fix an amount (₹) for set-price items, or leave it open.",
      "Verify with the live badge, then test with one ₹1 payment before printing.",
    ],
    faqs: [
      {
        q: "Is it safe to generate a UPI QR here?",
        a: "Your UPI ID is processed entirely in your browser and never sent to us. Also remember: a UPI QR can only receive money into your account — scanning one never pulls money out of the payer without their confirmation in their UPI app.",
      },
      {
        q: "Which apps can pay this code?",
        a: "Anything on the UPI network: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, WhatsApp Pay and every UPI-enabled banking app. The upi:// format is the NPCI standard they all read.",
      },
      {
        q: "Fixed amount or open amount?",
        a: "Fixed amounts suit set-price products and reduce entry errors; open amounts suit shop counters. You can generate one of each — downloads are free.",
      },
      {
        q: "Can I add my shop logo?",
        a: "Yes — upload it in the logo section. Error correction rises automatically and the live decoder confirms the code still scans before you download.",
      },
    ],
    keywords: [
      "upi qr code generator",
      "upi payment qr code",
      "gpay qr code",
      "phonepe qr code",
      "paytm qr code generator",
    ],
  },
  {
    type: "location",
    title: "Location QR Code Generator — open a map pin on scan",
    metaDescription:
      "Create a QR code that opens your exact coordinates in the scanner's maps app. Free and customizable — for invitations, storefronts, event signage and delivery points.",
    h1: "Drop a map pin into their pocket",
    h1Highlight: "map pin",
    intro:
      "A location QR code opens the scanner's default maps app centered on your coordinates — no address typos, no 'which gate?' calls. Put it on wedding invitations, event flyers, business cards and delivery instructions.",
    steps: [
      "Get your coordinates: in Google Maps, long-press the spot and copy the two numbers.",
      "Paste latitude and longitude into the form.",
      "Style, verify, download, and test-scan once to confirm the pin.",
    ],
    faqs: [
      {
        q: "How do I find my latitude and longitude?",
        a: "Open Google Maps, press and hold on the exact spot, and the coordinates appear in the search box — first number is latitude, second is longitude.",
      },
      {
        q: "Google Maps or Apple Maps?",
        a: "The geo: format is app-neutral — each phone opens its own default maps app with your pin, which is exactly what you want.",
      },
    ],
    keywords: ["location qr code generator", "google maps qr code", "gps qr code"],
  },
  {
    type: "event",
    title: "Event QR Code Generator — scan to add to calendar",
    metaDescription:
      "Generate a calendar-event QR code: guests scan and your event lands in their calendar with time, venue and details. Free, customizable, watermark-free.",
    h1: "Your event, in their calendar, instantly",
    h1Highlight: "in their calendar",
    intro:
      "Posters get photographed and forgotten. An event QR code gets scanned and remembered — it drops the title, time, venue and description straight into the guest's calendar app, reminders included.",
    steps: [
      "Enter the event title, start time, and optionally the end, venue and details.",
      "Style it to match the poster or invitation.",
      "Verify and download — the code embeds the event itself, no website needed.",
    ],
    faqs: [
      {
        q: "Does it work with Google Calendar and iPhone?",
        a: "Yes. The code carries a standard vEvent — Android and iOS both offer to add it to the default calendar on scan.",
      },
      {
        q: "What if the event details change?",
        a: "Static codes can't be edited after printing. If plans might shift, encode a URL to an event page instead — or use a free qrdock dynamic code you can repoint anytime.",
      },
    ],
    keywords: ["event qr code generator", "calendar qr code", "add to calendar qr"],
  },
];

export function qrLanding(type: string): LandingContent | undefined {
  return qrLandings.find((l) => l.type === type);
}

/* ------------------------------------------------------------------ */

export interface BarcodeLanding {
  format: BarcodeFormat;
  title: string;
  metaDescription: string;
  h1: string;
  h1Highlight: string;
  intro: string;
  faqs: Faq[];
  keywords: string[];
}

export const barcodeLandings: BarcodeLanding[] = [
  {
    format: "code128",
    title: "Code 128 Barcode Generator — free, high-density, print-ready",
    metaDescription:
      "Generate Code 128 barcodes free: letters, numbers and symbols in a compact, warehouse-standard format. SVG and 2048 px PNG export, no watermark.",
    h1: "Code 128 — the barcode that encodes anything",
    h1Highlight: "Code 128",
    intro:
      "Code 128 is the workhorse of logistics: compact, high-density, and able to carry letters, digits and symbols. If you're labeling inventory, assets, shelf bins or internal SKUs and you control the scanners, this is almost always the right format.",
    faqs: [
      {
        q: "Code 128 or Code 39?",
        a: "Code 128 — it's denser (shorter bars for the same content), has a built-in checksum, and supports the full ASCII set. Choose Code 39 only when legacy equipment demands it.",
      },
      {
        q: "Can I use Code 128 for retail products?",
        a: "In-store and internally, yes. For products sold through other retailers you need a GS1-assigned EAN-13/UPC-A number instead.",
      },
    ],
    keywords: ["code 128 generator", "code 128 barcode", "free barcode generator"],
  },
  {
    format: "ean13",
    title: "EAN-13 Barcode Generator — free retail barcode with checksum",
    metaDescription:
      "Create EAN-13 retail barcodes free: enter 12 digits and the checksum is calculated automatically. Print-ready SVG/PNG export for product packaging.",
    h1: "EAN-13 — the barcode on almost everything",
    h1Highlight: "EAN-13",
    intro:
      "EAN-13 is the format on virtually every retail product outside North America (and accepted inside it too). Enter your 12-digit number and qrdock computes the check digit for you; enter all 13 and it validates the checksum.",
    faqs: [
      {
        q: "Where do I get an EAN number for my product?",
        a: "Official retail numbers are issued by GS1 (gs1india.org in India). The generator renders any valid number — but to sell through retailers and marketplaces, the number itself must be registered to you.",
      },
      {
        q: "What size should I print it?",
        a: "The nominal size is 37.29 × 25.93 mm; scanners tolerate 80–200% of that. Export SVG and scale losslessly in your packaging artwork.",
      },
    ],
    keywords: ["ean-13 barcode generator", "ean 13 with checksum", "retail barcode generator"],
  },
  {
    format: "ean8",
    title: "EAN-8 Barcode Generator — free small-packaging barcode",
    metaDescription:
      "Generate EAN-8 barcodes for small packaging free: 7 digits plus automatic checksum, crisp SVG/PNG export, no watermark.",
    h1: "EAN-8 — retail barcode for tiny packages",
    h1Highlight: "EAN-8",
    intro:
      "When the packaging is too small for an EAN-13 — cosmetics, chewing gum, spice sachets — EAN-8 packs a GS1 retail number into roughly half the width.",
    faqs: [
      {
        q: "Can I just shorten my EAN-13 to 8 digits?",
        a: "No — EAN-8 numbers are a separate, limited GS1 allocation, assigned specifically for small packages. Apply through your GS1 member organization.",
      },
    ],
    keywords: ["ean-8 barcode generator", "small package barcode", "ean 8 free"],
  },
  {
    format: "upca",
    title: "UPC-A Barcode Generator — free North American retail barcode",
    metaDescription:
      "Create UPC-A barcodes free: 11 digits with automatic check digit, print-ready SVG and PNG export for products sold in the US and Canada.",
    h1: "UPC-A — the North American retail standard",
    h1Highlight: "UPC-A",
    intro:
      "Selling into the US or Canada? UPC-A is the expected symbol at checkout. Enter 11 digits and the check digit is computed automatically; modern EAN-13 scanners read UPC-A too (it's the same system with a leading zero).",
    faqs: [
      {
        q: "UPC-A or EAN-13 for Amazon?",
        a: "Amazon accepts both as GTINs. If you sell globally, an EAN-13 covers everything; US-focused brands traditionally use UPC-A. Either way the number must come from GS1.",
      },
    ],
    keywords: ["upc barcode generator", "upc-a generator free", "upc code maker"],
  },
  {
    format: "code39",
    title: "Code 39 Barcode Generator — free legacy-compatible barcode",
    metaDescription:
      "Generate Code 39 barcodes free — the legacy format readable by virtually every scanner ever made. A–Z, 0–9 and basic symbols, SVG/PNG export.",
    h1: "Code 39 — maximum scanner compatibility",
    h1Highlight: "Code 39",
    intro:
      "Code 39 is the oldest widely-used alphanumeric barcode — bulkier than Code 128, but readable by effectively every scanner manufactured in the last four decades. It survives in defense, healthcare and industrial systems for exactly that reason.",
    faqs: [
      {
        q: "Why is my Code 39 barcode so wide?",
        a: "Code 39 encodes each character with wide bars and no compression. If width matters and your scanners are modern, switch to Code 128 for the same content at roughly half the width.",
      },
    ],
    keywords: ["code 39 barcode generator", "code 39 free", "alphanumeric barcode"],
  },
  {
    format: "itf14",
    title: "ITF-14 Barcode Generator — free carton/GTIN-14 barcode",
    metaDescription:
      "Create ITF-14 carton barcodes free: 13 digits with automatic check digit, the standard for shipping cases and outer packaging. SVG/PNG export.",
    h1: "ITF-14 — the barcode on the shipping carton",
    h1Highlight: "ITF-14",
    intro:
      "ITF-14 carries the GTIN-14 that identifies a case or carton of products (not the single unit — that's the EAN/UPC inside). Its thick bearer bars are designed to print reliably on corrugated cardboard.",
    faqs: [
      {
        q: "How does ITF-14 relate to my product's EAN-13?",
        a: "A GTIN-14 is typically your EAN-13 number prefixed with a packaging-level indicator digit (1–8) and a recalculated check digit. Your GS1 documentation covers the exact scheme.",
      },
    ],
    keywords: ["itf-14 barcode generator", "gtin-14 barcode", "carton barcode generator"],
  },
];

export function barcodeLanding(format: string): BarcodeLanding | undefined {
  return barcodeLandings.find((l) => l.format === format);
}
