"use client";

import { useTranslations } from "next-intl";
import { useAudience } from "@/components/providers/audience-provider";

export interface Fact {
  k: string;
  v: string;
}

export function QuickFacts({ facts }: { facts: Fact[] }) {
  const { path } = useAudience();
  const t = useTranslations();
  const status = t(`pathContent.${path}.factStatus`);

  const rows: Fact[] = [
    ...facts.filter((f) => f.k !== "STATUS"),
    { k: "STATUS", v: status },
  ];

  return (
    <div className="w-full max-w-[340px] self-start border border-line bg-panel">
      <div className="border-b border-line px-5 py-4">
        <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
          QUICK FACTS
        </span>
      </div>
      {rows.map(({ k, v }) => (
        <div
          key={k}
          className="flex items-center justify-between gap-3 border-t border-line px-5 py-4"
        >
          <span className="font-mono text-[11px] tracking-wider text-muted">
            {k}
          </span>
          <span className="text-sm font-medium text-ink">{v}</span>
        </div>
      ))}
    </div>
  );
}
