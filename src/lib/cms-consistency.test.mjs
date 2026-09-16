import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CMS_COLLECTION_CACHE_KEYS } from "./cms-collection.ts";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("Projects and Blog each have one shared editorial cache identity", () => {
  assert.equal(CMS_COLLECTION_CACHE_KEYS.projects, "published-projects-collection-v3");
  assert.equal(CMS_COLLECTION_CACHE_KEYS.blog, "published-blog-collection-v3");
  assert.notEqual(CMS_COLLECTION_CACHE_KEYS.projects, CMS_COLLECTION_CACHE_KEYS.blog);

  const api = read("./api.ts");
  assert.match(api, /CMS_COLLECTION_CACHE_KEYS\.projects/);
  assert.match(api, /CMS_COLLECTION_CACHE_KEYS\.blog/);
  assert.doesNotMatch(api, /published-projects-availability|published-blog-posts-availability/);
  assert.doesNotMatch(api, /published-(?:projects|blog)-.*(?:locale|slug|page)/);
});

test("all editorial routes consume collection snapshots instead of slug requests", () => {
  const api = read("./api.ts");
  assert.match(api, /getProjectResult[\s\S]*?getProjectsResult\(\)/);
  assert.match(api, /getPostResult[\s\S]*?getPostsResult\(\)/);

  const routeSources = [
    read("../components/sections/projects-section.tsx"),
    read("../components/sections/blog-section.tsx"),
    read("../app/[locale]/projects/page.tsx"),
    read("../app/[locale]/blog/page.tsx"),
    read("../app/[locale]/projects/[slug]/page.tsx"),
    read("../app/[locale]/blog/[slug]/page.tsx"),
    read("../app/sitemap.ts"),
  ].join("\n");

  assert.doesNotMatch(routeSources, /fetchGraphQL/);
  assert.doesNotMatch(routeSources, /SEED_PROJECTS|SEED_POSTS/);
});

test("the unavailable policy is bounded while a shared success snapshot remains authoritative", () => {
  const policy = read("./experiment-cache-policy.ts");
  const api = read("./api.ts");
  assert.match(policy, /DEFAULT_DATA_REVALIDATION_SECONDS = 30/);
  assert.match(policy, /DEFAULT_UNAVAILABLE_REVALIDATION_SECONDS = 30/);
  assert.match(api, /Data Cache serves the previous successful value/);
  assert.match(api, /resolveCmsCollection\(/);

  for (const route of [
    "../app/[locale]/projects/page.tsx",
    "../app/[locale]/projects/[slug]/page.tsx",
    "../app/[locale]/blog/page.tsx",
    "../app/[locale]/blog/[slug]/page.tsx",
  ]) {
    assert.match(read(route), /export const revalidate = 30;/, route);
  }
});

test("invalid slug lookup does not create a dedicated CMS request", () => {
  const api = read("./api.ts");
  const projectLookup = api.match(
    /export async function getProjectResult[\s\S]*?^}\r?\n\r?\nexport async function getProject/m
  )?.[0] ?? "";
  const postLookup = api.match(
    /export async function getPostResult[\s\S]*?^}\r?\n\r?\nexport async function getPost/m
  )?.[0] ?? "";
  assert.doesNotMatch(projectLookup, /fetchGraphQL/);
  assert.doesNotMatch(postLookup, /fetchGraphQL/);
});
