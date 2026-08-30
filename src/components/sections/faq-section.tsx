import { getTranslations } from "next-intl/server";
import { MessageSquare } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { SITE_CONFIG } from "@/lib/seed";

function whatsappUrl(message: string) {
  return `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(message)}`;
}

export async function FAQSection() {
  const t = await getTranslations("faq");
  const items = t.raw("items") as { id: string; question: string; answer: string }[];

  return (
    <section className="px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto grid w-full grid-cols-1 gap-y-12 xl:max-w-[1400px] xl:grid-cols-[minmax(0,800px)_minmax(20rem,420px)] xl:grid-rows-[auto_auto] xl:items-start xl:justify-center xl:gap-x-24 xl:gap-y-12">
      <div className="col-start-1 flex flex-col gap-6 xl:col-start-1 xl:row-start-1">
        <div className="flex items-center gap-3">
          <span className="eyebrow-marker" aria-hidden />
          <span className="font-mono text-[13px] tracking-widest text-muted">
            (06) — FAQ
          </span>
        </div>
        <h2 className="font-display text-[36px] md:text-[52px] leading-[1.05] text-ink">
          {t("heading")}
        </h2>
        <p className="text-[16px] md:text-[17px] text-muted">{t("sub")}</p>
      </div>

        <Accordion
          items={items}
          className="col-start-1 w-full max-w-[800px] xl:col-start-1 xl:row-start-2"
        />

        <aside className="col-start-1 w-full max-w-[420px] self-start justify-self-start border border-line bg-accent-dim px-8 py-8 shadow-hard-sm xl:col-start-2 xl:row-start-2 xl:justify-self-start">
          <span className="font-mono text-xs tracking-[0.2em] text-accent">
            {t("asideLabel")}
          </span>
          <h3 className="mt-4 font-display text-[28px] leading-tight text-ink">
            {t("asideHeading")}
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-ink">
            {t("asideBody")}
          </p>
          <a
            href={whatsappUrl("Hi Afan, I saw your portfolio and would like to discuss a project.")}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex w-fit items-center gap-2.5 border border-ink bg-accent px-7 py-3.5 text-[15px] font-medium text-[#0a0a0c] shadow-hard"
          >
            <MessageSquare aria-hidden="true" className="h-4 w-4" />
            {t("asideCta")}
          </a>
          <p className="mt-6 font-mono text-xs text-ink">* {t("note")}</p>
        </aside>
      </div>
    </section>
  );
}
