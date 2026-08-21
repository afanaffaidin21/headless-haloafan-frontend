import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FinalCTA } from "@/components/ui/final-cta";
import { Marquee } from "@/components/ui/marquee";
import { ExperimentCard } from "@/components/cards/experiment-card";
import { getExperiments } from "@/lib/api";

export default async function ExperimentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("experiments");
  const experiments = await getExperiments();

  return (
    <>
      <Header active="experiments" />
      <main className="flex-1">
        <PageHeader eyebrow="01" title={t("heading")} sub={t("sub")} />

        {/* Marquee strip (accent-dim fill) */}
        <div className="border-b border-line bg-accent-dim">
          <Marquee items={t.raw("marquee") as string[]} className="border-0" />
        </div>

        {/* Grid 3x2 */}
        <div className="grid gap-6 px-6 pb-16 md:px-12 md:pb-24 pt-[72px] md:grid-cols-2 xl:grid-cols-3">
          {experiments.map((experiment) => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>

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