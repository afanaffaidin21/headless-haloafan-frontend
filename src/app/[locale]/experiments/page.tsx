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
      <div className="grid gap-6 px-6 pb-16 pt-[72px] md:grid-cols-2 md:px-12 md:pb-24 xl:grid-cols-3">
        {experiments.map((experiment) => (
          <ExperimentCard key={experiment.id} experiment={experiment} />
        ))}
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
