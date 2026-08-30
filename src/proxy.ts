import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const INTERNAL_LOCALE_REWRITE = "x-haloafan-locale-rewrite";
const LOCALE_HEADER = "x-next-intl-locale";

function isSupportedLocale(value: string | null): value is (typeof routing.locales)[number] {
  return value !== null && routing.locales.includes(value as (typeof routing.locales)[number]);
}

function isInternalLocaleRewrite(request: NextRequest) {
  const locale = request.headers.get(LOCALE_HEADER);
  const pathname = request.nextUrl.pathname;

  return (
    request.headers.get(INTERNAL_LOCALE_REWRITE) === "1" &&
    isSupportedLocale(locale) &&
    (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  );
}

function markInternalRewrite(response: NextResponse) {
  if (!response.headers.has("x-middleware-rewrite")) {
    return response;
  }

  const overriddenHeaders = response.headers.get("x-middleware-override-headers");

  if (!overriddenHeaders) {
    return response;
  }

  response.headers.set(
    "x-middleware-override-headers",
    `${overriddenHeaders},${INTERNAL_LOCALE_REWRITE}`,
  );
  response.headers.set(`x-middleware-request-${INTERNAL_LOCALE_REWRITE}`, "1");

  return response;
}

export default function proxy(request: NextRequest) {
  if (isInternalLocaleRewrite(request)) {
    const headers = new Headers(request.headers);
    headers.delete(INTERNAL_LOCALE_REWRITE);

    return NextResponse.next({ request: { headers } });
  }

  return markInternalRewrite(intlMiddleware(request));
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|opengraph-image|.*\\..*).*)"],
};
