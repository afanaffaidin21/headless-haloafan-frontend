"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Download } from "lucide-react";
import { useCv } from "@/components/providers/cv-provider";
import {
  SITE_CONFIG,
  SEED_EXPERIENCE,
  SEED_EDUCATION,
  SEED_SKILLS,
} from "@/lib/seed";

export function CvModal() {
  const { isOpen, closeCv } = useCv();
  const t = useTranslations("cv");

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCv();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCv]);

  if (!isOpen) return null;

  const skills = SEED_SKILLS.flatMap((cat) => cat.skills);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={closeCv}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="CV"
        onClick={(e) => e.stopPropagation()}
        className="print-area flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden border border-line bg-panel shadow-[0_0_0_1px_#0a0a0c,8px_8px_0_0_#000]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-7 py-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-[26px] text-ink">
              {SITE_CONFIG.name}
            </h2>
            <span className="font-mono text-[11px] tracking-wider text-accent">
              {SITE_CONFIG.role.toUpperCase()}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCv}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center border border-line text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {/* Experience */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
              EXPERIENCE
            </span>
            {SEED_EXPERIENCE.slice(0, 4).map((e) => (
              <div
                key={e.company}
                className="flex items-center justify-between gap-4 border-t border-line py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium text-ink">
                    {e.company}
                  </span>
                  <span className="text-[13px] text-muted">{e.role}</span>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-muted">
                  {e.period}
                </span>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="mt-6 flex flex-col gap-2.5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
              EDUCATION
            </span>
            <p className="border-t border-line py-3 text-[15px] text-ink">
              {SEED_EDUCATION.institution} — {SEED_EDUCATION.degree}
            </p>
          </div>

          {/* Skills */}
          <div className="mt-6 flex flex-col gap-3">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
              CORE SKILLS
            </span>
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              {skills.map((s) => (
                <span
                  key={s}
                  className="border border-line bg-paper px-2.5 py-1 font-mono text-[11px] text-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-line px-7 py-5">
          <span className="font-mono text-[11px] text-muted">
            haloafan.com · {SITE_CONFIG.location}
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-accent px-4 py-2.5 text-[14px] font-medium text-[#0a0a0c]"
          >
            <Download className="h-4 w-4" />
            {t("download")}
          </button>
        </div>
      </div>
    </div>
  );
}