import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getExperiments, getPosts, getProjects } from "@/lib/api";
import { isIndexableContent } from "@/lib/seo";
import { encodeSlug, getCanonicalUrl, localizedPath } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, experiments, posts] = await Promise.all([
    getProjects(),
    getExperiments(),
    getPosts(),
  ]);

  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "monthly" as const },
    { path: "/projects", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/experiments", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
  ];

  const indexableProjects = projects.filter((project) =>
    isIndexableContent(project, ["slug", "title", "description"])
  );
  const indexableExperiments = experiments.filter((experiment) =>
    isIndexableContent(experiment, ["slug", "title", "description"])
  );
  const indexablePosts = posts.filter((post) =>
    isIndexableContent(post, ["slug", "title", "excerpt", "date", "content"])
  );

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: getCanonicalUrl(localizedPath(route.path, locale)),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }

    for (const project of indexableProjects) {
      entries.push({
        url: getCanonicalUrl(
          localizedPath(`/projects/${encodeSlug(project.slug)}`, locale)
        ),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const experiment of indexableExperiments) {
      entries.push({
        url: getCanonicalUrl(
          localizedPath(`/experiments/${encodeSlug(experiment.slug)}`, locale)
        ),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    for (const post of indexablePosts) {
      entries.push({
        url: getCanonicalUrl(
          localizedPath(`/blog/${encodeSlug(post.slug)}`, locale)
        ),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
