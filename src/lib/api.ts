/**
 * API layer — ambil data dari WPGraphQL, fallback ke seed saat WP kosong/gagal.
 * Semua fungsi hanya dipanggil di Server Components (RSC).
 */
import {
  EXPERIMENTS_QUERY,
  POSTS_QUERY,
  PROJECTS_QUERY,
  fetchGraphQL,
} from "./graphql";
import {
  SEED_EXPERIMENTS,
  SEED_POSTS,
  SEED_PROJECTS,
} from "./seed";
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

export async function getExperiments(): Promise<Experiment[]> {
  try {
    const data = await fetchGraphQL<{
      experiments: { nodes: ExperimentNode[] };
    }>(EXPERIMENTS_QUERY);
    const nodes = data?.experiments?.nodes ?? [];
    return nodes.length > 0 ? nodes.map(mapExperiment) : SEED_EXPERIMENTS;
  } catch {
    return SEED_EXPERIMENTS;
  }
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
