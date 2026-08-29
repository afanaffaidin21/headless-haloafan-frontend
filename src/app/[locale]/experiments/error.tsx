"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ExperimentsError({ reset }: { reset: () => void }) {
  const t = useTranslations("experiments");

  return (
    <>
      <Header active="experiments" />
      <main id="main-content" tabIndex={-1} className="flex-1 px-6 py-16 md:px-12 md:py-24">
        <section
          className="border border-line bg-panel px-6 py-10 md:px-10 md:py-12"
          role="alert"
        >
          <h1 className="font-display text-[32px] leading-tight text-ink md:text-[44px]">
            {t("errorHeading")}
          </h1>
          <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-muted">
            {t("errorSub")}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-7 inline-flex border border-ink bg-accent px-7 py-3.5 text-[15px] font-medium text-[#0a0a0c] shadow-hard transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {t("retry")}
          </button>
        </section>
      </main>
      <Footer />
    </>
  );
}
