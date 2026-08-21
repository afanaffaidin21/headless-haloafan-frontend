const API_URL = process.env.WORDPRESS_API_URL ?? "https://haloafan.com/graphql";

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE_SECONDS ?? 300),
    },
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
          screenshots
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
        experimentFields {
          index
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
        excerpt
        featuredImage { node { sourceUrl } }
        categories { nodes { name } }
        tags { nodes { name } }
      }
    }
  }
`;