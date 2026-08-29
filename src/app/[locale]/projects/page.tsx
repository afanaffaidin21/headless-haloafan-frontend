import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { CaseStudyRow } from "@/components/cards/case-study-row";
import { CmsCollectionState } from "@/components/ui/cms-collection-state";
import { getProjectsResult } from "@/lib/api";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return createPageMetadata({
    locale,
    path: "/projects",
    title: t("heading"),
    description: t("sub"),
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const { items: projects, status } = await getProjectsResult();

  return (
    <>
      <Header active="projects" />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <PageHeader eyebrow="01" title={t("heading")} sub={t("sub")} />
        <div className="flex flex-col gap-7 px-6 pb-24 md:px-12">
          {projects.length > 0 ? (
            projects.map((project) => (
              <CaseStudyRow key={project.id} project={project} />
            ))
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
      </main>
      <Footer />
    </>
  );
}
