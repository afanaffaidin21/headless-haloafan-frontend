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

test("Next.js owns one document root and the locale layout remains non-document", async () => {
  const rootLayout = await source("src/app/layout.tsx");
  const localeLayout = await source("src/app/[locale]/layout.tsx");

  assert.equal((rootLayout.match(/<html\b/g) ?? []).length, 1);
  assert.equal((rootLayout.match(/<body\b/g) ?? []).length, 1);
  assert.match(rootLayout, /getLocale/);
  assert.match(rootLayout, /lang=\{locale\}/);
  assert.doesNotMatch(rootLayout, /getMessages|NextIntlClientProvider|<JsonLd/);
  assert.doesNotMatch(localeLayout, /<html\b|<body\b/);
  assert.match(localeLayout, /setRequestLocale\(supportedLocale\)/);
  assert.match(localeLayout, /getMessages\(\{ locale: supportedLocale \}\)/);
  assert.match(localeLayout, /<NextIntlClientProvider locale=\{supportedLocale\} messages=\{messages\}>/);
  assert.match(localeLayout, /<JsonLd/);
  assert.match(localeLayout, /<LocaleDocumentSync \/>/);
  assert.match(localeLayout, /notFound\(\)/);
});

test("locale document synchronization and navigation preserve the active route", async () => {
  const sync = await source("src/components/providers/locale-document-sync.tsx");
  const switcher = await source("src/components/ui/language-switcher.tsx");

  assert.match(sync, /useLocale/);
  assert.match(sync, /document\.documentElement\.lang = locale/);
  assert.match(sync, /useLayoutEffect/);
  assert.match(switcher, /getPathname\(\{[\s\S]*forcePrefix: true/);
  assert.match(switcher, /window\.location\.replace\(/);
  assert.match(switcher, /window\.location\.search/);
  assert.match(switcher, /window\.location\.hash/);
  assert.doesNotMatch(switcher, /router\.replace|router\.push/);
});

test("Next 16 locale proxy preserves unprefixed English and prefixed Indonesian routes", async () => {
  const routing = await source("src/i18n/routing.ts");
  const proxy = await source("src/proxy.ts");

  assert.match(routing, /defaultLocale:\s*["']en["']/);
  assert.match(routing, /localePrefix:\s*["']as-needed["']/);
  assert.match(proxy, /export default function proxy\(request: NextRequest\)/);
  assert.match(proxy, /createMiddleware\(routing\)/);
  assert.match(proxy, /x-haloafan-locale-rewrite/);
  assert.match(proxy, /x-next-intl-locale/);
  assert.match(proxy, /NextResponse\.next\(\{ request: \{ headers \} \}\)/);
  assert.doesNotMatch(proxy, /redirect\(/);
  await assert.rejects(
    readFile(resolve(root, "middleware.ts")),
    (error) => error?.code === "ENOENT",
  );
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
  assert.match(switcher, /id=\{descriptionId\}/);
  assert.match(switcher, /className="sr-only xl:not-sr-only/);
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
  assert.equal((header.match(/<ThemeToggle \/>/g) ?? []).length, 1);
  const desktopNavIndex = header.indexOf('<nav aria-label={t("nav.label")}');
  const themeToggleIndex = header.indexOf("<ThemeToggle />");
  const mobileNavIndex = header.indexOf("<MobileNav");
  assert.ok(themeToggleIndex > desktopNavIndex);
  assert.ok(themeToggleIndex < mobileNavIndex);
  assert.match(header, /<div className="flex items-center lg:hidden">\s*<MobileNav/);
  assert.doesNotMatch(header.slice(header.indexOf("{/* Mobile nav */")), /<ThemeToggle \/>/);

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
  assert.match(css, /\.path-switcher-option\s*\{\s*transform: none !important;\s*transition: none !important;/s);
  assert.match(css, /\.skip-link:focus/);
  assert.match(css, /forced-colors: active/);
});

test("responsive Hero keeps linear tablet flow and reserves the desktop decision column", async () => {
  const hero = await source("src/components/sections/hero.tsx");
  const switcher = await source("src/components/sections/path-switcher.tsx");

  assert.match(hero, /xl:grid-cols-\[minmax\(0,1\.65fr\)_minmax\(18rem,1fr\)\]/);
  assert.match(hero, /xl:col-start-2 xl:row-start-1 xl:row-span-2/);
  assert.match(hero, /xl:flex xl:justify-center xl:px-4/);
  assert.match(hero, /xl:col-start-1 xl:row-start-2/);
  assert.doesNotMatch(hero, /lg:grid-cols/);
  assert.match(switcher, /w-full min-w-0 border-0 p-0 xl:max-w-\[720px\] xl:border xl:border-line xl:bg-panel xl:p-5/);
  assert.match(switcher, /min-\[480px\]:grid-cols-2 xl:grid-cols-1/);
  assert.match(switcher, /xl:not-sr-only xl:mt-3 xl:block xl:min-h-14/);
  assert.match(switcher, /transition-\[background-color,border-color,box-shadow,transform\]/);
  assert.match(switcher, /duration-150 ease-out/);
  assert.match(switcher, /motion-reduce:transform-none motion-reduce:transition-none/);
  assert.match(switcher, /firstOptionRef = useRef<HTMLButtonElement>\(null\)/);
  assert.match(switcher, /requestAnimationFrame\(\(\) => firstOptionRef\.current\?\.focus\(\)\)/);
  assert.match(switcher, /ref={key === "freelance" \? firstOptionRef : undefined}/);
});

test("About and FAQ preserve narrow order while distributing desktop content", async () => {
  const about = await source("src/components/sections/about-teaser.tsx");
  const faq = await source("src/components/sections/faq-section.tsx");
  const facts = await source("src/components/ui/quick-facts.tsx");

  assert.match(about, /mx-auto flex w-full flex-col gap-14 xl:grid xl:max-w-\[1600px\]/);
  assert.match(about, /xl:grid-cols-\[minmax\(0,320px\)_minmax\(0,1fr\)_minmax\(17\.5rem,340px\)\]/);
  assert.doesNotMatch(about, /lg:flex-row/);
  assert.match(about, /max-w-\[640px\]/);
  assert.match(facts, /max-w-\[340px\] self-start/);

  assert.match(faq, /mx-auto grid w-full grid-cols-1 gap-y-12 xl:max-w-\[1400px\]/);
  assert.match(faq, /xl:grid-cols-\[minmax\(0,800px\)_minmax\(20rem,420px\)\]/);
  assert.match(faq, /xl:justify-center xl:gap-x-24/);
  assert.match(faq, /xl:col-start-1 xl:row-start-1/);
  assert.match(faq, /max-w-\[800px\] xl:col-start-1 xl:row-start-2/);
  assert.match(faq, /xl:col-start-2 xl:row-start-2/);
  assert.doesNotMatch(faq, /lg:flex-row/);
  assert.match(faq, /max-w-\[420px\] self-start justify-self-start/);
  assert.match(faq, /xl:justify-self-start/);
});
