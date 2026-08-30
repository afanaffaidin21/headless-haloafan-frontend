import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleDocumentSync } from "@/components/providers/locale-document-sync";
import { LazyCvModal } from "@/components/ui/lazy-cv-modal";
import { JsonLd } from "@/components/seo/json-ld";
import { routing } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/seo";
import { getCanonicalUrl, localizedPath, SITE_URL } from "@/lib/site-url";
import { SITE_CONFIG } from "@/lib/seed";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    ...createPageMetadata({
      locale,
      path: "/",
      title: t("title"),
      description: t("description"),
    }),
    metadataBase: new URL(SITE_URL),
    icons: { icon: "/favicon.ico" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const supportedLocale = locale as (typeof routing.locales)[number];
  setRequestLocale(supportedLocale);
  const messages = await getMessages({ locale: supportedLocale });

  return (
    <NextIntlClientProvider locale={supportedLocale} messages={messages}>
      <LocaleDocumentSync />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: "Haloafan",
            url: getCanonicalUrl(localizedPath("/", supportedLocale)),
            inLanguage: supportedLocale === "id" ? "id-ID" : "en-US",
          },
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: SITE_CONFIG.name,
            jobTitle: SITE_CONFIG.role,
            url: getCanonicalUrl("/about"),
            sameAs: Object.values(SITE_CONFIG.socials),
          },
        ]}
      />
      {children}
      <LazyCvModal />
    </NextIntlClientProvider>
  );
}
