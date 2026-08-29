/**
 * API layer — ambil data dari WPGraphQL, fallback ke seed saat WP kosong/gagal.
 * Semua fungsi hanya dipanggil di Server Components (RSC).
 */
import { unstable_cache } from "next/cache";
import {
  EXPERIMENTS_QUERY,
  POSTS_QUERY,
  PROJECTS_QUERY,
  fetchGraphQL,
} from "./graphql";
import { SEED_POSTS, SEED_PROJECTS } from "./seed";
import { getExperimentCachePolicy } from "./experiment-cache-policy";
import type { BlogPost, Experiment, Project } from "@/types";

interface ProjectNode {
  id: string;
  slug: string;
  title: string;
  featuredImage?: { node?: { sourceUrl?: string } };
  projectFields?: {
    client?: string;
    year?: string;
    category?: string;
    role?: string;
    timeline?: string;
    description?: string;
    problem?: string;
    process?: { number?: string; title?: string; description?: string }[];
    stack?: { technology?: string }[];
    results?: { result?: string }[];
    stats?: { number?: string; label?: string }[];
    screenshots?: string[];
    liveUrl?: string;
  };
}

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

interface PostNode {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  featuredImage?: { node?: { sourceUrl?: string } };
  categories?: { nodes?: { name?: string }[] };
  tags?: { nodes?: { name?: string }[] };
}

function mapProject(n: ProjectNode): Project {
  const f = n.projectFields ?? {};
  return {
    id: n.id,
    slug: n.slug,
    title: n.title,
    client: f.client ?? n.title,
    year: f.year ?? "",
    category: (f.category ?? "academic") as Project["category"],
    role: f.role ?? "",
    timeline: f.timeline ?? "",
    description: f.description ?? "",
    problem: f.problem ?? "",
    process:
      f.process?.map((p) => ({
        number: p.number ?? "",
        title: p.title ?? "",
        description: p.description ?? "",
      })) ?? [],
    stack: f.stack?.map((s) => s.technology ?? "").filter(Boolean) ?? [],
    results:
      f.results?.map((r) => r.result ?? "").filter(Boolean) ?? [],
    stats:
      f.stats?.map((s) => ({
        number: s.number ?? "",
        label: s.label ?? "",
      })) ?? [],
    screenshots: f.screenshots ?? [],
    liveUrl: f.liveUrl ?? "",
    featuredImage: n.featuredImage?.node?.sourceUrl ?? "",
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

function mapPost(n: PostNode): BlogPost {
  return {
    id: n.id,
    slug: n.slug,
    title: n.title,
    date: n.date,
    category: n.categories?.nodes?.[0]?.name ?? "Blog",
    excerpt: n.excerpt?.replace(/<[^>]*>/g, "") ?? "",
    content: "",
    featuredImage: n.featuredImage?.node?.sourceUrl ?? "",
    tags: n.tags?.nodes?.map((t) => t.name ?? "").filter(Boolean) ?? [],
    readingMinutes: 0,
  };
}

export async function getProjects(): Promise<Project[]> {
  try {
    const data = await fetchGraphQL<{ projects: { nodes: ProjectNode[] } }>(
      PROJECTS_QUERY
    );
    const nodes = data?.projects?.nodes ?? [];
    return nodes.length > 0 ? nodes.map(mapProject) : SEED_PROJECTS;
  } catch {
    return SEED_PROJECTS;
  }
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

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const data = await fetchGraphQL<{ posts: { nodes: PostNode[] } }>(
      POSTS_QUERY
    );
    const nodes = data?.posts?.nodes ?? [];
    return nodes.length > 0 ? nodes.map(mapPost) : SEED_POSTS;
  } catch {
    return SEED_POSTS;
  }
}

export async function getProject(slug: string): Promise<Project | undefined> {
  try {
    const data = await fetchGraphQL<{ projects: { nodes: ProjectNode[] } }>(
      PROJECTS_QUERY
    );
    const found = data?.projects?.nodes?.find((n) => n.slug === slug);
    if (found) return mapProject(found);
  } catch {
    // fallback ke seed di bawah
  }
  return SEED_PROJECTS.find((p) => p.slug === slug);
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const data = await fetchGraphQL<{ posts: { nodes: PostNode[] } }>(POSTS_QUERY);
    const found = data?.posts?.nodes?.find((n) => n.slug === slug);
    if (found) return mapPost(found);
  } catch {
    // fallback ke seed di bawah
  }
  return SEED_POSTS.find((p) => p.slug === slug);
}
