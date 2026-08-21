import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import en from "./messages/en.json";
import id from "./messages/id.json";

const messages: Record<string, typeof en> = { en, id };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale],
  };
});