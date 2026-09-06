const API_URL =
  process.env.WORDPRESS_API_URL ?? "https://cms.haloafan.com/graphql";

function getRequestTimeout() {
  const configured = Number(process.env.WORDPRESS_API_TIMEOUT_MS ?? 5000);

  if (!Number.isFinite(configured)) {
    return 5000;
  }

  return Math.min(Math.max(configured, 1000), 15000);
}

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { cache?: RequestCache }
): Promise<T> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    ...(options?.cache === "no-store"
      ? { cache: "no-store" as const }
      : {
          next: {
            revalidate: Number(
              process.env.NEXT_PUBLIC_REVALIDATE_SECONDS ?? 300
            ),
          },
        }),
    signal: AbortSignal.timeout(getRequestTimeout()),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
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
