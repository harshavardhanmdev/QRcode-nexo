import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/blog/posts";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { IconArrowRight } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Blog — QR codes, barcodes and print that scans",
  description:
    "Practical guides from the qrdock team: UPI payment QR codes, print sizing, static vs dynamic codes, Wi-Fi QR setup and more.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
        blog
      </p>
      <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Print that scans
      </h1>
      <p className="mt-3 max-w-xl text-fg-muted">
        Short, practical guides on QR codes, barcodes and getting them from
        screen to paper without surprises.
      </p>

      <Stagger className="mt-10 space-y-4">
        {posts.map((post) => (
          <StaggerItem key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="card group block p-6 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 sm:p-7"
            >
              <p className="font-heading text-xs text-fg-faint">
                {formatDate(post.datePublished)} · {post.readMinutes} min read
              </p>
              <h2 className="font-heading mt-2 text-xl font-semibold leading-snug group-hover:text-accent-text">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {post.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-text">
                Read
                <IconArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
