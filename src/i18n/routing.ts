import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const localeNames: Record<string, string> = {
  en: "EN",
  id: "ID",
};