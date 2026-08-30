"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function MobileNav({
  active,
}: {
  active?: "projects" | "experiments" | "blog" | "about" | "contact";
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const titleId = useId();

  const links: { key: "projects" | "experiments" | "blog" | "about"; href: string }[] = [
    { key: "projects", href: "/projects" },
    { key: "experiments", href: "/experiments" },
    { key: "blog", href: "/blog" },
    { key: "about", href: "/about" },
  ];

  const closeMenu = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => openButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusFirst = () => closeButtonRef.current?.focus();
    focusFirst();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = document.getElementById(menuId);
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => !element.hasAttribute("disabled"));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeMenu, menuId, open]);

  const menu = (
    <div
      id={menuId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[70] isolate flex flex-col overflow-hidden bg-bg lg:hidden"
    >
      <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-line bg-bg px-6">
        <h2 id={titleId} className="font-display text-[21px] text-ink">
          haloafan.
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closeMenu}
          aria-label={t("nav.closeMenu")}
          className="flex h-11 w-11 items-center justify-center border border-line text-ink"
        >
          <X aria-hidden="true" className="h-[18px] w-[18px]" />
        </button>
      </div>

      <nav
        aria-label={t("nav.label")}
        className="min-h-0 flex-1 overflow-y-auto bg-bg px-6 py-8"
      >
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.key} className="border-t border-line">
              <Link
                href={link.href}
                onClick={closeMenu}
                aria-current={active === link.key ? "page" : undefined}
                className="block py-5 font-display text-[26px] text-ink"
              >
                {t(`nav.${link.key}`)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-6 border-t border-line bg-bg pt-6">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] tracking-wider text-muted">
              {t("nav.available").toUpperCase()}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
          <Link
            href="/contact"
            onClick={closeMenu}
            aria-current={active === "contact" ? "page" : undefined}
            className="flex min-h-11 items-center justify-center border border-ink bg-accent px-6 py-3 text-[15px] font-medium text-[#0a0a0c]"
          >
            {t("nav.contact")}
          </Link>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("nav.openMenu")}
        aria-expanded={open}
        aria-controls={menuId}
        className="flex h-11 w-11 items-center justify-center border border-line text-ink lg:hidden"
      >
        <Menu aria-hidden="true" className="h-[18px] w-[18px]" />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(menu, document.body)
        : null}
    </>
  );
}
