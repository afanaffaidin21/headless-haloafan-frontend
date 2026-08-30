/**
 * API layer — ambil data publik dari WPGraphQL.
 * Semua fungsi hanya dipanggil di Server Components (RSC).
 */
import { unstable_cache } from "next/cache";
import {
  EXPERIMENTS_QUERY,
  POSTS_QUERY,
  PROJECTS_QUERY,
  fetchGraphQL,
} from "./graphql";
import { getExperimentCachePolicy } from "./experiment-cache-policy";
import {
  CMS_COLLECTION_CACHE_KEYS,
  resolveCmsCollection,
  type CmsCollectionResult,
} from "./cms-collection";
import {
  isValidPost,
  isValidProject,
  mapPost,
  mapProject,
  sortPostsByDate,
  type PostNode,
  type ProjectNode,
} from "./content-mapping";
import type { BlogPost, Experiment, Project } from "@/types";

interface ExperimentNode {
  id: string;
  slug: string;
  title: string;
  experimentFields?: {
    index?: string;
    description?: string;
    tags?: { tag?: string }[];
  };
}

function mapExperiment(n: ExperimentNode): Experiment {
  const f = n.experimentFields ?? {};
  return {
    id: n.id,
    slug: n.slug,
    title: n.title,
    index: f.index ?? "",
    description: f.description ?? "",
    tags: f.tags?.map((t) => t.tag ?? "").filter(Boolean) ?? [],
  };
}

function isPublishedExperiment(experiment: Experiment): boolean {
  return Boolean(
    experiment.id.trim() &&
      experiment.slug.trim() &&
      experiment.title.trim() &&
      experiment.index.trim() &&
      experiment.description.trim()
  );
}

export interface ExperimentsResult {
  experiments: Experiment[];
  status: "available" | "empty" | "unavailable";
}

const {
  dataRevalidationSeconds,
  unavailableRevalidationSeconds,
} = getExperimentCachePolicy();

// Cache only successful CMS responses (including a genuinely empty collection).
// If revalidation throws, Next's data cache keeps serving the last successful
// snapshot instead of replacing it with an outage-shaped empty result.
const getCachedPublishedExperiments = unstable_cache(
  async (): Promise<Experiment[]> => {
    const data = await fetchGraphQL<{
      experiments: { nodes: ExperimentNode[] };
    }>(EXPERIMENTS_QUERY, undefined, { cache: "no-store" });
    const nodes = data?.experiments?.nodes ?? [];
    return nodes.map(mapExperiment).filter(isPublishedExperiment);
  },
  ["published-experiments-data-v2"],
  { revalidate: dataRevalidationSeconds }
);

// A cold-start outage is cached separately and briefly. This shared guard also
// prevents invalid detail slugs from causing one CMS request per route hit.
const getCachedExperimentsResult = unstable_cache(
  async (): Promise<ExperimentsResult> => {
    try {
      const experiments = await getCachedPublishedExperiments();
      return {
        experiments,
        status: experiments.length > 0 ? "available" : "empty",
      };
    } catch {
      return { experiments: [], status: "unavailable" };
    }
  },
  ["published-experiments-availability-v2"],
  { revalidate: unavailableRevalidationSeconds }
);

let lastKnownExperiments: Experiment[] | undefined;

export async function getExperimentsResult(): Promise<ExperimentsResult> {
  const result = await getCachedExperimentsResult();

  if (result.status !== "unavailable") {
    lastKnownExperiments = result.experiments;
    return result;
  }

  if (lastKnownExperiments !== undefined) {
    return {
      experiments: lastKnownExperiments,
      status: lastKnownExperiments.length > 0 ? "available" : "empty",
    };
  }

  return result;
}

export async function getExperiments(): Promise<Experiment[]> {
  const { experiments } = await getExperimentsResult();
  return experiments;
}

export async function getExperiment(
  slug: string
): Promise<Experiment | undefined> {
  const experiments = await getExperiments();
  return experiments.find((experiment) => experiment.slug === slug);
}

export type ProjectsResult = CmsCollectionResult<Project>;
export type PostsResult = CmsCollectionResult<BlogPost>;

const getCachedPublishedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const data = await fetchGraphQL<{
      projects: { nodes: ProjectNode[] };
    }>(PROJECTS_QUERY, undefined, { cache: "no-store" });
    return (data?.projects?.nodes ?? [])
      .map(mapProject)
      .filter(isValidProject);
  },
  [CMS_COLLECTION_CACHE_KEYS.projects],
  { revalidate: dataRevalidationSeconds }
);

let lastKnownProjects: Project[] | undefined;

export async function getProjectsResult(): Promise<ProjectsResult> {
  try {
    const projects = await getCachedPublishedProjects();
    const result = {
      items: projects,
      status: projects.length > 0 ? ("available" as const) : ("empty" as const),
    };
    lastKnownProjects = projects;
    return result;
  } catch {
    // Next's Data Cache serves the previous successful value when stale
    // revalidation throws. This local value is only a same-process safeguard
    // for cold-start failures and is never the production source of content.
    return resolveCmsCollection(
      { items: [], status: "unavailable" },
      lastKnownProjects
    );
  }
}

export async function getProjects(): Promise<Project[]> {
  return (await getProjectsResult()).items;
}

export async function getProjectResult(slug: string): Promise<{
  project: Project | undefined;
  status: ProjectsResult["status"];
}> {
  const result = await getProjectsResult();
  return {
    project: result.items.find((project) => project.slug === slug),
    status: result.status,
  };
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjectResult(slug)).project;
}

const getCachedPublishedPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const data = await fetchGraphQL<{
      posts: { nodes: PostNode[] };
    }>(POSTS_QUERY, undefined, { cache: "no-store" });
    return sortPostsByDate(
      (data?.posts?.nodes ?? []).map(mapPost).filter(isValidPost)
    );
  },
  [CMS_COLLECTION_CACHE_KEYS.blog],
  { revalidate: dataRevalidationSeconds }
);

let lastKnownPosts: BlogPost[] | undefined;

export async function getPostsResult(): Promise<PostsResult> {
  try {
    const posts = await getCachedPublishedPosts();
    const result = {
      items: posts,
      status: posts.length > 0 ? ("available" as const) : ("empty" as const),
    };
    lastKnownPosts = posts;
    return result;
  } catch {
    // Keep a previous snapshot during a cold-start failure in this process;
    // normal cross-instance stale-on-error behavior is provided by the shared
    // Next Data Cache entry above.
    return resolveCmsCollection(
      { items: [], status: "unavailable" },
      lastKnownPosts
    );
  }
}

export async function getPosts(): Promise<BlogPost[]> {
  return (await getPostsResult()).items;
}

export async function getPostResult(slug: string): Promise<{
  post: BlogPost | undefined;
  status: PostsResult["status"];
}> {
  const result = await getPostsResult();
  return {
    post: result.items.find((post) => post.slug === slug),
    status: result.status,
  };
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  return (await getPostResult(slug)).post;
}
