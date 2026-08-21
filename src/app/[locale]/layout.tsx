import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CvProvider } from "@/components/providers/cv-provider";
import { CvModal } from "@/components/ui/cv-modal";
import { GridOverlay } from "@/components/ui/grid-overlay";
import { routing } from "@/i18n/routing";
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

export const metadata: Metadata = {
  title: {
    default: "Haloafan — WordPress Developer & AI-Driven",
    template: "%s · Haloafan",
  },
  description:
    "WordPress Developer & AI-Driven. Crafting impactful websites that look good & work great. Based in Surabaya, Indonesia.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://haloafan.com"),
  openGraph: {
    title: "Haloafan — WordPress Developer & AI-Driven",
    description: "Crafting impactful websites that look good & work great.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://haloafan.com",
    siteName: "Haloafan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haloafan — WordPress Developer & AI-Driven",
    description: "Crafting impactful websites that look good & work great.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Haloafan",
                url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://haloafan.com",
                inLanguage: locale,
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Ahmad Afan Affaidin",
                jobTitle: "WordPress Developer",
                url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://haloafan.com",
                sameAs: [
                  "https://www.linkedin.com/in/afanaffaidin/",
                  "https://www.instagram.com/afan_work/",
                  "https://dribbble.com/afanwork",
                  "https://github.com/afanaffaidin21",
                ],
              },
            ]),
          }}
        />
        <ThemeProvider defaultTheme="dark">
          <NextIntlClientProvider messages={messages}>
            <CvProvider>
              {children}
              <CvModal />
              <GridOverlay />
            </CvProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}