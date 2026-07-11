export interface PostSection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  datePublished: string; // ISO
  readMinutes: number;
  sections: PostSection[];
  /** internal link target that fits the post's topic */
  cta: { label: string; href: string };
}

export const posts: Post[] = [
  {
    slug: "upi-qr-codes-explained",
    title: "UPI QR codes explained: how upi:// links work and how to make your own",
    description:
      "What's actually inside a UPI payment QR code, why every app can read it, and how to generate a standards-compliant one for your shop — free.",
    datePublished: "2026-07-10",
    readMinutes: 5,
    sections: [
      {
        paragraphs: [
          "Every UPI payment QR — the one at the tea stall, the kirana store, the parking lot — encodes a single short line of text: a upi:// link. When any UPI app scans it, the app reads the payee's ID, name and optional amount from that link and opens a pre-filled payment screen. There's no magic and no middleman; the standard is published by NPCI, the body that runs UPI.",
        ],
      },
      {
        heading: "What's inside the code",
        paragraphs: [
          "A minimal UPI QR contains upi://pay followed by query parameters: pa (payee address — your UPI ID like shop@ybl), pn (payee name), and optionally am (amount), tn (transaction note) and cu (currency, INR). That's it. When you fix am, the payer can't edit the amount — useful for set-price items. Leave it out and the payer types the amount, which suits shop counters.",
        ],
      },
      {
        heading: "Why one code works in every app",
        paragraphs: [
          "GPay, PhonePe, Paytm, BHIM and every UPI-enabled bank app all implement the same NPCI specification, so a plain upi:// QR is app-neutral by construction. The branded stands that payment companies hand out encode the same thing — the branding is marketing, not technology. Generating your own means your counter can carry your identity instead of theirs.",
        ],
      },
      {
        heading: "Safety, in one paragraph",
        paragraphs: [
          "A UPI QR code can only request a payment into the account behind the UPI ID — scanning one never takes money without the payer confirming inside their app with their PIN. The scams you read about work by tricking people into approving 'collect requests' or entering PINs to 'receive' money (receiving never needs a PIN). A printed static QR that you generated yourself, showing your own UPI ID, is as safe as printed text.",
        ],
      },
      {
        heading: "Make one in a minute",
        paragraphs: [
          "Enter your UPI ID and display name in the qrdock UPI generator, optionally fix the amount, style it with your shop colors and logo, and check the live 'Scannability verified' badge. Do one ₹1 test payment before you print big. Your UPI ID is processed entirely in your browser — it never reaches our servers.",
        ],
      },
    ],
    cta: { label: "Create your UPI payment QR", href: "/qr-code-generator/upi" },
  },
  {
    slug: "qr-code-print-size-guide",
    title: "How big should a QR code be? The print-size math that actually matters",
    description:
      "Scan distance, module density and DPI — three numbers that decide whether your printed QR code scans instantly or embarrasses you. With a practical size table.",
    datePublished: "2026-07-10",
    readMinutes: 4,
    sections: [
      {
        paragraphs: [
          "Most 'my QR code won't scan' problems are size problems. The rule that solves ninety percent of them: print the code at least one-tenth of the distance it will be scanned from. A poster read from 3 meters needs a 30 cm code. A table tent read from 30 cm needs 3 cm.",
        ],
      },
      {
        heading: "Density changes the rule",
        paragraphs: [
          "That 1:10 rule assumes a typical code (version 3–6, i.e. 29–41 modules per side). The more content you encode, the more modules the code has, and the bigger each printed module must stay for a camera to resolve it. Keep each module above roughly 0.4 mm in print. qrdock shows the version and module count under the preview — if you're at version 15+, shorten the content or switch to a short link.",
        ],
      },
      {
        heading: "Resolution: vector beats pixels",
        paragraphs: [
          "For anything printed, export SVG — it's resolution-independent, so the printer renders razor edges at any size. If your workflow needs raster, export PNG at 300 DPI for the physical size you're printing: qrdock's export panel shows exactly how wide each pixel size prints (1024 px ≈ 8.7 cm at 300 DPI).",
        ],
      },
      {
        heading: "A practical cheat sheet",
        paragraphs: ["Scanning distance → minimum printed width:"],
        list: [
          "Business card / table tent (25–40 cm) → 2.5–4 cm",
          "Product packaging (50 cm) → 5 cm",
          "Poster in a hallway (1–2 m) → 10–20 cm",
          "Storefront window from the street (3 m) → 30 cm",
          "Banner or billboard (10 m+) → 1 m+ — and test it",
        ],
      },
      {
        heading: "Always the last step",
        paragraphs: [
          "Print one copy at final size and scan it with a mid-range phone in imperfect light. qrdock's live decoder catches design problems before export; the single test print catches everything else — glare, paper texture, lamination reflections.",
        ],
      },
    ],
    cta: { label: "Generate a print-ready QR code", href: "/" },
  },
  {
    slug: "static-vs-dynamic-qr-codes",
    title: "Static vs dynamic QR codes: which one should you print?",
    description:
      "Static codes live forever and can't be tracked; dynamic codes are editable and measurable but depend on a redirect service. How to choose in 30 seconds.",
    datePublished: "2026-07-10",
    readMinutes: 4,
    sections: [
      {
        paragraphs: [
          "A static QR code encodes your content directly — the URL, the Wi-Fi credentials, the UPI ID live inside the pattern. A dynamic QR code encodes a short redirect link instead; the destination lives in a database you can edit. Everything else about the choice follows from that one difference.",
        ],
      },
      {
        heading: "Choose static when permanence matters",
        paragraphs: [
          "Static codes have no dependencies: no redirect service, no company that can shut down, no subscription that can lapse. Wedding invitations, product manuals, equipment labels, UPI counters, Wi-Fi cards — anything long-lived that points at stable content should be static. Beware of generators that quietly make 'free' codes dynamic and then expire them; every static code from qrdock is yours forever.",
        ],
      },
      {
        heading: "Choose dynamic when you need to edit or measure",
        paragraphs: [
          "Printed a catalog and the landing page moved? With a dynamic code you change the destination in seconds and every printed copy keeps working. Running a campaign? Dynamic codes count scans by day, country and device — the only honest way to measure print media. The trade-off: scans route through the redirect service, so pick one you trust to stay up.",
        ],
      },
      {
        heading: "The hybrid habit",
        paragraphs: [
          "Teams that print a lot converge on a simple habit: static for permanent infrastructure, dynamic for anything with a marketing lifespan. On qrdock, static codes are unlimited and free forever; a free account adds five dynamic codes with scan analytics when you need the measurable kind.",
        ],
      },
    ],
    cta: { label: "Start with a free static code", href: "/" },
  },
  {
    slug: "wifi-qr-code-guide",
    title: "Wi-Fi QR codes: give guests your network without the password dance",
    description:
      "How Wi-Fi QR codes work on iPhone and Android, the WIFI: format underneath, and the three mistakes that stop them from connecting.",
    datePublished: "2026-07-10",
    readMinutes: 4,
    sections: [
      {
        paragraphs: [
          "\"What's the Wi-Fi password?\" is the most-asked question in every café, clinic and guest room. A Wi-Fi QR code retires it: guests point their camera, tap join, and they're connected — the password travels inside the code, spelled right every time.",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "The code contains a small standard string — WIFI:T:WPA;S:YourNetwork;P:YourPassword;; — that both iOS (11+) and Android (10+ natively) recognize straight from the camera app. No app install, no settings menu. Older Androids read the same code through Google Lens.",
        ],
      },
      {
        heading: "The three classic mistakes",
        paragraphs: [],
        list: [
          "Special characters unescaped — semicolons, colons or backslashes in the SSID/password break hand-built strings. qrdock escapes them correctly for you.",
          "Wrong security type — modern routers are WPA2/WPA3: pick WPA. Choose 'open network' only if there's genuinely no password.",
          "Renaming the network after printing — the code stores the SSID; change the router name and the printed code dies. Print after the network is final.",
        ],
      },
      {
        heading: "Privacy note worth caring about",
        paragraphs: [
          "Most online generators send your SSID and password to their servers to 'make' the code. qrdock generates it entirely in your browser — your credentials never leave your device. For an office network, that difference is not cosmetic.",
        ],
      },
    ],
    cta: { label: "Make your Wi-Fi QR code", href: "/qr-code-generator/wifi" },
  },
];

export function postBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
