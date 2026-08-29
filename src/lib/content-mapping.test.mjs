import assert from "node:assert/strict";
import test from "node:test";

import {
  isValidPost,
  isValidProject,
  mapPost,
  mapProject,
  sortPostsByDate,
} from "./content-mapping.ts";

const projectNodes = [
  {
    id: "project-1",
    slug: "menulis-id",
    title: "MENULIS.ID",
    projectFields: {
      description: "CMS description one",
      problem: "CMS problem one",
      category: ["blogging"],
      process: [{ number: "01", title: "CMS process", description: null }],
    },
  },
  {
    id: "project-2",
    slug: "karyapratama-packaging",
    title: "Karyapratama Packaging",
    projectFields: {
      description: "CMS description two",
      problem: "CMS problem two",
      category: ["company-profile"],
    },
  },
];

test("a CMS project snapshot produces exactly its valid published nodes", () => {
  const projects = projectNodes.map(mapProject).filter(isValidProject);
  assert.equal(projects.length, 2);
  assert.deepEqual(projects.map((project) => project.slug), [
    "menulis-id",
    "karyapratama-packaging",
  ]);
  assert.equal(projects[0].description, "CMS description one");
  assert.equal(projects[0].problem, "CMS problem one");
  assert.notEqual(projects[0].description, projects[1].description);
});

test("invalid project nodes do not become detail pages", () => {
  const invalid = mapProject({ id: "", slug: "", title: "", projectFields: {} });
  assert.equal(isValidProject(invalid), false);
  assert.equal(projectNodes.some((node) => node.slug === "universitas-sunan-gresik"), false);
});

const postNodes = [
  ["one", "2026-05-21T04:54:19", "<p>Post one body.</p>"],
  ["two", "2026-05-20T06:55:00", "<p>Post two body.</p>"],
  ["three", "2026-05-19T03:48:39", "<p>Post three body.</p>"],
  ["four", "2026-05-18T05:54:49", "<p>Post four body.</p>"],
].map(([slug, date, content], index) => ({
  id: `post-${index}`,
  slug,
  title: `Title ${slug}`,
  date,
  content,
  excerpt: `<p>Excerpt ${slug}</p>`,
}));

test("CMS posts sort by publication date and latest three can be selected", () => {
  const posts = sortPostsByDate(postNodes.map(mapPost).filter(isValidPost));
  assert.deepEqual(posts.slice(0, 3).map((post) => post.slug), ["one", "two", "three"]);
  assert.equal(posts.length, 4);
  assert.notEqual(posts[0].content, posts[1].content);
  assert.notEqual(posts[0].readingMinutes, 0);
});
