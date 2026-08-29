"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types";

export function Accordion({
  items,
  className,
}: {
  items: FAQItem[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const idPrefix = useId();

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, i) => {
        const open = openIndex === i;
        const triggerId = `${idPrefix}-trigger-${i}`;
        const panelId = `${idPrefix}-panel-${i}`;
        return (
          <div
            key={item.id}
            className="border-t border-line first:border-t-0"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : i)}
              aria-expanded={open}
              aria-controls={panelId}
              id={triggerId}
              className="flex w-full items-center justify-between gap-4 py-6 text-left"
            >
              <span className="text-[18px] text-ink">{item.question}</span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "h-[18px] w-[18px] shrink-0 text-muted transition-transform",
                  open && "rotate-180 text-accent"
                )}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!open}
              className={cn(
                "grid transition-all duration-300 motion-reduce:transition-none",
                open
                  ? "grid-rows-[1fr] pb-6 opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[600px] text-[16px] leading-relaxed text-muted">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
