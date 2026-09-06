import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BrowserFrame } from "@/components/ui/browser-frame";
import type { Project } from "@/types";

export async function CaseStudyRow({ project }: { project: Project }) {
  const t = await getTranslations("projects");

  return (
    <article className="flex flex-col overflow-hidden border border-line bg-panel shadow-hard-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none lg:flex-row">
      <Link
        href={`/projects/${project.slug}`}
        className="block min-w-0 shrink-0 lg:w-1/2 xl:w-[540px]"
        aria-label={`${project.title} — ${t("viewCase")}`}
      >
        <BrowserFrame
          url={`haloafan.com/${project.slug}`}
          tag={project.category.replace("-", " ").toUpperCase()}
          client={project.client.toUpperCase()}
          title={project.title}
          height={300}
          image={project.featuredImage}
          className="h-full"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 p-6 sm:p-9 lg:p-7 xl:pl-10">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs tracking-wider text-accent">
            {project.client.toUpperCase()} — {project.year}
          </span>
          <h2 className="font-display text-[26px] leading-tight md:text-[34px] text-ink">
            {project.title}
          </h2>
          <p className="max-w-[560px] text-[15px] leading-relaxed text-muted">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col gap-7">
          <div className="flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="border border-line bg-paper px-2.5 py-1 font-mono text-[11px] text-ink"
              >
                {tech}
              </span>
            ))}
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="flex w-fit items-center gap-2.5 border border-accent px-5 py-3 text-[14px] font-medium text-accent transition-colors hover:bg-accent hover:text-[#0a0a0c]"
          >
            {t("viewCase")}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
