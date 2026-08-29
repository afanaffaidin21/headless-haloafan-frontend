import assert from "node:assert/strict";
import test from "node:test";
import {
  encodeSlug,
  getCanonicalUrl,
  getLocaleAlternates,
  localizedPath,
  normalizeSiteUrl,
  serializeJsonLd,
  SOCIAL_IMAGE_URL,
} from "./site-url.ts";
import { isIndexableContent } from "./seo-guards.ts";

test("normalizes the production hostname and removes trailing paths", () => {
  assert.equal(
    normalizeSiteUrl("http://haloafan.com//preview?draft=1"),
    "https://www.haloafan.com"
  );
});

test("falls back to the canonical production origin for an invalid URL", () => {
  assert.equal(normalizeSiteUrl("not a URL"), "https://www.haloafan.com");
  assert.equal(
    normalizeSiteUrl("https://cms.haloafan.com/some-preview"),
    "https://www.haloafan.com"
  );
  assert.equal(
    normalizeSiteUrl("http://localhost:3000"),
    "https://www.haloafan.com"
  );
  assert.equal(
    normalizeSiteUrl("https://www.haloafan.com:3000/preview"),
    "https://www.haloafan.com"
  );
});

test("joins localized paths without double slashes", () => {
  assert.equal(
    getCanonicalUrl("//id//experiments", "https://haloafan.com/"),
    "https://www.haloafan.com/id/experiments"
  );
  assert.equal(
    getCanonicalUrl("https://cms.haloafan.com//id/about?draft=1#preview"),
    "https://www.haloafan.com/id/about"
  );
  assert.equal(
    localizedPath("/id//about?preview=1#section", "id"),
    "/id/about"
  );
  assert.equal(localizedPath("/id", "id"), "/id");
  assert.equal(localizedPath("/en/about", "en"), "/about");
  assert.equal(localizedPath("/id/id/about", "id"), "/id/about");
});

test("creates reciprocal EN, ID, and x-default alternates", () => {
  assert.deepEqual(getLocaleAlternates("/projects/example"), {
    en: "https://www.haloafan.com/projects/example",
    id: "https://www.haloafan.com/id/projects/example",
    "x-default": "https://www.haloafan.com/projects/example",
  });
});

test("social image uses the stable canonical origin", () => {
  assert.equal(SOCIAL_IMAGE_URL, "https://www.haloafan.com/opengraph-image");
});

test("encodes dynamic slugs as a single safe path segment", () => {
  assert.equal(encodeSlug("Café / UI"), "Caf%C3%A9%20%2F%20UI");
  assert.equal(encodeSlug(""), "");
});

test("escapes script-breaking JSON-LD characters", () => {
  const output = serializeJsonLd({ text: "</script><script>alert('x')</script>" });
  assert.equal(output.includes("</script>"), false);
  assert.equal(output.includes("\\u003c/script\\u003e"), true);
});

test("only complete CMS records are indexable", () => {
  assert.equal(isIndexableContent(undefined), false);
  assert.equal(
    isIndexableContent({ slug: "", title: "Title", description: "Copy" }),
    false
  );
  assert.equal(
    isIndexableContent(
      { slug: "post", title: "Title", excerpt: "", date: "2026-01-01" },
      ["slug", "title", "excerpt", "date"]
    ),
    false
  );
  assert.equal(
    isIndexableContent(
      { slug: "post", title: "Title", excerpt: "Copy", date: "2026-01-01" },
      ["slug", "title", "excerpt", "date"]
    ),
    true
  );
});
