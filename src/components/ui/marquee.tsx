import { cn } from "@/lib/utils";

export function Marquee({
  items,
  separator = "✦",
  className,
}: {
  items: string[];
  separator?: string;
  className?: string;
}) {
  // Ulang set item beberapa kali supaya selalu lebih lebar dari viewport
  // dan animasi -50% berulang mulus tanpa celah.
  const repeat = 3;

  const renderSet = (key: string) =>
    Array.from({ length: repeat }).flatMap((_, r) =>
      items.map((item) => (
        <span
          key={`${key}-${r}-${item}`}
          className="flex items-center gap-5 whitespace-nowrap md:gap-9"
        >
          <span className="font-mono text-[11px] tracking-[0.2em] text-muted md:text-[13px]">
            {item}
          </span>
          <span className="text-[11px] text-accent md:text-[13px]">
            {separator}
          </span>
        </span>
      ))
    );

  return (
    <div
      className={cn(
        "flex overflow-hidden border-y border-line",
        className
      )}
    >
      <div className="animate-marquee flex w-max whitespace-nowrap">
        <div className="flex shrink-0 items-center gap-5 pr-5 md:gap-9 md:pr-9">
          {renderSet("a")}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 items-center gap-5 pr-5 md:gap-9 md:pr-9"
        >
          {renderSet("b")}
        </div>
      </div>
    </div>
  );
}