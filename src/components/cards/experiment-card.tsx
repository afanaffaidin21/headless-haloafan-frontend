import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Experiment } from "@/types";

export function ExperimentCard({
  experiment,
  className,
}: {
  experiment: Experiment;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col border border-line bg-panel shadow-hard-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        className
      )}
    >
      {/* Canvas */}
      <div
        className="relative flex h-[190px] flex-col justify-between overflow-hidden bg-gradient-to-b from-[#14301f] to-[#0a0a0c] p-[18px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "33.33% 33.33%",
        }}
      >
        <div className="relative z-10 flex items-center justify-between">
          <span className="border border-white/20 bg-white/5 px-2.5 py-1 font-mono text-[9px] tracking-wider text-[#d9d9d9]">
            EXPERIMENT {experiment.index}
          </span>
          <ArrowUpRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <span className="relative z-10 font-display text-[56px] leading-none text-white">
          {experiment.index}
        </span>
        <div className="relative z-10 flex items-center justify-between font-mono text-[9px]">
          <span className="text-accent">● Built for the joy of building</span>
          <span className="text-[#b9b9b9]">Open →</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-5">
        <h3 className="font-display text-2xl text-ink transition-colors group-hover:text-accent">
          {experiment.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-muted">
          {experiment.description}
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {experiment.tags.map((tag) => (
            <span
              key={tag}
              className="border border-line bg-paper px-2 py-1 font-mono text-[11px] text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}