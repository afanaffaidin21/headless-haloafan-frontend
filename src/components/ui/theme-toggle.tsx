"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full border border-line p-1">
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
        aria-pressed={theme === "dark"}
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
          theme === "dark" ? "bg-accent-dim text-accent" : "text-muted"
        }`}
      >
        <Moon className="h-[15px] w-[15px]" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Light mode"
        aria-pressed={theme === "light"}
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
          theme === "light" ? "bg-accent-dim text-accent" : "text-muted"
        }`}
      >
        <Sun className="h-[15px] w-[15px]" />
      </button>
    </div>
  );
}