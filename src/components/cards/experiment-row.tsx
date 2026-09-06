import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Experiment } from "@/types";

export function ExperimentRow({
  experiment,
  position,
  className,
}: {
  experiment: Experiment;
  position: number;
  className?: string;
}) {
  return (
    <Link
      href={`/experiments/${experiment.slug}`}
      className={cn(
        "group flex items-center gap-7 border-t border-line py-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus",
        className
      )}
    >
      <span className="w-14 shrink-0 font-mono text-[22px] text-muted">
        {String(position).padStart(2, "0")}
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

      <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}
