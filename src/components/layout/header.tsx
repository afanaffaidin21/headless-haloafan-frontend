import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Header({
  active,
}: {
  active?: "projects" | "experiments" | "blog" | "about" | "contact";
}) {
  const t = useTranslations();

  const links: { key: "projects" | "experiments" | "blog" | "about"; href: string }[] = [
    { key: "projects", href: "/projects" },
    { key: "experiments", href: "/experiments" },
    { key: "blog", href: "/blog" },
    { key: "about", href: "/about" },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t("nav.skipToContent")}
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="flex h-[64px] items-center justify-between px-6 md:h-[74px] md:px-12">
          <Link href="/" className="font-display text-[21px] text-ink md:text-2xl">
            haloafan.
          </Link>

          {/* Desktop nav */}
          <nav aria-label={t("nav.label")} className="hidden items-center gap-7 lg:flex">
            <ul className="flex items-center gap-6">
              {links.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    aria-current={active === link.key ? "page" : undefined}
                    className={`text-[15px] ${
                      active === link.key ? "text-accent" : "text-ink"
                    }`}
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
            <ThemeToggle />
            <LanguageSwitcher />
            <Link
              href="/contact"
              aria-current={active === "contact" ? "page" : undefined}
              className={`flex items-center border px-[18px] py-2.5 text-[15px] font-medium ${
                active === "contact"
                  ? "border-accent bg-accent text-[#0a0a0c]"
                  : "border-accent text-accent"
              }`}
            >
              {t("nav.contact")}
            </Link>
          </nav>

          {/* Mobile nav */}
          <div className="flex items-center lg:hidden">
            <MobileNav active={active} />
          </div>
        </div>
      </header>
    </>
  );
}
