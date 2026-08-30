import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function source(relativePath) {
  return readFile(resolve(root, relativePath), "utf8");
}

test("all page routes expose the shared skip-link target", async () => {
  const header = await source("src/components/layout/header.tsx");
  assert.match(header, /href="#main-content"/);
  assert.match(header, /skipToContent/);

  const pages = [
    "src/app/[locale]/page.tsx",
    "src/app/[locale]/about/page.tsx",
    "src/app/[locale]/projects/page.tsx",
    "src/app/[locale]/blog/page.tsx",
    "src/app/[locale]/experiments/page.tsx",
    "src/app/[locale]/contact/page.tsx",
    "src/app/[locale]/projects/[slug]/page.tsx",
    "src/app/[locale]/blog/[slug]/page.tsx",
    "src/app/[locale]/experiments/[slug]/page.tsx",
    "src/app/[locale]/experiments/error.tsx",
  ];

  for (const page of pages) {
    assert.match(await source(page), /<main id="main-content" tabIndex=\{-1\}/, page);
  }
});

test("homepage and reusable disclosures use a single semantic heading and native relationships", async () => {
  const hero = await source("src/components/sections/hero.tsx");
  assert.equal((hero.match(/<h1\b/g) ?? []).length, 1);

  const accordion = await source("src/components/ui/accordion.tsx");
  assert.match(accordion, /aria-controls=\{panelId\}/);
  assert.match(accordion, /aria-labelledby=\{triggerId\}/);
  assert.match(accordion, /hidden=\{!open\}/);
  assert.match(accordion, /useId/);
});

test("mobile navigation and CV dialog define modal keyboard contracts", async () => {
  const mobileNav = await source("src/components/layout/mobile-nav.tsx");
  assert.match(mobileNav, /aria-expanded=\{open\}/);
  assert.match(mobileNav, /aria-controls=\{menuId\}/);
  assert.match(mobileNav, /role="dialog"/);
  assert.match(mobileNav, /event\.key === "Escape"/);
  assert.match(mobileNav, /event\.key !== "Tab"/);
  assert.match(mobileNav, /createPortal\(menu, document\.body\)/);
  assert.match(mobileNav, /z-\[70\]/);
  assert.match(mobileNav, /overflow-y-auto/);
  assert.match(mobileNav, /document\.body\.style\.overflow = "hidden"/);
  assert.match(mobileNav, /h-11 w-11/);

  const themeToggle = await source("src/components/ui/theme-toggle.tsx");
  const languageSwitcher = await source("src/components/ui/language-switcher.tsx");
  assert.match(themeToggle, /h-11 w-11/);
  assert.match(languageSwitcher, /min-h-11 min-w-11/);

  const cvModal = await source("src/components/ui/cv-modal.tsx");
  assert.match(cvModal, /role="dialog"/);
  assert.match(cvModal, /aria-modal="true"/);
  assert.match(cvModal, /aria-labelledby=\{titleId\}/);
  assert.match(cvModal, /event\.key === "Escape"/);
  const provider = await source("src/components/providers/cv-provider.tsx");
  assert.match(provider, /openerRef/);
  assert.match(provider, /\.focus\(\)/);
});

test("CMS unavailable state exposes a bounded, accessible refresh action", async () => {
  const state = await source("src/components/ui/cms-collection-state.tsx");
  assert.match(state, /"use client"/);
  assert.match(state, /router\.refresh\(\)/);
  assert.match(state, /useTransition/);
  assert.match(state, /disabled=\{isPending\}/);
  assert.match(state, /aria-busy=\{isPending\}/);
  assert.match(state, /aria-live="polite"/);

  const en = await source("src/i18n/messages/en.json");
  const id = await source("src/i18n/messages/id.json");
  assert.match(en, /"retry": "Try again"/);
  assert.match(id, /"retry": "Coba lagi"/);
});

test("reusable images and motion preferences retain accessible fallbacks", async () => {
  const safeImage = await source("src/components/ui/safe-image.tsx");
  assert.match(safeImage, /role="img"/);
  assert.match(safeImage, /aria-label=\{alt\}/);

  const css = await source("src/app/globals.css");
  assert.match(css, /\.animate-pulse\s*\{\s*animation: none !important;/s);
  assert.match(css, /\.skip-link:focus/);
  assert.match(css, /forced-colors: active/);
});
