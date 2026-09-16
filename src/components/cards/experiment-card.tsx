import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ImageIcon } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";
import type { Experiment } from "@/types";

export function ExperimentCard({
  experiment,
  variant,
  exploreLabel,
  categoryLabel,
  className,
}: {
  experiment: Experiment;
  variant: "development" | "design";
  exploreLabel: string;
  categoryLabel: string;
  className?: string;
}) {
  const development = variant === "development";
  return (
    <Link
      href={`/experiments/${experiment.slug}`}
      className={cn(
        "group flex min-w-0 flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus",
        development && "border border-line bg-panel shadow-hard-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none motion-reduce:transform-none motion-reduce:transition-none",
        className
      )}
    >
      {development && (
        <div className="flex min-w-0 items-center gap-4 border-b border-line bg-paper px-4 py-3">
          <div aria-hidden="true" className="flex shrink-0 gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
            <span className="h-2 w-2 rounded-full bg-[#eab308]" />
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
          </div>
          <span className="min-w-0 truncate font-mono text-[10px] text-muted">
            /experiments/{experiment.slug}
          </span>
          <ArrowUpRight aria-hidden="true" className="ml-auto h-3.5 w-3.5 shrink-0 text-muted" />
        </div>
      )}
      <div className={cn("relative overflow-hidden border-b border-line bg-paper", development ? "aspect-video" : "aspect-[4/3] border border-line")}>
        {experiment.featuredImage ? (
          <SafeImage
            src={experiment.featuredImage}
            alt={experiment.featuredImageAlt || experiment.title}
            quality={85}
            sizes={development
              ? "(max-width: 767px) calc(100vw - 3rem), calc((100vw - 7.5rem) / 2)"
              : "(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) calc((100vw - 7.5rem) / 2), calc((100vw - 9rem) / 3)"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div aria-hidden="true" className="flex h-full items-center justify-center text-muted">
            <ImageIcon className="h-10 w-10" strokeWidth={1} />
          </div>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col", development ? "gap-3 p-5 md:p-6" : "gap-2 pt-4")}>
        {!development && <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{categoryLabel}</span>}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl leading-snug text-ink transition-colors group-hover:text-accent-text">
            {experiment.title}
          </h3>
          {!development && <ArrowUpRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-accent-text group-focus-visible:text-accent-text" />}
        </div>
        {development && (
          <>
            <p className="text-[15px] leading-relaxed text-muted">{experiment.description}</p>
            {experiment.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {experiment.tags.map((tag) => (
                  <span key={tag} className="border border-line bg-paper px-2 py-1 font-mono text-[11px] text-accent">{tag}</span>
                ))}
              </div>
            )}
            <div className="mt-auto pt-4">
              <span className="flex min-h-11 items-center justify-between gap-3 border-t border-line pt-4 text-sm font-medium text-accent">
                {exploreLabel}<ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
