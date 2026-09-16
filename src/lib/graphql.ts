const API_URL =
  process.env.WORDPRESS_API_URL ?? "https://cms.haloafan.com/graphql";

const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 350;
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

function getRequestTimeout() {
  const configured = Number(process.env.WORDPRESS_API_TIMEOUT_MS ?? 15000);

  if (!Number.isFinite(configured)) {
    return 15000;
  }

  return Math.min(Math.max(configured, 1000), 30000);
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  return (
    error.name === "AbortError" ||
    error.name === "TimeoutError" ||
    error.name === "TypeError" ||
    /^GraphQL request failed: (408|425|429|500|502|503|504)$/.test(error.message)
  );
}

function waitBeforeRetry() {
  return new Promise<void>((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
}

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { cache?: RequestCache }
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
        ...(options?.cache === "no-store"
          ? { cache: "no-store" as const }
          : {
              next: {
                revalidate: Number(
                  process.env.NEXT_PUBLIC_REVALIDATE_SECONDS ?? 30
                ),
              },
            }),
        signal: AbortSignal.timeout(getRequestTimeout()),
      });

      if (!res.ok) {
        const error = new Error(`GraphQL request failed: ${res.status}`);
        if (!RETRYABLE_STATUS_CODES.has(res.status) || attempt === MAX_ATTEMPTS - 1) {
          throw error;
        }
        throw error;
      }

      const json = (await res.json()) as { data?: T; errors?: unknown };
      if (json.errors && json.data == null) {
        throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
      }
      if (json.data == null) {
        throw new Error("GraphQL response contained no data");
      }

      return json.data;
    } catch (error) {
      lastError = error;
      if (attempt === MAX_ATTEMPTS - 1 || !isRetryableError(error)) {
        throw error;
      }
      await waitBeforeRetry();
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("GraphQL request failed");
}

export const PROJECTS_QUERY = /* GraphQL */ `
  query Projects {
    projects {
      nodes {
        id
        slug
        title
        excerpt
        featuredImage { node { sourceUrl } }
        projectFields {
          client
          year
          category
          role
          timeline
          description
          problem
          process {
            number
            title
            description
          }
          stack { technology }
          results { result }
          stats { number label }
          screenshots { nodes { sourceUrl } }
          liveUrl
        }
      }
    }
  }
`;

export const EXPERIMENTS_QUERY = /* GraphQL */ `
  query Experiments {
    experiments {
      nodes {
        id
        slug
        title
        featuredImage { node { sourceUrl altText } }
        terms { nodes { name slug taxonomyName } }
        experimentFields {
          description
          tags { tag }
        }
        experimentInformation {
          urlDevelopmentDesign
        }
      }
    }
  }
`;

export const POSTS_QUERY = /* GraphQL */ `
  query Posts {
    posts {
      nodes {
        id
        slug
        title
        date
        modified
        excerpt
        content
        featuredImage { node { sourceUrl } }
        categories { nodes { name } }
        tags { nodes { name } }
      }
    }
  }
`;
