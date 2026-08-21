import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { CaseStudyRow } from "@/components/cards/case-study-row";
import { getProjects } from "@/lib/api";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const projects = await getProjects();

  return (
    <>
      <Header active="projects" />
      <main className="flex-1">
        <PageHeader eyebrow="01" title={t("heading")} sub={t("sub")} />
        <div className="flex flex-col gap-7 px-12 pb-24">
          {projects.map((project) => (
            <CaseStudyRow key={project.id} project={project} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}