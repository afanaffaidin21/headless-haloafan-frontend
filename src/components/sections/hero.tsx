"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { AvailabilityBadge } from "@/components/ui/availability-badge";
import { useAudience } from "@/components/providers/audience-provider";
import { useCv } from "@/components/providers/cv-provider";
import { PathSwitcher } from "@/components/sections/path-switcher";
import { SITE_CONFIG } from "@/lib/seed";

interface PathContent {
  badge: string;
  ctaPrimary: string;
  ctaSecondary: string;
  factStatus: string;
  stats: { num: string; label: string }[];
}

export function Hero() {
  const { path } = useAudience();
  const { openCv } = useCv();
  const t = useTranslations();
  const content = t.raw(`pathContent.${path}`) as PathContent;
  const marquee = t.raw("hero.marquee") as string[];

  const primaryHref =
    path === "freelance"
      ? `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(
          "Hi Afan, I saw your portfolio and would like to discuss a project."
        )}`
      : path === "fulltime"
        ? `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent("CV Request")}`
        : "/contact";

  return (
    <section className="border-b border-line">
      <div className="flex min-w-0 flex-col gap-10 px-6 pb-10 pt-12 md:gap-14 md:px-12 md:pb-14 md:pt-24">
        <div className="flex min-w-0 flex-col gap-5">
          <AvailabilityBadge label={content.badge} />

          <div className="flex items-center gap-3">
            <span className="eyebrow-marker" aria-hidden />
            <span className="font-mono text-[11px] tracking-wider text-muted md:text-[13px]">
              {t("hero.eyebrow")}
            </span>
          </div>

          <h1 className="w-full min-w-0 max-w-[1000px] font-display text-[40px] leading-[1.08] text-ink md:text-[78px] md:leading-[1.02]">
            <span className="block">{t("hero.line1")}</span>
            <span className="block italic text-accent">{t("hero.line2")}</span>
          </h1>

          <p className="w-full min-w-0 max-w-[620px] text-[16px] leading-relaxed text-muted md:text-[19px]">
            {t("hero.sub")}
          </p>

          <PathSwitcher />

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {path === "fulltime" ? (
              <Button variant="primary" onClick={openCv} className="justify-center sm:justify-start">
                {content.ctaPrimary}
              </Button>
            ) : (
              <Button variant="primary" href={primaryHref} className="justify-center sm:justify-start">
                {content.ctaPrimary}
              </Button>
            )}
            <Button href="/projects" className="justify-center sm:justify-start">
              {content.ctaSecondary}
            </Button>
          </div>
        </div>

        <div className="grid w-full min-w-0 grid-cols-3 border-t border-line md:flex md:py-7">
          {content.stats.map((s, i) => (
            <div
              key={s.label}
              className={`min-w-0 py-4 md:flex md:flex-1 md:items-center md:gap-3.5 md:py-0 md:pr-9 ${
                i > 0 ? "border-l border-line pl-3 md:border-l-0 md:pl-0" : ""
              }`}
            >
              <span className="block font-display text-[32px] leading-none text-ink md:text-[42px]">
                {s.num}
              </span>
              <span className="mt-2 block break-words font-mono text-[10px] leading-snug tracking-wider text-muted md:mt-0 md:mr-auto md:text-xs">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="min-w-0 max-w-full overflow-hidden border-y border-line">
          <Marquee items={marquee} className="border-0" />
        </div>

        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {content.factStatus}
        </span>
      </div>
    </section>
  );
}
