import type { NormalizedContactPayload } from "./contact-validation";

export const DEFAULT_CONTACT_ENDPOINT =
  "https://cms.haloafan.com/wp-json/haloafan/v1/contact";

export type ContactTransportResult =
  | { status: "accepted" }
  | { status: "rate_limited" }
  | { status: "rejected" }
  | { status: "unavailable" };

export type ContactTransportConfig = {
  endpoint?: string;
  token?: string;
};

type FetchLike = typeof fetch;

export function getContactTransportConfig(
  env: Record<string, string | undefined> = process.env
): ContactTransportConfig {
  const configuredEndpoint = env.CONTACT_ENDPOINT;
  const endpoint = configuredEndpoint?.trim() || DEFAULT_CONTACT_ENDPOINT;
  // Temporary migration fallback: this module is server-only, so the legacy
  // public-prefixed token is never included in a Client Component bundle.
  const token = (env.CONTACT_TOKEN ?? env.NEXT_PUBLIC_CONTACT_TOKEN)?.trim();

  try {
    const parsed = new URL(endpoint);
    if (parsed.protocol !== "https:") return { token };
  } catch {
    return { token };
  }

  return { endpoint, token };
}

export async function deliverContactMessage(
  payload: NormalizedContactPayload,
  options: {
    config?: ContactTransportConfig;
    fetchImpl?: FetchLike;
    timeoutMs?: number;
  } = {}
): Promise<ContactTransportResult> {
  const config = options.config ?? getContactTransportConfig();
  if (!config.endpoint) return { status: "unavailable" };

  let endpoint: URL;
  try {
    endpoint = new URL(config.endpoint);
    if (endpoint.protocol !== "https:") return { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }

  const controller = new AbortController();
  const timeoutMs = Math.min(Math.max(options.timeoutMs ?? 8000, 1000), 15000);
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const fetchImpl = options.fetchImpl ?? fetch;

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (config.token) headers["X-Haloafan-Token"] = config.token;
    if (payload.idempotencyKey) headers["Idempotency-Key"] = payload.idempotencyKey;

    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        message: payload.message,
        website: "",
        ...(payload.idempotencyKey ? { idempotency_key: payload.idempotencyKey } : {}),
      }),
      // Never forward the authenticated request to an untrusted redirect
      // target. Redirects are handled as a service-unavailable condition.
      redirect: "manual",
      signal: controller.signal,
    });

    if (response.status >= 300 && response.status < 400) {
      // Consume/cancel the body so keep-alive agents can release the connection.
      if (response.body) await response.body.cancel().catch(() => undefined);
      return { status: "unavailable" };
    }

    if (response.status === 429) return { status: "rate_limited" };
    if (response.status >= 200 && response.status < 300) {
      let body: unknown;
      try {
        body = JSON.parse(await response.text());
      } catch {
        return { status: "unavailable" };
      }

      if (
        typeof body === "object" &&
        body !== null &&
        !Array.isArray(body) &&
        (body as { ok?: unknown }).ok === true
      ) {
        return { status: "accepted" };
      }
      return { status: "unavailable" };
    }
    if (response.status >= 400 && response.status < 500) return { status: "rejected" };
    return { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
