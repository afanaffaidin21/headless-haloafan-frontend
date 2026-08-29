import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CvProvider } from "@/components/providers/cv-provider";
import { LazyCvModal } from "@/components/ui/lazy-cv-modal";
import { GridOverlay } from "@/components/ui/grid-overlay";
import { JsonLd } from "@/components/seo/json-ld";
import { routing } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/seo";
import { getCanonicalUrl, localizedPath, SITE_URL } from "@/lib/site-url";
import { SITE_CONFIG } from "@/lib/seed";
import "../globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

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
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`dark ${instrumentSerif.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: "Haloafan",
              url: getCanonicalUrl(localizedPath("/", locale)),
              inLanguage: locale === "id" ? "id-ID" : "en-US",
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
        <ThemeProvider defaultTheme="dark">
          <NextIntlClientProvider messages={messages}>
            <CvProvider>
              {children}
              <LazyCvModal />
              <GridOverlay />
            </CvProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
