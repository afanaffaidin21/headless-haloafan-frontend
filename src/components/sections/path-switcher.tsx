"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, Briefcase, Check, UserCheck } from "lucide-react";
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
    <fieldset
      aria-describedby="path-switcher-hint"
      className="min-w-0 border-0 p-0"
    >
      <legend className="font-mono text-[11px] tracking-[0.2em] text-muted">
        <span className="mr-2 inline-block h-2 w-2 align-middle bg-accent" aria-hidden />
        {t("pathSwitcher.title").toUpperCase()}
      </legend>

      <div className="mt-2 flex min-w-0 items-start justify-between gap-3">
        <p
          id="path-switcher-hint"
          className="min-w-0 max-w-[620px] text-[13px] leading-relaxed text-muted md:text-sm"
        >
          {t("pathSwitcher.hint")}
        </p>

        {path !== "neutral" && (
          <button
            type="button"
            onClick={() => setPath("neutral")}
            aria-label={t("pathSwitcher.reset")}
            className="inline-flex h-11 min-h-11 min-w-11 w-11 shrink-0 items-center justify-center border border-line text-muted hover:border-accent hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mt-3 grid min-w-0 gap-2 min-[480px]:grid-cols-2">
        {paths.map(({ key, icon: Icon }) => {
          const active = path === key;
          const data = t.raw(`pathSwitcher.${key}`) as Record<string, string>;
          const descriptionId = `path-${key}-description`;

          return (
            <div key={key} className="min-w-0">
              <button
                type="button"
                onClick={() => setPath(key)}
                aria-pressed={active}
                aria-describedby={descriptionId}
                className={`group flex min-h-11 w-full min-w-0 items-center justify-between gap-3 border px-3 py-2 text-left transition-colors ${
                  active
                    ? "border-accent bg-accent-dim shadow-hard-accent"
                    : "border-line bg-panel hover:border-accent"
                }`}
              >
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center border border-line ${
                      active ? "bg-paper" : "bg-panel"
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4 text-accent"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words font-display text-[18px] leading-tight text-ink">
                      {data.label}
                    </span>
                    <span className="mt-1 block break-words font-mono text-[9px] leading-snug tracking-wider text-muted">
                      {data.focus}
                    </span>
                  </span>
                </span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="flex shrink-0 items-center gap-1.5 border border-accent bg-accent px-1.5 py-1 font-mono text-[10px] tracking-wider text-[#0a0a0c]"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span className="hidden min-[480px]:inline">
                      {t("pathSwitcher.selected").toUpperCase()}
                    </span>
                  </span>
                )}
              </button>
              <span id={descriptionId} className="sr-only">
                {data.desc}
              </span>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export type { AudiencePath };
