export type CmsCollectionStatus = "available" | "empty" | "unavailable";

/**
 * Editorial collections deliberately have one cache identity each.  Locale,
 * route, and slug are presentation concerns and must not create a second CMS
 * snapshot.
 */
export const CMS_COLLECTION_CACHE_KEYS = {
  projects: "published-projects-collection-v2",
  blog: "published-blog-collection-v2",
} as const;

export interface CmsCollectionResult<T> {
  items: T[];
  status: CmsCollectionStatus;
}

/**
 * Keep the last successful CMS snapshot during a bounded outage. An outage
 * without a snapshot remains explicitly unavailable instead of becoming an
 * empty-success response.
 */
export function resolveCmsCollection<T>(
  result: CmsCollectionResult<T>,
  lastKnownGood: T[] | undefined
): CmsCollectionResult<T> {
  if (result.status !== "unavailable") return result;
  if (lastKnownGood !== undefined) {
    return {
      items: lastKnownGood,
      status: lastKnownGood.length > 0 ? "available" : "empty",
    };
  }
  return result;
}
