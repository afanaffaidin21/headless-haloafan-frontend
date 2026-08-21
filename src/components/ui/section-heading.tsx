export function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="eyebrow-marker" aria-hidden />
        <span className="font-mono text-[11px] tracking-widest text-muted md:text-[13px]">
          ({eyebrow}) — {title.toUpperCase()}
        </span>
      </div>
      <h2 className="font-display text-[32px] leading-[1.08] text-ink md:text-[48px] md:leading-[1.05]">
        {title}
      </h2>
      {sub && (
        <p className="max-w-[640px] text-[16px] text-muted md:text-[17px]">
          {sub}
        </p>
      )}
    </div>
  );
}