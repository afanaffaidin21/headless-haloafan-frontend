import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

export async function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const t = await getTranslations("projects");

  return (
    <article
      className={cn(
        "group relative isolate flex min-w-0 flex-col border border-line bg-panel shadow-hard-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none motion-reduce:transform-none motion-reduce:transition-none",
        className
      )}
    >
      <BrowserFrame
        url={`haloafan.com/${project.slug}`}
        tag={project.category.replace("-", " ").toUpperCase()}
        client={project.client.toUpperCase()}
        title={project.title}
        height={250}
        image={project.featuredImage}
        sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) calc(50vw - 4.5rem), 380px"
        overlayOnImage={false}
        live={false}
        objectPosition="bottom"
      />

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">{project.year}</span>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="relative z-30 flex min-h-11 items-center gap-1.5 font-mono text-xs uppercase text-accent hover:underline underline-offset-4"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              {t("live")}
            </a>
          )}
        </div>
        <h3 className="font-display text-2xl leading-snug text-ink transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted">
          {project.description}
        </p>
        <div className="mt-auto pt-4">
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`${t("viewCase")} — ${project.title}`}
            className="flex min-h-11 items-center justify-between gap-3 border-t border-line pt-4 text-[14px] font-medium text-accent after:absolute after:inset-0 after:z-20 after:content-[''] hover:underline underline-offset-4 focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus"
          >
            {t("viewCase")}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
