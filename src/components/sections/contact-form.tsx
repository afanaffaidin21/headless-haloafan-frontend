"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import {
  validateContactPayload,
  type ContactValidationCode,
} from "@/lib/contact-validation";

type Status = "idle" | "sending" | "success" | "error" | "offline";
type ErrorKind = "generic" | "network" | "serviceUnavailable" | "rateLimited" | "deliveryRejected";
type FieldName = "name" | "email" | "message";
type FormState = { name: string; email: string; message: string; website: string };
type FieldErrors = Partial<Record<FieldName, string>>;

const INITIAL_FORM: FormState = { name: "", email: "", message: "", website: "" };

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine
  );
  const summaryRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setStatus((current) => (current === "offline" ? "idle" : current));
    };
    const handleOffline = () => {
      setIsOnline(false);
      if (!submittingRef.current) setStatus("offline");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function focusElement(element: HTMLElement | null) {
    window.requestAnimationFrame(() => element?.focus());
  }

  function errorMessage(code: ContactValidationCode): string {
    switch (code) {
      case "name_required":
        return t("nameRequired");
      case "name_too_long":
        return t("nameTooLong");
      case "email_required":
        return t("emailRequired");
      case "email_invalid":
        return t("emailInvalid");
      case "email_too_long":
        return t("emailTooLong");
      case "message_required":
        return t("messageRequired");
      case "message_too_short":
        return t("messageTooShort");
      case "message_too_long":
        return t("messageTooLong");
      default:
        return t("error");
    }
  }

  function applyValidationErrors(codes: ContactValidationCode[]) {
    const nextErrors: FieldErrors = {};
    for (const code of codes) {
      const field: FieldName | undefined =
        code.startsWith("name_")
          ? "name"
          : code.startsWith("email_")
            ? "email"
            : code.startsWith("message_")
              ? "message"
              : undefined;
      if (field && !nextErrors[field]) nextErrors[field] = errorMessage(code);
    }
    setErrors(nextErrors);
    setErrorKind("generic");
    window.requestAnimationFrame(() => {
      summaryRef.current?.focus();
      if (!summaryRef.current) document.getElementById("contact-name")?.focus();
    });
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field !== "website") {
      setErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    if (!isOnline || (typeof navigator !== "undefined" && !navigator.onLine)) {
      setStatus("offline");
      setErrorKind("network");
      focusElement(feedbackRef.current);
      return;
    }

    const validation = validateContactPayload(form);
    if (!validation.ok) {
      setStatus("error");
      setErrorKind("generic");
      applyValidationErrors(validation.errors);
      return;
    }

    submittingRef.current = true;
    setStatus("sending");
    setErrorKind("generic");
    setErrors({});

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    const idempotencyKey =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, idempotency_key: idempotencyKey }),
        signal: controller.signal,
      });
      const body = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        errors?: ContactValidationCode[];
      };

      if (response.ok && body.ok === true) {
        setStatus("success");
        setForm(INITIAL_FORM);
        setErrors({});
        focusElement(feedbackRef.current);
      } else if (body.code === "validation_error" && Array.isArray(body.errors)) {
        setStatus("error");
        applyValidationErrors(body.errors);
      } else {
        setStatus("error");
        setErrorKind(
          body.code === "rate_limited"
            ? "rateLimited"
            : body.code === "service_unavailable"
              ? "serviceUnavailable"
              : body.code === "delivery_rejected"
                ? "deliveryRejected"
                : "generic"
        );
        focusElement(feedbackRef.current);
      }
    } catch {
      setStatus("error");
      setErrorKind("network");
      focusElement(feedbackRef.current);
    } finally {
      window.clearTimeout(timeout);
      submittingRef.current = false;
    }
  }

  const field =
    "w-full border border-line bg-bg px-4 py-3 text-[16px] text-ink placeholder:text-muted focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-focus";
  const errorClass = "font-mono text-xs text-danger";

  return (
    <div className="w-full border border-line bg-panel p-6 shadow-hard md:p-8">
      <span className="font-mono text-xs tracking-[0.2em] text-accent">
        {t("formLabel").toUpperCase()}
      </span>

      <form
        method="post"
        action="/api/contact"
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-5"
      >
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => updateField("website", event.target.value)}
          />
        </div>

        {Object.keys(errors).length > 0 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="border border-danger bg-danger/10 p-3 font-mono text-xs text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {t("validationSummary")}
          </div>
        )}

        <label className="flex flex-col gap-2" htmlFor="contact-name">
          <span className="font-mono text-[11px] tracking-wider text-muted">
            {t("name").toUpperCase()} <span aria-hidden="true">*</span>
            <span className="sr-only"> {t("required")}</span>
          </span>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            placeholder={t("name")}
            className={field}
          />
          {errors.name && (
            <p id="contact-name-error" className={errorClass}>
              {errors.name}
            </p>
          )}
        </label>

        <label className="flex flex-col gap-2" htmlFor="contact-email">
          <span className="font-mono text-[11px] tracking-wider text-muted">
            {t("email").toUpperCase()} <span aria-hidden="true">*</span>
            <span className="sr-only"> {t("required")}</span>
          </span>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            placeholder={t("emailPlaceholder")}
            className={field}
          />
          {errors.email && (
            <p id="contact-email-error" className={errorClass}>
              {errors.email}
            </p>
          )}
        </label>

        <label className="flex flex-col gap-2" htmlFor="contact-message">
          <span className="font-mono text-[11px] tracking-wider text-muted">
            {t("message").toUpperCase()} <span aria-hidden="true">*</span>
            <span className="sr-only"> {t("required")}</span>
          </span>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            placeholder={t("message")}
            className={field}
          />
          {errors.message && (
            <p id="contact-message-error" className={errorClass}>
              {errors.message}
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="flex min-h-[52px] items-center justify-center gap-2.5 bg-accent px-5 py-4 text-[15px] font-semibold text-[#0a0a0c] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-wait disabled:opacity-50"
        >
          <Send aria-hidden="true" className="h-4 w-4" />
          {status === "sending" ? t("sending") : t("submit")}
        </button>

        <p
          ref={feedbackRef}
          tabIndex={-1}
          aria-live={status === "error" ? "assertive" : "polite"}
          role={status === "error" ? "alert" : "status"}
          className={`font-mono text-xs focus:outline-none ${
            status === "success" || status === "offline" ? "text-accent" : "text-danger"
          }`}
        >
          {status === "success" && `✓ ${t("success")}`}
          {status === "offline" && t("offline")}
          {status === "error" &&
            (errorKind === "network"
              ? t("networkError")
              : errorKind === "serviceUnavailable"
                ? t("serviceUnavailable")
                : errorKind === "rateLimited"
                  ? t("rateLimited")
                  : errorKind === "deliveryRejected"
                    ? t("deliveryRejected")
                    : t("error"))}
        </p>

        <p className="font-mono text-xs text-muted">* {t("note")}</p>
      </form>
    </div>
  );
}
