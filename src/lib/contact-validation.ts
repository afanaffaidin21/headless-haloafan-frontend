export const CONTACT_LIMITS = {
  nameMaxLength: 120,
  emailMaxLength: 254,
  messageMinLength: 10,
  messageMaxLength: 5000,
  idempotencyKeyMaxLength: 128,
} as const;

export type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
  idempotency_key?: unknown;
};

export type NormalizedContactPayload = {
  name: string;
  email: string;
  message: string;
  website: string;
  idempotencyKey?: string;
};

export type ContactValidationCode =
  | "invalid_submission"
  | "name_required"
  | "name_too_long"
  | "email_required"
  | "email_invalid"
  | "email_too_long"
  | "message_required"
  | "message_too_short"
  | "message_too_long";

export type ContactValidationResult =
  | { ok: true; data: NormalizedContactPayload }
  | { ok: false; errors: ContactValidationCode[] };

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Deliberately permissive email check. The browser's type=email check is a
 * useful first line of UX, but the server must accept international names and
 * ordinary addresses such as plus-addresses without a Latin-only regex.
 */
function looksLikeEmail(value: string): boolean {
  if (!value || /\s/.test(value) || value.length > CONTACT_LIMITS.emailMaxLength) {
    return false;
  }

  const at = value.lastIndexOf("@");
  if (at <= 0 || at !== value.indexOf("@") || at === value.length - 1) {
    return false;
  }

  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  return (
    local.length > 0 &&
    domain.length > 0 &&
    !domain.startsWith(".") &&
    !domain.endsWith(".") &&
    !domain.includes("..") &&
    domain.includes(".")
  );
}

export function validateContactPayload(
  payload: ContactPayload
): ContactValidationResult {
  const name = stringValue(payload.name).trim();
  const email = stringValue(payload.email).trim();
  // Keep intentional line breaks, while removing accidental outer whitespace.
  const message = stringValue(payload.message).trim();
  const website = stringValue(payload.website).trim();
  const rawIdempotencyKey = stringValue(payload.idempotency_key).trim();
  const errors: ContactValidationCode[] = [];

  // A filled honeypot is intentionally indistinguishable from another invalid
  // submission so that bots do not learn which check was triggered.
  if (website) errors.push("invalid_submission");

  if (!name) errors.push("name_required");
  else if (name.length > CONTACT_LIMITS.nameMaxLength) errors.push("name_too_long");

  if (!email) errors.push("email_required");
  else if (email.length > CONTACT_LIMITS.emailMaxLength) errors.push("email_too_long");
  else if (!looksLikeEmail(email)) errors.push("email_invalid");

  if (!message) errors.push("message_required");
  else if (message.length < CONTACT_LIMITS.messageMinLength)
    errors.push("message_too_short");
  else if (message.length > CONTACT_LIMITS.messageMaxLength)
    errors.push("message_too_long");

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      email,
      message,
      website: "",
      ...(rawIdempotencyKey
        ? { idempotencyKey: rawIdempotencyKey.slice(0, CONTACT_LIMITS.idempotencyKeyMaxLength) }
        : {}),
    },
  };
}
