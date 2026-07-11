import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { barcodeLandings, qrLandings } from "@/lib/seo/landing-content";
import { posts } from "@/lib/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/qr-code-with-letters", 0.9, "weekly"),
    page("/barcode-generator", 0.9),
    ...qrLandings.map((l) => page(`/qr-code-generator/${l.type}`, 0.8)),
    ...barcodeLandings.map((l) => page(`/barcode-generator/${l.format}`, 0.7)),
    page("/scan", 0.6),
    page("/tools/bulk-qr-generator", 0.6),
    page("/blog", 0.6, "weekly"),
    ...posts.map((p) => page(`/blog/${p.slug}`, 0.5)),
    page("/faq", 0.5),
    page("/about", 0.3, "yearly"),
    page("/contact", 0.3, "yearly"),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
  ];
}
