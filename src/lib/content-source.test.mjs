import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("production content API has no project or blog seed fallback", () => {
  const source = read("./api.ts");
  assert.doesNotMatch(source, /SEED_PROJECTS|SEED_POSTS/);
});

test("project and blog route params are CMS-derived", () => {
  const projectPage = read("../app/[locale]/projects/[slug]/page.tsx");
  const blogPage = read("../app/[locale]/blog/[slug]/page.tsx");
  assert.doesNotMatch(projectPage, /universitas-sunan-gresik/);
  assert.doesNotMatch(blogPage, /Why I started exploring|CODE_THEME_JSON/);
});

test("GraphQL queries request nested screenshots and blog content", () => {
  const source = read("./graphql.ts");
  assert.match(source, /screenshots \{ nodes \{ sourceUrl \} \}/);
  assert.match(source, /content/);
  assert.match(source, /modified/);
});

test("dynamic SEO and sitemap code consume CMS-mapped records", () => {
  const projectPage = read("../app/[locale]/projects/[slug]/page.tsx");
  const blogPage = read("../app/[locale]/blog/[slug]/page.tsx");
  const sitemap = read("../app/sitemap.ts");
  assert.match(projectPage, /description: project\.description/);
  assert.match(projectPage, /"@type": "CreativeWork"/);
  assert.match(blogPage, /headline: post\.title/);
  assert.match(blogPage, /datePublished: post\.date/);
  assert.match(blogPage, /dangerouslySetInnerHTML=\{\{ __html: post\.content \}\}/);
  assert.match(sitemap, /getProjects\(\)/);
  assert.match(sitemap, /getPosts\(\)/);
  assert.doesNotMatch(sitemap, /universitas-sunan-gresik/);
});
