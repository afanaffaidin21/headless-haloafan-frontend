import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { QuickFacts } from "@/components/ui/quick-facts";
import { SafeImage } from "@/components/ui/safe-image";
import { SITE_CONFIG } from "@/lib/seed";

const PORTRAIT =
  "https://cms.haloafan.com/wp-content/uploads/2026/05/photo-portfolio-with-caption-820x1024.png";

export async function AboutTeaser() {
  const t = await getTranslations("about");
  const quickFacts = [
    { k: "LOCATION", v: "Surabaya, ID" },
    { k: "EXPERIENCE", v: "5+ Years" },
    { k: "FOCUS", v: t("focusValue") },
  ];

  return (
    <section className="flex flex-col gap-14 px-6 py-16 md:px-12 md:py-24 lg:flex-row lg:items-start">
      {/* Portrait */}
      <div className="flex w-full max-w-[320px] flex-col gap-3.5">
        <div className="relative h-[420px] overflow-hidden border border-line md:h-[400px]">
          <SafeImage
            src={PORTRAIT}
            alt={SITE_CONFIG.name}
            sizes="(max-width: 1023px) calc(100vw - 3rem), 320px"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">{SITE_CONFIG.name}</span>
          <span className="font-mono text-xs text-accent">Surabaya, ID</span>
        </div>
      </div>

      {/* Copy */}
      <div className="flex max-w-[540px] flex-1 flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="eyebrow-marker" aria-hidden />
            <span className="font-mono text-[13px] tracking-widest text-muted">
              (05) — ABOUT
            </span>
          </div>
          <h2 className="font-display text-[36px] md:text-[52px] leading-[1.05] text-ink">
            {t("homeHeading")}
          </h2>
          <p className="text-[16px] md:text-[17px] leading-[1.65] text-muted">
            Helping brands stand out through purposeful web design &
            development. You focus on growing your business — I&apos;ll take
            care of building a website that truly represents your brand and
            works across all devices.
          </p>
        </div>
        <Link
          href="/about"
          className="flex w-fit items-center gap-2.5 text-[15px] font-medium text-accent"
        >
          More About Me <ArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
        </Link>
      </div>

      {/* Quick Facts (STATUS adaptif per path) */}
      <QuickFacts facts={quickFacts} />
    </section>
  );
}
