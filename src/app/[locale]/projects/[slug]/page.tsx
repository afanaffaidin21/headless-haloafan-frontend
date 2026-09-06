import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { CmsCollectionState } from "@/components/ui/cms-collection-state";
import { FinalCTA } from "@/components/ui/final-cta";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { SectionHeader } from "@/components/ui/section-header";
import { Link } from "@/i18n/navigation";
import { getProjectResult, getProjects } from "@/lib/api";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, isIndexableContent, noIndexMetadata } from "@/lib/seo";
import { encodeSlug, getCanonicalUrl, localizedPath, SITE_URL } from "@/lib/site-url";

// A transient unavailable detail response must not be retained for the full
// content TTL. The collection snapshot itself remains shared and long-lived.
export const revalidate = 30;

export async function generateStaticParams() {
  const projects = await getProjects();
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const { project, status } = await getProjectResult(slug);
  if (
    status === "unavailable" ||
    !project ||
    !isIndexableContent(project, ["slug", "title", "description"])
  ) {
    return noIndexMetadata("Case Study");
  }

  return createPageMetadata({
    locale,
    path: `/projects/${encodeSlug(project.slug)}`,
    title: `${project.title} — Case Study`,
    description: project.description,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("caseStudy");
  const projectsT = await getTranslations("projects");
  const result = await getProjectResult(slug);
  const project = result.project;

  if (result.status === "unavailable") {
    return (
      <>
        <Header active="projects" />
        <main id="main-content" tabIndex={-1} className="flex-1 px-6 py-16 md:px-12 md:py-24">
          <CmsCollectionState
            heading={projectsT("unavailableHeading")}
            description={projectsT("unavailableSub")}
            retryLabel={projectsT("retry")}
            retryingLabel={projectsT("retrying")}
            secondaryHref={localizedPath("/projects", locale)}
            secondaryLabel={projectsT("viewAll")}
          />
        </main>
        <Footer />
      </>
    );
  }

  if (!project || !isIndexableContent(project, ["slug", "title", "description"])) {
    notFound();
  }

  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  const canonical = getCanonicalUrl(
    localizedPath(`/projects/${encodeSlug(project.slug)}`, locale)
  );

  return (
    <>
      <Header active="projects" />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "@id": `${canonical}#work`,
            name: project.title,
            description: project.description,
            genre: project.category || undefined,
            about: project.client || undefined,
            url: canonical,
            inLanguage: locale === "id" ? "id-ID" : "en-US",
            author: { "@id": `${SITE_URL}/#person` },
          }}
        />
        {/* Case Header */}
        <div className="flex flex-col gap-6 px-6 pb-10 pt-16 md:px-12 md:pb-16 md:pt-[88px]">
          <div className="flex items-center gap-3">
            <span className="eyebrow-marker" aria-hidden />
            <span className="font-mono text-[13px] tracking-widest text-muted">
              (01) — CASE STUDY / {project.year}
            </span>
          </div>
          <h1 className="max-w-[1100px] font-display text-[36px] leading-[1.08] md:text-[64px] md:leading-[1.05] text-ink">
            {project.client} — {project.title}
          </h1>
          <div className="grid grid-cols-2 gap-6 border-t border-line pt-5 md:flex">
            {[
              ["CLIENT", project.client],
              ["YEAR", project.year],
              ["TIMELINE", project.timeline],
              ["ROLE", project.role],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-1 flex-col gap-1.5">
                <span className="font-mono text-[11px] tracking-wider text-muted">
                  {k}
                </span>
                <span className="text-sm font-medium text-ink">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 border border-ink bg-accent px-7 py-3.5 text-[15px] font-medium text-[#0a0a0c] shadow-hard"
              >
                {t("visitLive")} <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <Button href="/projects">
              <ArrowLeft className="h-4 w-4" /> {t("backToProjects")}
            </Button>
          </div>
        </div>

        {/* Hero Mockup */}
        <div className="px-6 pb-16 md:px-12 md:pb-24">
          <BrowserFrame
            url={project.liveUrl?.replace("https://", "") ?? `haloafan.com/${project.slug}`}
            tag={project.category.replace("-", " ").toUpperCase()}
            client={project.client.toUpperCase()}
            title={project.title}
            height={520}
            image={project.featuredImage}
            loading="eager"
            sizes="(max-width: 767px) calc(100vw - 3rem), calc(100vw - 6rem)"
          />
        </div>

        {/* Overview */}
        <section className="px-6 pb-12 md:px-12 md:pb-16">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex min-w-0 flex-col gap-6">
              <SectionHeader eyebrow="02" title={t("overview")} />
              <p className="text-[17px] leading-[1.7] text-ink">
                {project.description}
              </p>
            </div>
            <aside className="min-w-0 border border-line bg-panel">
              <div className="border-b border-line px-5 py-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                  {t("atAGlance").toUpperCase()}
                </span>
              </div>
              <dl className="grid sm:grid-cols-2">
              {[
                [t("facts.deliverable"), project.category.replace("-", " ").toUpperCase()],
                [t("facts.timeline"), project.timeline],
                [t("facts.role"), project.role],
                [t("facts.tech"), project.stack.join(" · ")],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div
                  key={k}
                  className="flex min-w-0 flex-col gap-2 border-line px-5 py-4 border-t first:border-t-0 sm:[&:nth-child(2)]:border-t-0 sm:odd:border-r"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {k}
                  </dt>
                  <dd className="break-words text-sm font-medium leading-relaxed text-ink">
                    {v}
                  </dd>
                </div>
              ))}
              </dl>
            </aside>
          </div>
        </section>

        {/* Challenge */}
        {project.problem && (
          <section className="flex flex-col gap-6 px-6 pb-12 md:px-12 md:pb-16">
            <SectionHeader eyebrow="03" title={t("challenge")} />
            {project.slug === "universitas-sunan-gresik" ? (
              <div className="grid border-y border-line lg:grid-cols-3">
                {(["hierarchy", "navigation", "scalability"] as const).map((point) => (
                  <div key={point} className="flex min-w-0 flex-col gap-3 border-line py-6 max-lg:border-b max-lg:last:border-b-0 lg:px-7 lg:first:pl-0 lg:last:pr-0 lg:[&+div]:border-l">
                    <h3 className="font-display text-2xl leading-snug text-ink">
                      {t(`usgChallenges.${point}.title`)}
                    </h3>
                    <p className="text-[17px] leading-[1.7] text-muted">
                      {t(`usgChallenges.${point}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="max-w-[720px] whitespace-pre-line text-[17px] leading-[1.7] text-muted">
                {project.problem}
              </p>
            )}
          </section>
        )}

        {/* Process */}
        {project.process.length > 0 && (
          <section className="flex flex-col gap-7 px-6 pb-16 md:px-12 md:pb-24">
            <SectionHeader eyebrow="04" title={t("process")} />
            <div className="flex flex-col">
              {project.process.map((step) => (
                <div
                  key={step.number}
                  className="flex items-start gap-4 border-t border-line py-6 sm:gap-7"
                >
                  <span className="w-8 shrink-0 font-mono text-[28px] text-accent sm:w-16">
                    {step.number}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <h3 className="font-display text-2xl text-ink">{step.title}</h3>
                    {step.description && (
                      <p className="max-w-[720px] text-[15px] leading-relaxed text-muted">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stack */}
        {project.stack.length > 0 && (
          <section className="flex flex-col gap-7 px-6 pb-16 md:px-12 md:pb-24">
            <SectionHeader eyebrow="05" title={t("stack")} />
            <div className="flex flex-wrap gap-2.5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="border border-line bg-panel px-3.5 py-2 font-mono text-[13px] text-ink"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        {(project.stats.length > 0 || project.results.length > 0) && (
        <section className="flex flex-col gap-7 px-6 pb-16 md:px-12 md:pb-24">
          <SectionHeader eyebrow="06" title={t("results")} />
          <div className="grid gap-6 md:grid-cols-3">
            {project.stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-2.5 border border-line bg-panel p-7"
              >
                <span className="font-display text-[44px] text-accent">{s.number}</span>
                <span className="font-mono text-xs tracking-wider text-muted">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            {project.results.map((r) => (
              <div
                key={r}
                className="flex items-center gap-3.5 border-t border-line py-4"
              >
                <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-accent" />
                <span className="text-[16px] text-ink">{r}</span>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Gallery */}
        {project.screenshots.length > 0 && (
        <section className="flex flex-col gap-7 px-6 pb-16 md:px-12 md:pb-24">
          <SectionHeader eyebrow="07" title={t("gallery")} />
          <div className="grid gap-6 md:grid-cols-3">
            {project.screenshots.slice(0, 3).map((src, i) => (
              <BrowserFrame
                key={i}
                url={`haloafan.com/${project.slug}`}
                tag="SCREENSHOT"
                client={project.client.toUpperCase()}
                title={project.title}
                height={220}
                image={src}
                sizes="(max-width: 767px) calc(100vw - 3rem), calc((100vw - 9rem) / 3)"
              />
            ))}
          </div>
        </section>
        )}

        <FinalCTA heading={t("ctaHeading")} sub={t("ctaSub")}>
          <Button variant="primary" href="/contact">
            {t("ctaPrimary")}
          </Button>
          <Button href="/projects">{t("backToProjects")}</Button>
        </FinalCTA>

        {/* Next / Prev */}
        <nav aria-label={t("navigation")} className="flex flex-col gap-8 border-y border-line px-6 py-10 md:flex-row md:px-12 md:py-[72px]">
          <Link href={`/projects/${prev.slug}`} className="flex flex-1 flex-col gap-2">
            <span className="font-mono text-[11px] tracking-wider text-muted">
              ← {t("prevProject")}
            </span>
            <span className="font-display text-[26px] text-ink">{prev.title}</span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="flex flex-1 flex-col items-end gap-2"
          >
            <span className="font-mono text-[11px] tracking-wider text-accent">
              {t("nextProject")} →
            </span>
            <span className="font-display text-[26px] text-ink">{next.title}</span>
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
