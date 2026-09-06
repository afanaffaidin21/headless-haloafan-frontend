import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FinalCTA } from "@/components/ui/final-cta";
import { Marquee } from "@/components/ui/marquee";
import { ExperimentCard } from "@/components/cards/experiment-card";
import { getExperimentsResult } from "@/lib/api";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experiments" });
  return createPageMetadata({
    locale,
    path: "/experiments",
    title: t("heading"),
    description: t("sub"),
  });
}

async function ExperimentsContent() {
  const t = await getTranslations("experiments");
  const { experiments, status } = await getExperimentsResult();

  if (status === "available") {
    return (
      <div className="px-6 pb-16 pt-12 md:px-12 md:pb-24 md:pt-[72px]">
        {(["development", "design"] as const).map((category) => {
          const items = experiments.filter((experiment) =>
            experiment.categories?.some((term) => term.slug === category)
          );
          return (
            <section key={category} aria-labelledby={`${category}-heading`} className="first:pb-12 last:border-t last:border-line last:pt-12 md:first:pb-20 md:last:pt-16">
              <div className="mb-8 flex items-baseline justify-between gap-4">
                <h2 id={`${category}-heading`} className="font-display text-[36px] leading-[1.08] text-ink md:text-[48px]">
                  {t(`categories.${category}`)}
                </h2>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {t("workCount", { count: items.length })}
                </span>
              </div>
              {items.length ? (
                <div className={category === "development" ? "grid gap-6 md:grid-cols-2" : "grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3"}>
                  {items.map((experiment) => (
                    <ExperimentCard key={experiment.id} experiment={experiment} variant={category} exploreLabel={t("explore")} categoryLabel={t(`categories.${category}`)} />
                  ))}
                </div>
              ) : (
                <p className="border-t border-line py-8 text-muted">{t("categoryEmpty")}</p>
              )}
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <section
      className="mx-6 my-[72px] border border-line bg-panel px-6 py-10 md:mx-12 md:px-10 md:py-12"
      aria-live="polite"
    >
      <h2 className="font-display text-[28px] leading-tight text-ink md:text-[36px]">
        {t(status === "unavailable" ? "unavailableHeading" : "emptyHeading")}
      </h2>
      <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-muted">
        {t(status === "unavailable" ? "unavailableSub" : "emptySub")}
      </p>
    </section>
  );
}

function ExperimentsLoading({ label }: { label: string }) {
  return (
    <div
      className="mx-6 my-[72px] border border-line bg-panel px-6 py-10 md:mx-12 md:px-10 md:py-12"
      role="status"
      aria-busy="true"
    >
      <p className="font-mono text-[13px] tracking-widest text-accent">
        {label.toUpperCase()}
      </p>
      <div className="mt-5 h-10 max-w-[520px] animate-pulse bg-paper motion-reduce:animate-none" />
      <div className="mt-4 h-5 max-w-[640px] animate-pulse bg-paper motion-reduce:animate-none" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default async function ExperimentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("experiments");

  return (
    <>
      <Header active="experiments" />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <PageHeader eyebrow="01" title={t("heading")} sub={t("sub")} />

        {/* Marquee strip (accent-dim fill) */}
        <div className="border-b border-line bg-accent-dim">
          <Marquee items={t.raw("marquee") as string[]} className="border-0" />
        </div>

        <Suspense fallback={<ExperimentsLoading label={t("loading")} />}>
          <ExperimentsContent />
        </Suspense>

        <FinalCTA heading={t("ctaHeading")} sub={t("ctaSub")}>
          <Button variant="primary" href="/projects">
            {t("ctaPrimary")}
          </Button>
          <Button href="/">{t("ctaSecondary")}</Button>
        </FinalCTA>
      </main>
      <Footer />
    </>
  );
}
