import assert from "node:assert/strict";
import test from "node:test";

import { resolveCmsCollection } from "./cms-collection.ts";

test("successful empty CMS responses stay empty and never activate seed data", () => {
  const result = resolveCmsCollection({ items: [], status: "empty" }, ["last-known"]);
  assert.deepEqual(result, { items: [], status: "empty" });
});

test("CMS outage serves the last-known-good snapshot", () => {
  const result = resolveCmsCollection(
    { items: [], status: "unavailable" },
    ["published"]
  );
  assert.deepEqual(result, { items: ["published"], status: "available" });
});

test("CMS outage without a snapshot remains explicitly unavailable", () => {
  const result = resolveCmsCollection(
    { items: [], status: "unavailable" },
    undefined
  );
  assert.deepEqual(result, { items: [], status: "unavailable" });
});
