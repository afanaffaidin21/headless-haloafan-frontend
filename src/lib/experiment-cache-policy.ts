const DEFAULT_DATA_REVALIDATION_SECONDS = 30;
const DEFAULT_UNAVAILABLE_REVALIDATION_SECONDS = 30;

function parseRevalidation(
  value: string | undefined,
  fallback: number,
  maximum: number
) {
  const configured = Number(value ?? fallback);

  return Number.isFinite(configured)
    ? Math.min(Math.max(configured, 1), maximum)
    : fallback;
}

export function getExperimentCachePolicy(
  env: {
    [key: string]: string | undefined;
    NEXT_PUBLIC_REVALIDATE_SECONDS?: string;
    EXPERIMENTS_UNAVAILABLE_REVALIDATE_SECONDS?: string;
  } = process.env
) {
  return {
    dataRevalidationSeconds: parseRevalidation(
      env.NEXT_PUBLIC_REVALIDATE_SECONDS,
      DEFAULT_DATA_REVALIDATION_SECONDS,
      86400
    ),
    unavailableRevalidationSeconds: parseRevalidation(
      env.EXPERIMENTS_UNAVAILABLE_REVALIDATE_SECONDS,
      DEFAULT_UNAVAILABLE_REVALIDATION_SECONDS,
      60
    ),
  };
}
