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

test("homepage embeds the audience selector in the Hero reading order", async () => {
  const page = await source("src/app/[locale]/page.tsx");
  const heroIndex = page.indexOf("<Hero />");
  const projectsIndex = page.indexOf("<ProjectsSection />");

  assert.ok(heroIndex >= 0);
  assert.ok(projectsIndex > heroIndex);
  assert.equal((page.match(/PathSwitcher/g) ?? []).length, 0);

  const hero = await source("src/components/sections/hero.tsx");
  const headingIndex = hero.indexOf("<h1");
  const descriptionIndex = hero.indexOf('t("hero.sub")');
  const selectorIndex = hero.indexOf("<PathSwitcher />");
  const ctaIndex = hero.indexOf(
    'className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"'
  );
  const statsIndex = hero.indexOf("content.stats.map");

  assert.ok(headingIndex >= 0);
  assert.ok(descriptionIndex > headingIndex);
  assert.ok(selectorIndex > descriptionIndex);
  assert.ok(ctaIndex > selectorIndex);
  assert.ok(statsIndex > ctaIndex);
  assert.equal((hero.match(/<PathSwitcher \/>/g) ?? []).length, 1);
  assert.equal((hero.match(/<h1\b/g) ?? []).length, 1);
  assert.match(hero, /role="status"/);
  assert.match(hero, /aria-live="polite"/);
  assert.match(hero, /factStatus/);
});

test("audience selector preserves state, labels, selected cue, and touch sizing", async () => {
  const provider = await source("src/components/providers/audience-provider.tsx");
  const switcher = await source("src/components/sections/path-switcher.tsx");
  const hero = await source("src/components/sections/hero.tsx");

  assert.match(provider, /useState<AudiencePath>\("neutral"\)/);
  assert.match(switcher, /const active = path === key/);
  assert.match(switcher, /setPath\(key\)/);
  assert.match(switcher, /setPath\("neutral"\)/);
  assert.match(switcher, /aria-pressed=\{active\}/);
  assert.match(switcher, /aria-describedby=\{descriptionId\}/);
  assert.match(switcher, /id=\{descriptionId\} className="sr-only"/);
  assert.match(switcher, /pathSwitcher\.selected/);
  assert.match(switcher, /<Check className=/);
  assert.match(switcher, /min-h-11 w-full/);
  assert.match(switcher, /min-h-11 min-w-11/);
  assert.match(switcher, /data\.label/);
  assert.match(switcher, /data\.focus/);
  assert.match(hero, /path === "freelance"/);
  assert.match(hero, /path === "fulltime"/);
});

test("EN and ID message trees remain key-complete for the homepage selector", async () => {
  const en = JSON.parse(await source("src/i18n/messages/en.json"));
  const id = JSON.parse(await source("src/i18n/messages/id.json"));

  function assertMatchingKeys(enValue, idValue, path = "messages") {
    assert.deepEqual(
      Object.keys(idValue).sort(),
      Object.keys(enValue).sort(),
      path
    );

    for (const key of Object.keys(enValue)) {
      const nextPath = `${path}.${key}`;
      if (enValue[key] && typeof enValue[key] === "object" && !Array.isArray(enValue[key])) {
        assertMatchingKeys(enValue[key], idValue[key], nextPath);
      }
    }
  }

  assertMatchingKeys(en, id);
  assert.equal(typeof en.pathSwitcher.selected, "string");
  assert.equal(typeof id.pathSwitcher.selected, "string");
  assert.equal(typeof en.pathSwitcher.freelance.label, "string");
  assert.equal(typeof id.pathSwitcher.fulltime.label, "string");
});

test("mobile navigation and CV dialog define modal keyboard contracts", async () => {
  const mobileNav = await source("src/components/layout/mobile-nav.tsx");
  const header = await source("src/components/layout/header.tsx");
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
  assert.match(mobileNav, /import \{ ThemeToggle \} from "@\/components\/ui\/theme-toggle"/);
  const menuStart = mobileNav.indexOf("const menu = (");
  const menuSource = mobileNav.slice(menuStart, mobileNav.indexOf("\n  return (", menuStart));
  assert.match(menuSource, /role="dialog"[\s\S]*<ThemeToggle \/>/);
  assert.match(menuSource, /<ThemeToggle \/>[\s\S]*<LanguageSwitcher \/>/);
  assert.match(mobileNav, /dialog\.querySelectorAll<HTMLElement>\(focusableSelector\)/);
  assert.match(header, /<div className="flex items-center gap-3 lg:hidden">\s*<ThemeToggle \/>/);

  const themeToggle = await source("src/components/ui/theme-toggle.tsx");
  const languageSwitcher = await source("src/components/ui/language-switcher.tsx");
  assert.match(themeToggle, /role="group"/);
  assert.match(themeToggle, /aria-label=\{t\("theme\.label"\)\}/);
  assert.match(themeToggle, /aria-label=\{t\("theme\.dark"\)\}/);
  assert.match(themeToggle, /aria-label=\{t\("theme\.light"\)\}/);
  assert.match(themeToggle, /aria-pressed=\{theme === "dark"\}/);
  assert.match(themeToggle, /aria-pressed=\{theme === "light"\}/);
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
