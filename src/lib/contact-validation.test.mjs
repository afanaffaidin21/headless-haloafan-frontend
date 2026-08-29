import assert from "node:assert/strict";
import test from "node:test";

import {
  CONTACT_LIMITS,
  validateContactPayload,
} from "./contact-validation.ts";

test("accepts international names and preserves message line breaks", () => {
  const result = validateContactPayload({
    name: "李 O’Connor-علي 😊",
    email: "hello+portfolio@example.com",
    message: "First line\nSecond line",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.name, "李 O’Connor-علي 😊");
    assert.equal(result.data.message, "First line\nSecond line");
  }
});

test("requires a valid email and rejects whitespace-only fields", () => {
  const result = validateContactPayload({
    name: "   ",
    email: "not-an-email",
    message: "   ",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.deepEqual(result.errors, [
      "name_required",
      "email_invalid",
      "message_required",
    ]);
  }
});

test("enforces length limits without a Latin-only name rule", () => {
  const result = validateContactPayload({
    name: "a".repeat(CONTACT_LIMITS.nameMaxLength + 1),
    email: "a@b.example",
    message: "valid message",
  });

  assert.equal(result.ok, false);
  if (!result.ok) assert.deepEqual(result.errors, ["name_too_long"]);
});

test("marks a honeypot submission invalid without exposing the honeypot reason", () => {
  const result = validateContactPayload({
    name: "Afan",
    email: "afan@example.com",
    message: "A genuine-looking message",
    website: "https://spam.example",
  });

  assert.deepEqual(result, { ok: false, errors: ["invalid_submission"] });
});
