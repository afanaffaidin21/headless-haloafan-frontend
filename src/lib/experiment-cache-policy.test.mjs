import assert from "node:assert/strict";
import test from "node:test";

import { getExperimentCachePolicy } from "./experiment-cache-policy.ts";

test("uses normal data revalidation and a short unavailable TTL", () => {
  assert.deepEqual(getExperimentCachePolicy({}), {
    dataRevalidationSeconds: 30,
    unavailableRevalidationSeconds: 30,
  });
});

test("keeps unavailable TTL short while allowing normal data configuration", () => {
  assert.deepEqual(
    getExperimentCachePolicy({
      NEXT_PUBLIC_REVALIDATE_SECONDS: "1800",
      EXPERIMENTS_UNAVAILABLE_REVALIDATE_SECONDS: "900",
    }),
    {
      dataRevalidationSeconds: 1800,
      unavailableRevalidationSeconds: 60,
    }
  );
});

test("falls back for invalid values and clamps non-positive values", () => {
  assert.deepEqual(
    getExperimentCachePolicy({
      NEXT_PUBLIC_REVALIDATE_SECONDS: "invalid",
      EXPERIMENTS_UNAVAILABLE_REVALIDATE_SECONDS: "0",
    }),
    {
      dataRevalidationSeconds: 30,
      unavailableRevalidationSeconds: 1,
    }
  );
});
