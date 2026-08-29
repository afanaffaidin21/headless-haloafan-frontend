import type { Metadata } from "next";
import {
  getCanonicalUrl,
  getLocaleAlternates,
  localizedPath,
  SOCIAL_IMAGE_URL,
  SITE_URL,
} from "./site-url";
export { isIndexableContent } from "./seo-guards";

export type SeoPageType = "website" | "article";

export function noIndexMetadata(title = "Page not found"): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: brandedTitle(title),
    robots: { index: false, follow: false },
  };
}

function brandedTitle(title: string): string {
  return /haloafan/i.test(title) ? title : `${title} · Haloafan`;
}

export function createPageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  type?: SeoPageType;
}): Metadata {
  if (!title.trim() || !description.trim()) return noIndexMetadata(title || "Page not found");

  const canonical = getCanonicalUrl(localizedPath(path, locale));
  const socialTitle = brandedTitle(title);

  return {
    metadataBase: new URL(SITE_URL),
    title: socialTitle,
    description,
    alternates: {
      canonical,
      languages: getLocaleAlternates(path),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: "Haloafan",
      locale: locale === "id" ? "id_ID" : "en_US",
      type,
      images: [
        {
          url: SOCIAL_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: "Ahmad Afan Affaidin — WordPress Developer & Web Engineer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [SOCIAL_IMAGE_URL],
    },
  };
}
