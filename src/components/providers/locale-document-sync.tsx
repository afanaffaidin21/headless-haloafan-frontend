"use client";

import { useLocale } from "next-intl";
import { useEffect, useLayoutEffect } from "react";

const useDocumentLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Keep the document language aligned when a locale segment changes in place. */
export function LocaleDocumentSync() {
  const locale = useLocale();

  useDocumentLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
