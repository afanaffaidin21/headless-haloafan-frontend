import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/cards/article-card";
import { getPost, getPosts } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/seed";
import { routing } from "@/i18n/routing";

const PORTRAIT =
  "https://haloafan.com/wp-content/uploads/2026/05/photo-portfolio-with-caption-820x1024.png";

const CODE_THEME_JSON = `{
  "version": 2,
  "settings": {
    "color": { "palette": [...] },
    "typography": { "fontFamilies": [...] }
  }
}`;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    [
      "building-layouts-without-elementor",
      "understanding-block-theme-structure-theme-json",
      "understanding-gutenberg-editor-more-deeply",
      "understanding-the-philosophy-behind-gutenberg-modern-wordpress",
    ].map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post ? post.title : "Blog",
    description: post?.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const all = await getPosts();
  const related = all.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <Header active="blog" />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              articleSection: post.category,
              image: post.featuredImage || undefined,
              url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://haloafan.com"}/blog/${post.slug}`,
              author: {
                "@type": "Person",
                name: "Ahmad Afan Affaidin",
              },
              publisher: {
                "@type": "Person",
                name: "Ahmad Afan Affaidin",
              },
            }),
          }}
        />
        {/* Article Header */}
        <div className="flex flex-col gap-5 px-6 pb-10 pt-16 md:px-12 md:pb-16 md:pt-[88px]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-wider text-accent">
              {post.category.toUpperCase()}
            </span>
            <span className="font-mono text-xs text-muted">/</span>
            <span className="font-mono text-xs text-muted">
              {post.date.toUpperCase()}
            </span>
            <span className="font-mono text-xs text-muted">
              · {post.readingMinutes} MIN READ
            </span>
          </div>
          <h1 className="max-w-[1100px] font-display text-[36px] leading-[1.08] md:text-[64px] md:leading-[1.06] text-ink">
            {post.title}
          </h1>
          <p className="max-w-[760px] text-[19px] leading-relaxed text-muted">
            {post.excerpt}
          </p>
        </div>

        {/* Hero Image */}
        <div className="px-6 pb-10 md:px-12 md:pb-[72px]">
          {post.featuredImage && (
            <div className="overflow-hidden border border-line shadow-hard">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredImage}
                alt={post.title}
                className="h-[420px] w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Article Body */}
        <div className="flex justify-center px-6 pb-10 md:px-12 md:pb-[72px]">
          <div className="flex w-full max-w-[760px] flex-col gap-6">
            <p className="text-[18px] leading-[1.8] text-ink">{post.content}</p>

            <div className="flex flex-col gap-3.5">
              <h2 className="font-display text-[30px] text-ink">
                Why I started exploring
              </h2>
              <p className="text-[17px] leading-[1.8] text-muted">
                Gutenberg is no longer just a content editor. With block themes
                and full site editing, the entire site — header, footer,
                templates — is composed from the same building blocks you use
                to write a post. That changes everything about how you approach
                layout.
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              <h2 className="font-display text-[30px] text-ink">
                The block-based mindset
              </h2>
              <p className="text-[17px] leading-[1.8] text-muted">
                Instead of thinking in pages, you start thinking in patterns. A
                hero section, a callout, a pricing grid — each one is a
                reusable block you can register, style, and drop anywhere.
                Combined with theme.json, design tokens live in one place
                instead of being scattered across a builder&apos;s hidden style
                controls.
              </p>
            </div>

            {/* Code block */}
            <div className="overflow-hidden border border-line bg-panel">
              <div className="flex items-center gap-2 border-b border-line bg-paper px-3.5 py-2.5">
                <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                <span className="h-2 w-2 rounded-full bg-[#eab308]" />
                <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                <span className="ml-2 font-mono text-xs text-muted">
                  theme.json
                </span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[14px] leading-[1.7] text-accent">
                {CODE_THEME_JSON}
              </pre>
            </div>

            <div className="flex flex-col gap-3.5">
              <h2 className="font-display text-[30px] text-ink">
                What changed for me
              </h2>
              <div className="flex flex-col">
                {[
                  "Faster sites — no builder CSS bloat, no forty enqueued scripts",
                  "Design tokens in one file instead of buried in a drag-and-drop UI",
                  "Content that's portable — a block can move anywhere",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 border-t border-line py-3"
                  >
                    <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-accent" />
                    <span className="text-[17px] text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[18px] leading-[1.8] text-muted">
              It&apos;s not about abandoning tools — it&apos;s about
              understanding the architecture underneath them. The deeper I go,
              the more I believe Gutenberg has huge potential for the future of
              modern WordPress workflows.
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2.5 px-6 pb-10 md:px-12 md:pb-[72px]">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="border border-line bg-panel px-3 py-1.5 font-mono text-xs text-accent"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <div className="px-6 pb-10 md:px-12 md:pb-[72px]">
          <div className="flex items-center gap-5 border border-line bg-panel p-6">
            <div className="h-16 w-16 shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PORTRAIT}
                alt={SITE_CONFIG.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <span className="font-mono text-[11px] tracking-wider text-muted">
                WRITTEN BY
              </span>
              <span className="font-display text-[22px] text-ink">
                {SITE_CONFIG.name}
              </span>
              <span className="text-[14px] text-muted">
                WordPress Developer & AI-Driven — documenting my journey through
                code.
              </span>
            </div>
            <Button href="/about">View Profile</Button>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="flex flex-col gap-7 px-6 pb-10 md:px-12 md:pb-[72px]">
            <SectionHeader eyebrow="02" title="Keep Reading" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((p) => (
                <ArticleCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}