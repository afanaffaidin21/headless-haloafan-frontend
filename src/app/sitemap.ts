import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getExperiments, getPosts, getProjects } from "@/lib/api";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://haloafan.com";

function localize(path: string, locale: string) {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, experiments, posts] = await Promise.all([
    getProjects(),
    getExperiments(),
    getPosts(),
  ]);

  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "monthly" as const },
    { path: "/projects", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/experiments", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}${localize(route.path, locale)}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }

    for (const project of projects) {
      entries.push({
        url: `${baseUrl}${localize(`/projects/${project.slug}`, locale)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const experiment of experiments) {
      entries.push({
        url: `${baseUrl}${localize(`/experiments/${experiment.slug}`, locale)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    for (const post of posts) {
      entries.push({
        url: `${baseUrl}${localize(`/blog/${post.slug}`, locale)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}