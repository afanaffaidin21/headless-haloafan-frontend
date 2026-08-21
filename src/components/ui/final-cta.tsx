import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FinalCTA({
  heading,
  sub,
  children,
  className,
}: {
  heading: string;
  sub?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col items-center gap-7 border-t border-line px-6 py-16 md:px-12 md:py-24",
        className
      )}
    >
      <h2 className="max-w-[900px] text-center font-display text-[34px] leading-[1.1] md:text-[56px] md:leading-[1.08] text-ink">
        {heading}
      </h2>
      {sub && (
        <p className="max-w-[640px] text-center text-[16px] md:text-[17px] text-muted">
          {sub}
        </p>
      )}
      {children && (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {children}
        </div>
      )}
    </section>
  );
}