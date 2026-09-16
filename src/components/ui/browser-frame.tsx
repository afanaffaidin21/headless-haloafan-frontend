import { ArrowUpRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/ui/safe-image";

const GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
  backgroundSize: "20% 33.33%",
};

interface BrowserFrameProps {
  url: string;
  tag: string;
  client: string;
  title: string;
  sub?: string;
  live?: boolean;
  height?: number;
  gradient?: [string, string];
  className?: string;
  image?: string | null;
  loading?: "lazy" | "eager";
  sizes?: string;
  quality?: number;
  /** Saat false + image: gambar tampil bersih, teks overlay (client/title/status) disembunyikan. */
  overlayOnImage?: boolean;
  /** Posisi object-fit gambar. Default "top". */
  objectPosition?: "top" | "center" | "bottom";
}

export function BrowserFrame({
  url,
  tag,
  client,
  title,
  sub,
  live = true,
  height = 260,
  gradient = ["#122b1c", "#0a0a0c"],
  className,
  image,
  loading = "lazy",
  sizes = "(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) calc(50vw - 4.5rem), 540px",
  quality,
  overlayOnImage = true,
  objectPosition = "top",
}: BrowserFrameProps) {
  const cleanImage = image && !overlayOnImage;
  const posClass =
    objectPosition === "bottom"
      ? "object-bottom"
      : objectPosition === "center"
        ? "object-center"
        : "object-top";
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col overflow-hidden border border-line bg-panel",
        className
      )}
    >
      {/* Chrome bar */}
      <div className="flex min-w-0 items-center justify-between gap-2 border-b border-line bg-paper px-3 py-2.5">
        <div className="flex shrink-0 items-center gap-1.5">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#ef4444]" />
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#eab308]" />
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#22c55e]" />
        </div>
        <div className="flex min-w-0 items-center gap-1.5 border border-line bg-panel px-2.5 py-1">
          <Globe aria-hidden="true" className="h-2.5 w-2.5 shrink-0 text-accent" />
          <span className="truncate font-mono text-[10px] text-muted" title={url}>{url}</span>
        </div>
        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted" />
      </div>

      {/* Canvas */}
      <div
        className="relative flex flex-col justify-between overflow-hidden p-4"
        style={{
          height,
          background: `linear-gradient(180deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        }}
      >
        {image ? (
          <SafeImage
            src={image}
            alt={title}
            sizes={sizes}
            quality={quality}
            loading={loading}
            className={`absolute inset-0 h-full w-full object-cover ${posClass}`}
          />
        ) : (
          <div
            className="pointer-events-none absolute inset-0"
            style={GRID_STYLE}
            aria-hidden
          />
        )}

        {cleanImage && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-14"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)",
            }}
            aria-hidden
          />
        )}

        {/* Top: tag + LIVE */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="border border-white/20 bg-black/40 px-2.5 py-1 font-mono text-[9px] tracking-wider text-white">
            {tag}
          </span>
          {live && (
            <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-[#4ade80]">
              <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              LIVE SITE
            </span>
          )}
        </div>

        {/* Center: client + title (disembunyikan saat cleanImage) */}
        {!cleanImage && (
          <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
            <span className="font-mono text-[10px] tracking-wider text-[#b9b9b9]">
              {client}
            </span>
            <span className="font-display text-[22px] leading-tight text-white">
              {title}
            </span>
            {sub && (
              <span className="text-sm text-[#b9b9b9]">{sub}</span>
            )}
          </div>
        )}

        {/* Bottom: status (disembunyikan saat cleanImage) */}
        {!cleanImage && (
          <div className="relative z-10 flex items-center justify-between font-mono text-[9px]">
            <span className="text-[#4ade80]">✓ Production Ready</span>
            <span className="text-[#b9b9b9]">Click to open →</span>
          </div>
        )}
      </div>
    </div>
  );
}
