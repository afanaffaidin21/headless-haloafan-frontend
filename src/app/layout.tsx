import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CvProvider } from "@/components/providers/cv-provider";
import { LazyCvModal } from "@/components/ui/lazy-cv-modal";
import { GridOverlay } from "@/components/ui/grid-overlay";
import { JsonLd } from "@/components/seo/json-ld";
import { getCanonicalUrl, localizedPath, SITE_URL } from "@/lib/site-url";
import { SITE_CONFIG } from "@/lib/seed";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
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
