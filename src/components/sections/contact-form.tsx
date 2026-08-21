"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";

const ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ??
  "https://haloafan.com/wp-json/haloafan/v1/contact";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Haloafan-Token": process.env.NEXT_PUBLIC_CONTACT_TOKEN ?? "",
        },
        body: JSON.stringify({
          ...form,
          idempotency_key:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : String(Date.now()),
        }),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "", website: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:border-accent focus:outline-none";

  return (
    <div className="w-full border border-line bg-panel p-6 shadow-hard md:p-8">
      <span className="font-mono text-xs tracking-[0.2em] text-accent">
        {t("formLabel").toUpperCase()}
      </span>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
        {/* Honeypot (hidden) */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className="hidden"
        />

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-wider text-muted">
            {t("name").toUpperCase()}
          </span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t("name")}
            className={field}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-wider text-muted">
            {t("email").toUpperCase()}
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={t("emailPlaceholder")}
            className={field}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-wider text-muted">
            {t("message").toUpperCase()}
          </span>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={t("message")}
            className={field}
          />
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="flex items-center justify-center gap-2.5 bg-accent px-5 py-4 text-[15px] font-semibold text-[#0a0a0c] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {status === "sending" ? "..." : t("submit")}
        </button>

        {status === "success" && (
          <p className="font-mono text-xs text-accent">
            ✓ {t("success")}
          </p>
        )}
        {status === "error" && (
          <p className="font-mono text-xs text-[#ef4444]">
            ✗ {t("error")}
          </p>
        )}

        <p className="font-mono text-xs text-muted">* {t("note")}</p>
      </form>
    </div>
  );
}