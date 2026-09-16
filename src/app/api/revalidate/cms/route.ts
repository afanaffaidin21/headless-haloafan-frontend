import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { CMS_CACHE_TAGS } from "@/lib/cms-collection";

export const runtime = "nodejs";

type CmsScope = keyof typeof CMS_CACHE_TAGS | "all";

const PAGE_PATHS: Record<CmsScope, readonly string[]> = {
  all: [
    "/",
    "/id",
    "/projects",
    "/id/projects",
    "/experiments",
    "/id/experiments",
    "/blog",
    "/id/blog",
  ],
  experiments: ["/", "/id", "/experiments", "/id/experiments"],
  projects: ["/", "/id", "/projects", "/id/projects"],
  blog: ["/", "/id", "/blog", "/id/blog"],
};

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function getProvidedSecret(request: NextRequest) {
  const authorization = request.headers.get("authorization")?.trim();
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice("bearer ".length).trim();
  }

  return request.headers.get("x-cms-revalidate-secret")?.trim() ?? "";
}

function getScope(value: unknown): CmsScope {
  if (typeof value !== "string") return "all";

  const normalized = value.trim().toLowerCase();
  if (normalized === "experiment" || normalized === "experiments") {
    return "experiments";
  }
  if (normalized === "project" || normalized === "projects") {
    return "projects";
  }
  if (normalized === "blog" || normalized === "post" || normalized === "posts") {
    return "blog";
  }
  return "all";
}

function getRequestedScope(payload: unknown): CmsScope {
  if (!payload || typeof payload !== "object") return "all";

  const record = payload as Record<string, unknown>;
  const value = [record.scope, record.postType, record.post_type, record.type].find(
    (candidate) => typeof candidate === "string"
  );

  return getScope(value);
}

function invalidateCmsScope(scope: CmsScope) {
  const tags =
    scope === "all" ? Object.values(CMS_CACHE_TAGS) : [CMS_CACHE_TAGS[scope]];

  for (const tag of tags) {
    // expire: 0 makes webhook-triggered invalidation blocking on the next
    // visit, so the first request after the CMS save reads fresh data.
    revalidateTag(tag, { expire: 0 });
  }

  for (const path of PAGE_PATHS[scope]) {
    revalidatePath(path);
  }

  return tags;
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.CMS_REVALIDATE_SECRET?.trim();
  if (!expectedSecret) {
    return json(
      { revalidated: false, message: "CMS revalidation is not configured" },
      503
    );
  }

  if (getProvidedSecret(request) !== expectedSecret) {
    return json({ revalidated: false, message: "Unauthorized" }, 401);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    payload = undefined;
  }

  const scope = getRequestedScope(payload);
  const tags = invalidateCmsScope(scope);

  return json({
    revalidated: true,
    scope,
    tags,
    revalidatedAt: new Date().toISOString(),
  });
}
