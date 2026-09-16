import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FinalCTA } from "@/components/ui/final-cta";
import { ArticleCard } from "@/components/cards/article-card";
import { Link } from "@/i18n/navigation";
import { getPostsResult } from "@/lib/api";
import { SafeImage } from "@/components/ui/safe-image";
import { createPageMetadata } from "@/lib/seo";
import { CmsCollectionState } from "@/components/ui/cms-collection-state";

// Keep an outage-shaped page response short-lived while the shared CMS data
// cache retains successful snapshots for its configured short TTL.
export const revalidate = 30;

const CHIPS = ["All", "Learn Journey", "Tutorials", "Tips & Fixes"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return createPageMetadata({
    locale,
    path: "/blog",
    title: t("heading"),
    description: t("sub"),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const { items: posts, status } = await getPostsResult();
  const [featured, ...rest] = posts;

  return (
    <>
      <Header active="blog" />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <PageHeader eyebrow="01" title={t("heading")} sub={t("sub")} />

        {/* Chips */}
        <div className="flex flex-wrap gap-2.5 px-6 pb-10 md:px-12 md:pb-12">
          {CHIPS.map((chip, i) => (
            <span
              key={chip}
              className={`border px-4 py-2 font-mono text-xs ${
                i === 0
                  ? "border-accent bg-accent text-[#0a0a0c]"
                  : "border-line bg-panel text-ink"
              }`}
            >
              {chip}
            </span>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="px-6 pb-16 md:px-12 md:pb-24">
            <CmsCollectionState
              heading={
                status === "unavailable"
                  ? t("unavailableHeading")
                  : t("emptyHeading")
              }
              description={
                status === "unavailable" ? t("unavailableSub") : t("emptySub")
              }
              retryLabel={status === "unavailable" ? t("retry") : undefined}
              retryingLabel={status === "unavailable" ? t("retrying") : undefined}
            />
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
          <div className="px-6 pb-10 md:px-12 md:pb-14">
            <article className="flex flex-col overflow-hidden border border-line bg-panel shadow-hard-sm lg:flex-row">
              {featured.featuredImage && (
                <div className="relative h-[220px] md:h-[300px] lg:h-auto lg:w-[560px] lg:shrink-0">
                  <SafeImage
                    src={featured.featuredImage}
                    alt={featured.title}
                    sizes="(max-width: 1023px) calc(100vw - 3rem), 560px"
                    loading="eager"
                    className="h-full w-full object-cover md:h-[300px] lg:h-full"
                  />
                </div>
              )}
              <div className="flex flex-col justify-between gap-6 p-10">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] tracking-wider text-accent">
                      {t("featured").toUpperCase()}
                    </span>
                    <span className="font-mono text-[11px] text-muted">/</span>
                    <span className="font-mono text-[11px] text-muted">
                      {featured.date}
                    </span>
                  </div>
                  <h2 className="font-display text-[28px] leading-tight md:text-[38px] text-ink">
                    {featured.title}
                  </h2>
                  <p className="max-w-[560px] text-[16px] leading-relaxed text-muted">
                    {featured.excerpt}
                  </p>
                </div>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="flex w-fit items-center gap-2.5 text-[15px] font-medium text-accent"
                >
                  {t("readArticle")} <ArrowRight className="h-[18px] w-[18px]" />
                </Link>
              </div>
            </article>
          </div>
            )}

        {/* Grid */}
            <div className="grid gap-6 px-6 pb-16 md:px-12 md:pb-24 md:grid-cols-2 xl:grid-cols-3">
              {rest.slice(0, 3).map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>

            <FinalCTA heading={t("ctaHeading")} sub={t("ctaSub")}>
              <Button variant="primary" href="/contact">
                {t("ctaPrimary")}
              </Button>
              <Button href="/projects">{t("ctaSecondary")}</Button>
            </FinalCTA>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
