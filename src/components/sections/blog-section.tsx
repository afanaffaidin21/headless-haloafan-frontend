import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ArticleCard } from "@/components/cards/article-card";
import { CmsCollectionState } from "@/components/ui/cms-collection-state";
import { getPostsResult } from "@/lib/api";

export async function BlogSection() {
  const t = await getTranslations("blog");
  const { items: posts, status } = await getPostsResult();
  const featured = posts.slice(0, 3);

  return (
    <section className="px-6 py-16 md:px-12 md:py-24">
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="eyebrow-marker" aria-hidden />
            <span className="font-mono text-[13px] tracking-widest text-muted">
              (03) — BLOG
            </span>
          </div>
          <h2 className="font-display text-[36px] md:text-[52px] leading-[1.05] text-ink">
            {t("heading")}
          </h2>
          <p className="max-w-[560px] text-[16px] md:text-[17px] text-muted">{t("sub")}</p>
        </div>
        <Link
          href="/blog"
          className="hidden items-center gap-2.5 text-[15px] font-medium text-accent md:flex"
        >
          {t("viewAll")} <ArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
        </Link>
      </div>

      <div className="mt-14">
        {featured.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <CmsCollectionState
            heading={
              status === "unavailable"
                ? t("unavailableHeading")
                : t("emptyHeading")
            }
            description={
              status === "unavailable" ? t("unavailableSub") : t("emptySub")
            }
          />
        )}
      </div>

      <Link
        href="/blog"
        className="mt-10 flex items-center gap-2.5 text-[15px] font-medium text-accent md:hidden"
      >
        {t("viewAll")} <ArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
      </Link>
    </section>
  );
}
