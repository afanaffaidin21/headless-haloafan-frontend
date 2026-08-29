import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateReadingMinutes,
  extractVisibleText,
  sanitizeCmsHtml,
} from "./cms-content.ts";

test("empty CMS content has no reading time", () => {
  assert.equal(calculateReadingMinutes(""), 0);
  assert.equal(calculateReadingMinutes("<p> </p>"), 0);
});

test("non-empty CMS content is always at least one minute", () => {
  assert.equal(calculateReadingMinutes("<p>One short paragraph.</p>"), 1);
  assert.ok(calculateReadingMinutes(`<p>${"word ".repeat(401)}</p>`) >= 3);
});

test("reading time counts visible HTML text, including code, not tags", () => {
  const content = "<h2>Heading</h2><p>alpha beta</p><pre><code>gamma delta</code></pre>";
  assert.equal(extractVisibleText(content), "Heading alpha beta gamma delta");
  assert.equal(calculateReadingMinutes(content), 1);
});

test("sanitizer removes executable markup and preserves safe Gutenberg markup", () => {
  const sanitized = sanitizeCmsHtml(
    '<h2>Safe heading</h2><p onclick="alert(1)">Text</p><script>alert(1)</script><a href="javascript:alert(1)">bad</a><a href="https://example.com">good</a><blockquote>Quote</blockquote><pre><code class="language-js">const x = 1;</code></pre>'
  );

  assert.match(sanitized, /<h2>Safe heading<\/h2>/);
  assert.match(sanitized, /<p>Text<\/p>/);
  assert.match(sanitized, /<a>bad<\/a>/);
  assert.match(sanitized, /href="https:\/\/example\.com"/);
  assert.match(sanitized, /<blockquote>Quote<\/blockquote>/);
  assert.match(sanitized, /class="language-js"/);
  assert.doesNotMatch(sanitized, /script|onclick|javascript:/i);
});
