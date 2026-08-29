import type { BlogPost, Project } from "../types/index.ts";
import {
  calculateReadingMinutes,
  deriveExcerpt,
  sanitizeCmsHtml,
} from "./cms-content.ts";

export interface ProjectNode {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: { node?: { sourceUrl?: string } | null } | null;
  projectFields?: {
    client?: string | null;
    year?: string | null;
    category?: string | string[] | null;
    role?: string | null;
    timeline?: string | null;
    description?: string | null;
    problem?: string | null;
    process?:
      | { number?: string | null; title?: string | null; description?: string | null }[]
      | null;
    stack?: { technology?: string | null }[] | null;
    results?: { result?: string | null }[] | null;
    stats?: { number?: string | null; label?: string | null }[] | null;
    screenshots?: { nodes?: { sourceUrl?: string | null }[] | null } | null;
    liveUrl?: string | null;
  } | null;
}

export interface PostNode {
  id: string;
  slug: string;
  title: string;
  date: string;
  modified?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: { node?: { sourceUrl?: string } | null } | null;
  categories?: { nodes?: { name?: string | null }[] | null } | null;
  tags?: { nodes?: { name?: string | null }[] | null } | null;
}

function normalizeCategory(category: string | string[] | null | undefined): string {
  return (Array.isArray(category) ? category[0] : category) ?? "";
}

export function mapProject(n: ProjectNode): Project {
  const f = n.projectFields ?? {};
  return {
    id: n.id,
    slug: n.slug,
    title: n.title,
    client: f.client ?? n.title,
    year: f.year ?? "",
    category: normalizeCategory(f.category),
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
    results: f.results?.map((r) => r.result ?? "").filter(Boolean) ?? [],
    stats:
      f.stats
        ?.map((s) => ({ number: s.number ?? "", label: s.label ?? "" }))
        .filter((s) => s.number || s.label) ?? [],
    screenshots:
      f.screenshots?.nodes?.map((s) => s.sourceUrl ?? "").filter(Boolean) ?? [],
    liveUrl: f.liveUrl ?? "",
    featuredImage: n.featuredImage?.node?.sourceUrl ?? "",
  };
}

export function mapPost(n: PostNode): BlogPost {
  const content = sanitizeCmsHtml(n.content ?? "");
  return {
    id: n.id,
    slug: n.slug,
    title: n.title,
    date: n.date,
    modified: n.modified ?? undefined,
    category: n.categories?.nodes?.[0]?.name ?? "Blog",
    excerpt: deriveExcerpt(n.excerpt, content),
    content,
    featuredImage: n.featuredImage?.node?.sourceUrl ?? "",
    tags: n.tags?.nodes?.map((t) => t.name ?? "").filter(Boolean) ?? [],
    readingMinutes: calculateReadingMinutes(content),
  };
}

export function isValidProject(project: Project): boolean {
  return Boolean(
    project.id.trim() &&
      project.slug.trim() &&
      project.title.trim() &&
      project.description.trim()
  );
}

export function isValidPost(post: BlogPost): boolean {
  return Boolean(
    post.id.trim() &&
      post.slug.trim() &&
      post.title.trim() &&
      post.date.trim() &&
      Number.isFinite(Date.parse(post.date)) &&
      post.content.trim()
  );
}

export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const difference = Date.parse(b.date) - Date.parse(a.date);
    return Number.isNaN(difference) ? 0 : difference;
  });
}
