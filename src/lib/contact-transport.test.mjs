import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_CONTACT_ENDPOINT,
  deliverContactMessage,
  getContactTransportConfig,
} from "./contact-transport.ts";

const payload = {
  name: "Afan",
  email: "afan@example.com",
  message: "A genuine-looking message",
  website: "",
  idempotencyKey: "test-key",
};

function fakeFetch(status, body = { ok: true }) {
  return async (_url, init) => {
    assert.equal(init.method, "POST");
    assert.equal(init.headers["Idempotency-Key"], "test-key");
    assert.equal(init.redirect, "manual");
    assert.match(init.body, /"message":"A genuine-looking message"/);
    return new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  };
}

test("uses the canonical CMS endpoint and never the obsolete host", () => {
  const config = getContactTransportConfig({});
  const obsoleteEndpoint = DEFAULT_CONTACT_ENDPOINT.replace(
    "cms.haloafan.com",
    "haloafan.com"
  );
  assert.equal(config.endpoint, DEFAULT_CONTACT_ENDPOINT);
  assert.equal(
    config.endpoint,
    "https://cms.haloafan.com/wp-json/haloafan/v1/contact"
  );
  assert.notEqual(
    config.endpoint,
    obsoleteEndpoint
  );
  assert.equal(
    getContactTransportConfig({
      NEXT_PUBLIC_CONTACT_ENDPOINT: "https://unexpected.example/contact",
    }).endpoint,
    DEFAULT_CONTACT_ENDPOINT
  );
});

test("accepts only a 2xx response with an explicit ok body", async () => {
  assert.deepEqual(
    await deliverContactMessage(payload, {
      config: { endpoint: "https://transport.example/contact" },
      fetchImpl: fakeFetch(202, { ok: true }),
    }),
    { status: "accepted" }
  );
  assert.deepEqual(
    await deliverContactMessage(payload, {
      config: { endpoint: "https://transport.example/contact" },
      fetchImpl: fakeFetch(200, { ok: false }),
    }),
    { status: "unavailable" }
  );
  assert.deepEqual(
    await deliverContactMessage(payload, {
      config: { endpoint: "https://transport.example/contact" },
      fetchImpl: fakeFetch(200, null),
    }),
    { status: "unavailable" }
  );
  assert.deepEqual(
    await deliverContactMessage(payload, {
      config: { endpoint: "https://transport.example/contact" },
      fetchImpl: async (_url, init) => {
        assert.equal(init.redirect, "manual");
        return new Response("not-json", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      },
    }),
    { status: "unavailable" }
  );
});

test("rejects upstream redirects without following or forwarding the token", async () => {
  let calls = 0;
  const result = await deliverContactMessage(payload, {
    config: {
      endpoint: "https://transport.example/contact",
      token: "server-secret-that-must-not-leak",
    },
    fetchImpl: async (_url, init) => {
      calls += 1;
      assert.equal(init.redirect, "manual");
      assert.equal(init.headers["X-Haloafan-Token"], "server-secret-that-must-not-leak");
      return new Response(null, {
        status: 302,
        headers: { Location: "https://unexpected.example/collect" },
      });
    },
  });
  assert.deepEqual(result, { status: "unavailable" });
  assert.equal(calls, 1);
  assert.equal(JSON.stringify(result).includes("server-secret"), false);
  assert.equal(JSON.stringify(result).includes("unexpected.example"), false);
});

test("maps rate limiting and upstream failures without leaking details", async () => {
  assert.deepEqual(
    await deliverContactMessage(payload, {
      config: { endpoint: "https://transport.example/contact" },
      fetchImpl: fakeFetch(429, { ok: false }),
    }),
    { status: "rate_limited" }
  );
  assert.deepEqual(
    await deliverContactMessage(payload, {
      config: { endpoint: "https://transport.example/contact" },
      fetchImpl: fakeFetch(503, { ok: false }),
    }),
    { status: "unavailable" }
  );
  assert.deepEqual(
    await deliverContactMessage(payload, {
      config: { endpoint: "https://transport.example/contact" },
      fetchImpl: fakeFetch(400, { ok: false }),
    }),
    { status: "rejected" }
  );
});

test("returns unavailable when no valid transport is configured", async () => {
  assert.deepEqual(
    await deliverContactMessage(payload, {
      config: {},
      fetchImpl: fakeFetch(200),
    }),
    { status: "unavailable" }
  );
});

test("maps network errors to unavailable", async () => {
  assert.deepEqual(
    await deliverContactMessage(payload, {
      config: { endpoint: "https://transport.example/contact" },
      fetchImpl: async () => {
        throw new Error("simulated network failure");
      },
    }),
    { status: "unavailable" }
  );
});

test("maps an aborted transport to unavailable", async () => {
  const result = await deliverContactMessage(payload, {
    config: { endpoint: "https://transport.example/contact" },
    timeoutMs: 1000,
    fetchImpl: async (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => {
          const error = new Error("aborted");
          error.name = "AbortError";
          reject(error);
        });
      }),
  });
  assert.deepEqual(result, { status: "unavailable" });
});
