const DEFAULT_SITE_URL = "https://www.haloafan.com";
const CANONICAL_HOSTNAMES = new Set(["haloafan.com", "www.haloafan.com"]);

function isCanonicalHostname(hostname: string): boolean {
  return CANONICAL_HOSTNAMES.has(hostname.toLowerCase());
}

export function normalizeSiteUrl(value?: string): string {
  try {
    const url = new URL(value || DEFAULT_SITE_URL);

    if (!isCanonicalHostname(url.hostname)) {
      return DEFAULT_SITE_URL;
    }

    // Canonical metadata must always point at the public production origin;
    // never preserve a preview/development port from environment input.
    if (url.port && url.port !== "443") {
      return DEFAULT_SITE_URL;
    }

    url.protocol = "https:";
    url.username = "";
    url.password = "";
    url.pathname = "/";
    url.port = "";
    url.search = "";
    url.hash = "";

    if (url.hostname === "haloafan.com") {
      url.hostname = "www.haloafan.com";
    }

    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const SOCIAL_IMAGE_URL = `${SITE_URL}/opengraph-image`;

export function normalizePath(path = "/"): string {
  let candidate = String(path || "/").trim();

  // If a caller accidentally passes an absolute URL, retain only its path so
  // CMS, preview, localhost, query, and fragment origins cannot leak into SEO.
  try {
    if (/^[a-z][a-z\d+.-]*:\/\//i.test(candidate)) {
      candidate = new URL(candidate).pathname;
    }
  } catch {
    return "/";
  }

  candidate = candidate.split(/[?#]/, 1)[0] || "/";
  if (!candidate.startsWith("/")) candidate = `/${candidate}`;
  candidate = candidate.replace(/\/{2,}/g, "/");

  if (candidate !== "/") candidate = candidate.replace(/\/+$/, "");
  return candidate || "/";
}

export function encodeSlug(slug: string): string {
  const value = String(slug || "").trim();
  if (!value) return "";

  try {
    return encodeURIComponent(decodeURIComponent(value).replace(/^\/+|\/+$/g, ""));
  } catch {
    return encodeURIComponent(value.replace(/^\/+|\/+$/g, ""));
  }
}

export function localizedPath(path: string, locale: string): string {
  const normalized = normalizePath(path);
  let withoutLocale = normalized;
  while (/^\/(?:en|id)(?=\/|$)/.test(withoutLocale)) {
    withoutLocale = withoutLocale.replace(/^\/(?:en|id)(?=\/|$)/, "") || "/";
  }

  if (locale === "id") {
    return withoutLocale === "/" ? "/id" : `/id${withoutLocale}`;
  }

  return withoutLocale;
}

export function getLocaleAlternates(path: string): Record<string, string> {
  const en = getCanonicalUrl(localizedPath(path, "en"));
  return {
    en,
    id: getCanonicalUrl(localizedPath(path, "id")),
    "x-default": en,
  };
}

export function getCanonicalUrl(path = "/", siteUrl = SITE_URL): string {
  return new URL(normalizePath(path), `${normalizeSiteUrl(siteUrl)}/`).toString();
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
