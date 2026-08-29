"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations();

  return (
    <div
      role="group"
      aria-label={t("theme.label")}
      className="flex items-center gap-1 rounded-full border border-line p-1"
    >
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label={t("theme.dark")}
        aria-pressed={theme === "dark"}
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
          theme === "dark" ? "bg-accent-dim text-accent" : "text-muted"
        }`}
      >
        <Moon aria-hidden="true" className="h-[15px] w-[15px]" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label={t("theme.light")}
        aria-pressed={theme === "light"}
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
          theme === "light" ? "bg-accent-dim text-accent" : "text-muted"
        }`}
      >
        <Sun aria-hidden="true" className="h-[15px] w-[15px]" />
      </button>
    </div>
  );
}
