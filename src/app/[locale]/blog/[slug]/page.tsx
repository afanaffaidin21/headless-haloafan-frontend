import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/cards/article-card";
import { getPostResult, getPosts } from "@/lib/api";
import { CmsCollectionState } from "@/components/ui/cms-collection-state";
import { SITE_CONFIG } from "@/lib/seed";
import { SafeImage } from "@/components/ui/safe-image";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, isIndexableContent, noIndexMetadata } from "@/lib/seo";
import { encodeSlug, getCanonicalUrl, localizedPath, SITE_URL } from "@/lib/site-url";

const PORTRAIT =
  "https://cms.haloafan.com/wp-content/uploads/2026/05/photo-portfolio-with-caption-820x1024.png";

export async function generateStaticParams() {
  const posts = await getPosts();
  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const { post, status } = await getPostResult(slug);
  if (
    status === "unavailable" ||
    !post ||
    !isIndexableContent(post, ["slug", "title", "excerpt", "date", "content"])
  ) {
    return noIndexMetadata("Blog");
  }

  return createPageMetadata({
    locale,
    path: `/blog/${encodeSlug(post.slug)}`,
    title: post.title,
    description: post.excerpt,
    type: "article",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const result = await getPostResult(slug);
  const post = result.post;

  if (result.status === "unavailable") {
    return (
      <>
        <Header active="blog" />
        <main id="main-content" tabIndex={-1} className="flex-1 px-6 py-16 md:px-12 md:py-24">
          <CmsCollectionState
            heading={t("unavailableHeading")}
            description={t("unavailableSub")}
          />
        </main>
        <Footer />
      </>
    );
  }

  if (!post || !isIndexableContent(post, ["slug", "title", "excerpt", "date", "content"])) {
    notFound();
  }

  const all = await getPosts();
  const related = all.filter((p) => p.id !== post.id).slice(0, 3);
  const canonical = getCanonicalUrl(
    localizedPath(`/blog/${encodeSlug(post.slug)}`, locale)
  );

  return (
    <>
      <Header active="blog" />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${canonical}#article`,
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.modified || undefined,
            articleSection: post.category || undefined,
            url: canonical,
            // The CMS currently provides one English editorial body for both
            // locale routes, so structured data remains truthful.
            inLanguage: "en-US",
            author: { "@id": `${SITE_URL}/#person` },
            publisher: { "@id": `${SITE_URL}/#person` },
          }}
        />
        <div className="flex flex-col gap-5 px-6 pb-10 pt-16 md:px-12 md:pb-16 md:pt-[88px]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-wider text-accent">
              {post.category.toUpperCase()}
            </span>
            <span className="font-mono text-xs text-muted">/</span>
            <span className="font-mono text-xs text-muted">{post.date.toUpperCase()}</span>
            <span className="font-mono text-xs text-muted">· {post.readingMinutes} MIN READ</span>
          </div>
          <h1 className="max-w-[1100px] font-display text-[36px] leading-[1.08] text-ink md:text-[64px] md:leading-[1.06]">
            {post.title}
          </h1>
          <p className="max-w-[760px] text-[19px] leading-relaxed text-muted">{post.excerpt}</p>
        </div>

        <div className="px-6 pb-10 md:px-12 md:pb-[72px]">
          {post.featuredImage && (
            <div className="relative h-[420px] overflow-hidden border border-line shadow-hard">
              <SafeImage
                src={post.featuredImage}
                alt={post.title}
                sizes="(max-width: 767px) calc(100vw - 3rem), calc(100vw - 6rem)"
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-center px-6 pb-10 md:px-12 md:pb-[72px]">
          <article
            className="article-content w-full max-w-[760px]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="flex flex-wrap gap-2.5 px-6 pb-10 md:px-12 md:pb-[72px]">
          {post.tags.map((tag) => (
            <span key={tag} className="border border-line bg-panel px-3 py-1.5 font-mono text-xs text-accent">
              #{tag}
            </span>
          ))}
        </div>

        <div className="px-6 pb-10 md:px-12 md:pb-[72px]">
          <div className="flex items-center gap-5 border border-line bg-panel p-6">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden">
              <SafeImage src={PORTRAIT} alt={SITE_CONFIG.name} sizes="64px" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <span className="font-mono text-[11px] tracking-wider text-muted">WRITTEN BY</span>
              <span className="font-display text-[22px] text-ink">{SITE_CONFIG.name}</span>
              <span className="text-[14px] text-muted">
                WordPress Developer &amp; Web Engineer — documenting my journey through code.
              </span>
            </div>
            <Button href="/about">View Profile</Button>
          </div>
        </div>

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
