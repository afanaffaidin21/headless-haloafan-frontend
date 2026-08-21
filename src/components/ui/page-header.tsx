export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-5 px-6 pb-10 pt-16 md:px-12 md:pb-[72px] md:pt-24">
      <div className="flex items-center gap-3">
        <span className="eyebrow-marker" aria-hidden />
        <span className="font-mono text-[11px] tracking-widest text-muted md:text-[13px]">
          ({eyebrow}) — {title.toUpperCase()}
        </span>
      </div>
      <h1 className="font-display text-[36px] leading-[1.05] text-ink md:text-[64px]">
        {title}
      </h1>
      {sub && (
        <p className="max-w-[640px] text-[16px] text-muted md:text-[17px]">
          {sub}
        </p>
      )}
    </div>
  );
}