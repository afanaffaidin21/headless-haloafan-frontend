import { cn } from "@/lib/utils";

export function AvailabilityBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 border border-line bg-accent-dim px-3.5 py-2",
        className
      )}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
      <span className="font-mono text-xs text-ink">{label}</span>
    </span>
  );
}