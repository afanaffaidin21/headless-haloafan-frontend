"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function MobileNav() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const links: { key: "projects" | "experiments" | "blog" | "about"; href: string }[] = [
    { key: "projects", href: "/projects" },
    { key: "experiments", href: "/experiments" },
    { key: "blog", href: "/blog" },
    { key: "about", href: "/about" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-[34px] w-[38px] items-center justify-center border border-line text-ink lg:hidden"
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg lg:hidden">
          <div className="flex h-[64px] items-center justify-between border-b border-line px-6">
            <span className="font-display text-[21px] text-ink">haloafan.</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-[34px] w-[38px] items-center justify-center border border-line text-ink"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col px-6 py-8">
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.key} className="border-t border-line">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-5 font-display text-[26px] text-ink"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-col gap-6 border-t border-line pt-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wider text-muted">
                  {t("nav.available").toUpperCase()}
                </span>
                <LanguageSwitcher />
              </div>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center border border-ink bg-accent px-6 py-4 text-[15px] font-medium text-[#0a0a0c]"
              >
                {t("nav.contact")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}