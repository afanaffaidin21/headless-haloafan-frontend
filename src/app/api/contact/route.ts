import { NextResponse } from "next/server";
import {
  validateContactPayload,
  type ContactPayload,
} from "@/lib/contact-validation";
import {
  deliverContactMessage,
  getContactTransportConfig,
} from "@/lib/contact-transport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 64 * 1024;

function responseBody(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function parsePayload(request: Request): Promise<ContactPayload | undefined> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return undefined;
  }
  if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
    return undefined;
  }

  if (contentType.includes("application/json")) {
    try {
      const parsed: unknown = JSON.parse(rawBody);
      return isObject(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(rawBody).entries());
  }

  return undefined;
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_REQUEST_BYTES) {
    return responseBody(
      { ok: false, code: "request_too_large" },
      413
    );
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return responseBody({ ok: false, code: "invalid_origin" }, 403);
      }
    } catch {
      return responseBody({ ok: false, code: "invalid_origin" }, 403);
    }
  }

  const payload = await parsePayload(request);
  if (!payload) {
    return responseBody({ ok: false, code: "invalid_submission" }, 400);
  }

  const validation = validateContactPayload(payload);
  if (!validation.ok) {
    return responseBody(
      { ok: false, code: "validation_error", errors: validation.errors },
      400
    );
  }

  const delivery = await deliverContactMessage(validation.data, {
    config: getContactTransportConfig(),
  });

  if (delivery.status === "accepted") {
    return responseBody({ ok: true }, 200);
  }
  if (delivery.status === "rate_limited") {
    return responseBody({ ok: false, code: "rate_limited" }, 429);
  }
  if (delivery.status === "rejected") {
    return responseBody({ ok: false, code: "delivery_rejected" }, 502);
  }
  return responseBody({ ok: false, code: "service_unavailable" }, 503);
}
