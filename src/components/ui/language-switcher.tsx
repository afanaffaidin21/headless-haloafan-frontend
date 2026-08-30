"use client";

import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className="flex items-center border border-line"
    >
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="text-muted">/</span>}
          <button
            type="button"
            onClick={() => switchLocale(loc)}
            aria-pressed={locale === loc}
            className={`min-h-11 min-w-11 px-2 py-2 font-mono text-xs lg:min-h-6 lg:min-w-0 lg:py-1 ${
              locale === loc ? "text-accent" : "text-muted"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
