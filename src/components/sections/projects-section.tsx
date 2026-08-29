import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ProjectCard } from "@/components/cards/project-card";
import { getProjects } from "@/lib/api";

export async function ProjectsSection() {
  const t = await getTranslations("projects");
  const projects = await getProjects();
  const featured = projects.slice(0, 3);

  return (
    <section className="px-6 py-16 md:px-12 md:py-24">
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="eyebrow-marker" aria-hidden />
            <span className="font-mono text-[13px] tracking-widest text-muted">
              (01) — PORTFOLIO
            </span>
          </div>
          <h2 className="font-display text-[36px] md:text-[52px] leading-[1.05] text-ink">
            {t("homeHeading")}
          </h2>
          <p className="max-w-[560px] text-[16px] md:text-[17px] text-muted">
            {t("sub")}
          </p>
        </div>
        <Link
          href="/projects"
          className="hidden items-center gap-2.5 text-[15px] font-medium text-accent md:flex"
        >
          {t("viewAll")} <ArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
        </Link>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Link
        href="/projects"
        className="mt-10 flex items-center gap-2.5 text-[15px] font-medium text-accent md:hidden"
      >
        {t("viewAll")} <ArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
      </Link>
    </section>
  );
}
