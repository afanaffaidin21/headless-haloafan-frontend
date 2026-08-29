interface CmsCollectionStateProps {
  heading: string;
  description: string;
}

export function CmsCollectionState({
  heading,
  description,
}: CmsCollectionStateProps) {
  return (
    <div
      role="status"
      className="border border-line bg-panel px-6 py-10 text-center md:px-10"
    >
      <h2 className="font-display text-[28px] leading-tight text-ink">{heading}</h2>
      <p className="mx-auto mt-3 max-w-[560px] text-[16px] leading-relaxed text-muted">
        {description}
      </p>
    </div>
  );
}
