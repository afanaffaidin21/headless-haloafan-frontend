import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Experiment } from "@/types";

export function ExperimentRow({
  experiment,
  className,
}: {
  experiment: Experiment;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex items-center gap-7 border-t border-line py-6 transition-colors",
        className
      )}
    >
      <span className="w-14 shrink-0 font-mono text-[22px] text-muted">
        {experiment.index}
      </span>

      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="font-display text-[22px] md:text-[26px] text-ink transition-colors group-hover:text-accent">
          {experiment.title}
        </h3>
        <p className="max-w-[560px] text-[15px] leading-relaxed text-muted">
          {experiment.description}
        </p>
      </div>

      <div className="hidden items-center gap-2.5 md:flex">
        {experiment.tags.map((tag) => (
          <span
            key={tag}
            className="border border-line bg-paper px-2 py-1 font-mono text-xs text-accent"
          >
            {tag}
          </span>
        ))}
      </div>

      <ArrowUpRight className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </article>
  );
}