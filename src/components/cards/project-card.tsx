import { BrowserFrame } from "@/components/ui/browser-frame";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col border border-line bg-panel shadow-hard-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
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
        overlayOnImage={false}
        live={false}
        objectPosition="bottom"
      />

      <div className="flex flex-col gap-2.5 p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">{project.year}</span>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-accent"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              LIVE SITE
            </a>
          )}
        </div>
        <h3 className="font-display text-2xl leading-snug text-ink transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted">
          {project.description}
        </p>
      </div>
    </article>
  );
}