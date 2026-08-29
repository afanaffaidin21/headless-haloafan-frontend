export type CmsCollectionStatus = "available" | "empty" | "unavailable";

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
