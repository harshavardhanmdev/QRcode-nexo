import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { postBySlug, posts } from "@/lib/blog/posts";
import { JsonLd, articleLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/ui/icons";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.datePublished,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd
        data={[
          articleLd({
            title: post.title,
            description: post.description,
            path: `/blog/${post.slug}`,
            datePublished: post.datePublished,
          }),
          breadcrumbLd([
            { name: "qrdock", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <p className="font-heading text-xs text-fg-faint">
        <Link href="/blog" className="text-accent-text hover:underline">
          Blog
        </Link>{" "}
        · {formatDate(post.datePublished)} · {post.readMinutes} min read
      </p>
      <h1 className="font-heading mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-fg-muted">
        {post.description}
      </p>

      <div className="mt-10 space-y-8">
        {post.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {section.heading}
              </h2>
            )}
            {section.paragraphs.map((p, j) => (
              <p key={j} className="mt-3 leading-relaxed text-fg-muted">
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-fg-muted">
                {section.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="card mt-12 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
        <p className="font-heading text-base font-semibold">
          Put it into practice — free, in your browser.
        </p>
        <Button href={post.cta.href}>
          {post.cta.label}
          <IconArrowRight size={16} />
        </Button>
      </div>

      {related.length > 0 && (
        <nav aria-label="More from the blog" className="mt-12">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-fg-faint">
            Keep reading
          </h2>
          <ul className="mt-4 space-y-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="text-accent-text underline-offset-4 hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
