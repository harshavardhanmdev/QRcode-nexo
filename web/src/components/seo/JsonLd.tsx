import { site } from "@/lib/site";

/**
 * Typed JSON-LD builders. Each page composes what it needs and renders
 * <JsonLd data={[...]}/> once. Kept as plain objects (no library) so the
 * output is auditable in view-source.
 */

type JsonLdObject = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON in a script tag
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(items.length === 1 ? items[0] : items),
      }}
    />
  );
}

export function organizationLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.company,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    email: site.contactEmail,
    brand: { "@type": "Brand", name: site.name },
  };
}

export function webSiteLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
  };
}

export function softwareAppLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${site.name} — QR Code & Barcode Generator`,
    url: site.url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    featureList: [
      "QR codes with letters formed by the pattern",
      "Logo, gradient, frame and shape customization",
      "Live scannability verification",
      "SVG, PNG, JPEG, WebP export up to 4096 px",
      "Barcode generation (Code 128, EAN, UPC, ITF-14)",
      "Dynamic QR codes with scan analytics",
    ],
    publisher: { "@type": "Organization", name: site.company },
  };
}

export function faqLd(faqs: { q: string; a: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function howToLd(name: string, steps: string[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
    totalTime: "PT1M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: 0 },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function articleLd(a: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    url: `${site.url}${a.path}`,
    datePublished: a.datePublished,
    author: { "@type": "Organization", name: site.company },
    publisher: { "@type": "Organization", name: site.company },
  };
}
