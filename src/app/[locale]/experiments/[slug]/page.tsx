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

function getHttpUrl(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

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

  const livePreviewUrl = getHttpUrl(experiment.liveUrl);
  const livePreviewLabel = livePreviewUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <>
      <Header active="experiments" />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <PageHeader
          eyebrow={experiment.categories?.map((category) => category.name).join(" / ") || t("eyebrow")}
          title={experiment.title}
          sub={experiment.description}
        />

        {livePreviewUrl && (
          <section className="px-6 pb-16 md:px-12 md:pb-24" aria-labelledby="live-preview-heading">
            <div className="flex flex-col gap-6 border-t border-line pt-7">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="eyebrow-marker" aria-hidden="true" />
                  <span className="font-mono text-[11px] tracking-widest text-muted md:text-[13px]">
                    {t("livePreview").toUpperCase()}
                  </span>
                </div>
                <h2 id="live-preview-heading" className="font-display text-[32px] leading-[1.08] text-ink md:text-[48px] md:leading-[1.05]">
                  {t("livePreview")}
                </h2>
              </div>

              <div className="overflow-hidden border border-line bg-panel shadow-hard-sm">
                <div className="flex min-w-0 items-center gap-3 border-b border-line bg-paper px-3 py-2.5">
                  <div aria-hidden="true" className="flex shrink-0 gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                    <span className="h-2 w-2 rounded-full bg-[#eab308]" />
                    <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                  </div>
                  <span className="min-w-0 flex-1 truncate border border-line bg-panel px-2.5 py-1 font-mono text-[10px] text-muted" title={livePreviewUrl}>
                    {livePreviewLabel}
                  </span>
                  <a
                    href={livePreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 border border-line px-2.5 py-1 font-mono text-[10px] text-accent transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {t("openLive")}
                  </a>
                </div>
                <div className="relative aspect-video bg-[#0a0a0c]">
                  <iframe
                    src={livePreviewUrl}
                    title={`${experiment.title} — ${t("livePreview")}`}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="fullscreen"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
                <p className="border-t border-line px-4 py-3 text-[13px] leading-relaxed text-muted">
                  {t("previewNote")} {" "}
                  <a href={livePreviewUrl} target="_blank" rel="noreferrer" className="text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent">
                    {t("openLive")}
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>
        )}

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
            {livePreviewUrl && (
              <Button variant="primary" href={livePreviewUrl} external>
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
