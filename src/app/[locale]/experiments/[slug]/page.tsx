import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { getExperiment } from "@/lib/api";
import { createPageMetadata, isIndexableContent, noIndexMetadata } from "@/lib/seo";
import { encodeSlug } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const experiment = await getExperiment(slug);

  if (
    !experiment ||
    !isIndexableContent(experiment, ["slug", "title", "description"])
  ) {
    return noIndexMetadata("Experiments");
  }

  return createPageMetadata({
    locale,
    path: `/experiments/${encodeSlug(experiment.slug)}`,
    title: experiment.title,
    description: experiment.description,
  });
}

export default async function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, experiment] = await Promise.all([
    getTranslations("experiments"),
    getExperiment(slug),
  ]);

  if (
    !experiment ||
    !isIndexableContent(experiment, ["slug", "title", "description"])
  ) {
    notFound();
  }

  return (
    <>
      <Header active="experiments" />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <PageHeader
          eyebrow={experiment.categories?.map((category) => category.name).join(" / ") || t("eyebrow")}
          title={experiment.title}
          sub={experiment.description}
        />

        <section className="px-6 pb-16 md:px-12 md:pb-24">
          {experiment.tags.length > 0 && (
            <div className="border-t border-line pt-7">
              <h2 className="font-mono text-[12px] tracking-widest text-muted">
                {t("technologies").toUpperCase()}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {experiment.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-line bg-panel px-3.5 py-2 font-mono text-[13px] text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Button href="/experiments">
              <ArrowLeft className="h-4 w-4" /> {t("back")}
            </Button>
            {experiment.liveUrl && (
              <Button variant="primary" href={experiment.liveUrl} external>
                {t("visitLive")} <ArrowUpRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
