"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface CmsCollectionStateProps {
  heading: string;
  description: string;
  retryLabel?: string;
  retryingLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function CmsCollectionState({
  heading,
  description,
  retryLabel,
  retryingLabel,
  secondaryHref,
  secondaryLabel,
}: CmsCollectionStateProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const hasActions = Boolean(retryLabel || (secondaryHref && secondaryLabel));

  function retry() {
    if (isPending) return;
    startTransition(() => router.refresh());
  }

  return (
    <div
      role="status"
      aria-busy={isPending}
      className="border border-line bg-panel px-6 py-10 text-center md:px-10"
    >
      <h2 className="font-display text-[28px] leading-tight text-ink">{heading}</h2>
      <p className="mx-auto mt-3 max-w-[560px] text-[16px] leading-relaxed text-muted">
        {description}
      </p>
      {hasActions && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {retryLabel && (
            <button
              type="button"
              onClick={retry}
              disabled={isPending}
              aria-busy={isPending}
              className="inline-flex min-h-11 items-center justify-center border border-accent bg-accent px-5 py-2.5 text-sm font-medium text-[#0a0a0c] disabled:cursor-wait disabled:opacity-70"
            >
              {isPending ? retryingLabel ?? retryLabel : retryLabel}
            </button>
          )}
          {secondaryHref && secondaryLabel && (
            <a
              href={secondaryHref}
              className="inline-flex min-h-11 items-center justify-center border border-line px-5 py-2.5 text-sm font-medium text-accent"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {isPending ? retryingLabel ?? retryLabel : ""}
      </span>
    </div>
  );
}
