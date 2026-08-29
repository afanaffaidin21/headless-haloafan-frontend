"use client";

import { useTranslations } from "next-intl";
import { Briefcase, UserCheck, ArrowRight, Check } from "lucide-react";
import {
  useAudience,
  type AudiencePath,
} from "@/components/providers/audience-provider";

export function PathSwitcher() {
  const t = useTranslations();
  const { path, setPath } = useAudience();

  const paths: {
    key: "freelance" | "fulltime";
    icon: typeof Briefcase;
  }[] = [
    { key: "freelance", icon: Briefcase },
    { key: "fulltime", icon: UserCheck },
  ];

  return (
    <section className="border-b border-line px-6 py-8 md:px-12 md:py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 bg-accent" aria-hidden />
          <span className="font-mono text-xs tracking-[0.2em] text-ink">
            {t("pathSwitcher.title").toUpperCase()}
          </span>
        </div>
        <p className="hidden font-mono text-xs text-muted md:block">
          {t("pathSwitcher.hint")}
        </p>
      </div>

      <div className="mt-6 grid min-w-0 gap-5 md:grid-cols-2">
        {paths.map(({ key, icon: Icon }) => {
          const active = path === key;
          const data = t.raw(`pathSwitcher.${key}`) as Record<string, string>;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setPath(key)}
              aria-pressed={active}
              className={`group flex w-full min-w-0 max-w-full flex-col gap-3.5 border p-6 text-left transition-all ${
                active
                  ? "border-accent bg-paper shadow-hard-accent"
                  : "border-line bg-panel"
              }`}
            >
              <div className="flex min-w-0 items-start justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    className={`flex h-11 w-11 items-center justify-center border border-line ${
                      active ? "bg-accent-dim" : "bg-panel"
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5 text-accent" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-mono text-[11px] tracking-wider text-accent">
                      {data.kicker.toUpperCase()}
                    </span>
                    <span className="break-words font-display text-[22px] text-ink">
                      {data.heading}
                    </span>
                  </span>
                </div>
                {active && (
                  <span className="hidden h-6 w-6 items-center justify-center bg-accent md:flex">
                    <Check aria-hidden="true" className="h-4 w-4 text-[#0a0a0c]" />
                  </span>
                )}
              </div>

              <p className="min-w-0 break-words text-sm leading-relaxed text-muted">{data.desc}</p>

              <div className="flex flex-col items-start gap-2 border-t border-line pt-4 md:flex-row md:items-center md:justify-between">
                <span className="font-mono text-[11px] tracking-wider text-muted">
                  FOCUS: {data.focus}
                </span>
                <span
                  className={`flex items-center gap-1 font-mono text-[11px] tracking-wider ${
                    active ? "text-accent" : "text-ink"
                  }`}
                >
                  {data.cta.toUpperCase()}{" "}
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {path !== "neutral" && (
        <button
          type="button"
          onClick={() => setPath("neutral")}
          className="mt-4 font-mono text-[11px] text-muted underline decoration-dotted underline-offset-4"
        >
          ← {t("pathSwitcher.reset").toUpperCase()}
        </button>
      )}
    </section>
  );
}

export type { AudiencePath };
