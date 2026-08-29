import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  CodeXml,
  Zap,
  Wrench,
  ShieldCheck,
  Sparkles,
  Layers,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { CvDownloadButton } from "@/components/ui/cv-download-button";
import { SafeImage } from "@/components/ui/safe-image";
import { FinalCTA } from "@/components/ui/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import {
  SITE_CONFIG,
  SEED_FOCUS,
  SEED_EXPERIENCE,
  SEED_SKILLS,
  SEED_EDUCATION,
  SEED_ACHIEVEMENTS,
} from "@/lib/seed";
import { createPageMetadata } from "@/lib/seo";
import { getCanonicalUrl, localizedPath, SITE_URL } from "@/lib/site-url";

const PORTRAIT =
  "https://cms.haloafan.com/wp-content/uploads/2026/05/photo-portfolio-with-caption-820x1024.png";

const ICONS: Record<string, LucideIcon> = {
  "code-xml": CodeXml,
  zap: Zap,
  wrench: Wrench,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  layers: Layers,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return createPageMetadata({
    locale,
    path: "/about",
    title: t("heading"),
    description: t("sub"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: getCanonicalUrl(localizedPath("/about", locale)),
          name: t("heading"),
          description: t("sub"),
          inLanguage: locale === "id" ? "id-ID" : "en-US",
          about: { "@id": `${SITE_URL}/#person` },
        }}
      />
      <Header active="about" />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <PageHeader eyebrow="01" title={t("heading")} sub={t("sub")} />

        {/* Intro */}
        <section className="flex flex-col gap-16 px-6 pb-16 md:px-12 md:pb-24 lg:flex-row lg:items-start">
          <div className="flex w-full max-w-[380px] flex-col gap-3.5">
            <div className="relative h-[420px] overflow-hidden border border-line md:h-[470px]">
              <SafeImage
                src={PORTRAIT}
                alt={SITE_CONFIG.name}
                sizes="(max-width: 1023px) calc(100vw - 3rem), 380px"
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted">
                {SITE_CONFIG.name}
              </span>
              <span className="font-mono text-xs text-accent">Surabaya, ID</span>
            </div>
          </div>

          <div className="flex max-w-[700px] flex-1 flex-col gap-5">
            <p className="text-[19px] leading-[1.7] text-ink">
              I&apos;m Afan — a WordPress developer based in Surabaya,
              Indonesia, holding a Bachelor of Computer Science from Universitas
              Airlangga (GPA 3.34/4.00). My core focus is engineering stable,
              fast, secure, and easily maintainable web ecosystems.
            </p>
            <p className="text-[17px] leading-[1.7] text-muted">
              With experience resolving hundreds of support tickets at Onero
              Solutions and building for international agencies like We Are
              Social Singapore, I combine code craftsmanship with calm,
              methodical technical troubleshooting. I proactively leverage AI
              tools to accelerate copywriting, speed up bug analysis, and
              streamline documentation — without compromising human code
              standards.
            </p>
            <div className="grid grid-cols-2 gap-6 border-t border-line pt-6 md:flex">
              {[
                ["LOCATION", "Surabaya, ID"],
                ["EXPERIENCE", "5+ Years"],
                ["EDUCATION", "S.Kom UNAIR"],
                ["STATUS", t("status")],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex flex-1 flex-col gap-1.5 ${i > 0 ? "pl-8" : ""}`}
                >
                  <span className="font-mono text-[11px] tracking-wider text-muted">
                    {k}
                  </span>
                  <span className="text-sm font-medium text-ink">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Focus */}
        <section className="flex flex-col gap-7 px-6 pb-16 md:px-12 md:pb-24">
          <SectionHeader eyebrow="02" title={t("focusEyebrow")} />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SEED_FOCUS.map((f) => {
              const Icon = ICONS[f.icon] ?? Wrench;
              return (
                <div
                  key={f.title}
                  className="flex flex-col gap-3 border border-line bg-panel p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center border border-line bg-accent-dim">
                    <Icon className="h-[18px] w-[18px] text-accent" />
                  </span>
                  <h3 className="font-display text-[22px] text-ink">{f.title}</h3>
                  <p className="text-[14px] leading-relaxed text-muted">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Experience */}
        <section className="flex flex-col gap-7 px-6 pb-16 md:px-12 md:pb-24">
          <SectionHeader eyebrow="03" title={t("experienceEyebrow")} />
          <div className="flex flex-col">
            {SEED_EXPERIENCE.map((e) => (
              <div
                key={e.company}
                className="flex flex-col items-start gap-3 border-t border-line py-6 md:flex-row md:gap-10"
              >
                <span className="font-mono text-xs text-accent md:w-[200px] md:shrink-0">
                  {e.period}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-2xl text-ink">{e.company}</h3>
                  <span className="text-[15px] font-medium text-accent">
                    {e.role}
                  </span>
                  <p className="max-w-[680px] text-[14px] leading-relaxed text-muted">
                    {e.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {e.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-line bg-paper px-2 py-1 font-mono text-[11px] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="flex flex-col gap-7 px-6 pb-16 md:px-12 md:pb-24">
          <SectionHeader eyebrow="04" title={t("skillsEyebrow")} />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {SEED_SKILLS.map((cat) => (
              <div
                key={cat.label}
                className="flex flex-col gap-3.5 border border-line bg-panel p-6"
              >
                <span className="font-mono text-[11px] tracking-wider text-accent">
                  {cat.label}
                </span>
                <div className="flex flex-col">
                  {cat.skills.map((s) => (
                    <div
                      key={s}
                      className="flex items-center gap-2 border-t border-line py-2"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 bg-accent" />
                      <span className="text-sm text-ink">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="flex flex-col gap-7 px-6 pb-16 md:px-12 md:pb-24">
          <SectionHeader eyebrow="05" title={t("educationEyebrow")} />
          <div className="flex flex-col gap-8 border border-line bg-panel p-8 lg:flex-row lg:items-start">
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="font-display text-[26px] text-ink">
                {SEED_EDUCATION.institution}
              </h3>
              <span className="text-[15px] text-accent">
                {SEED_EDUCATION.degree}
              </span>
              <p className="max-w-[640px] text-[14px] leading-relaxed text-muted">
                {SEED_EDUCATION.thesis}
              </p>
            </div>
            <div className="flex flex-col gap-2 lg:w-[280px]">
              <span className="font-mono text-xs text-muted">
                {SEED_EDUCATION.period}
              </span>
              <span className="flex items-start gap-2 text-[14px] leading-snug text-ink">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {SEED_EDUCATION.award}
              </span>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="flex flex-col gap-7 px-6 pb-16 md:px-12 md:pb-24">
          <SectionHeader eyebrow="06" title={t("achievementsEyebrow")} />
          <div className="grid gap-5 md:grid-cols-3">
            {SEED_ACHIEVEMENTS.map((a) => (
              <div
                key={a.number}
                className="flex flex-col gap-3 border border-line bg-panel p-6"
              >
                <span className="font-mono text-sm tracking-wider text-accent">
                  {a.number}
                </span>
                <h3 className="font-display text-[22px] text-ink">{a.title}</h3>
                <span className="text-sm font-medium text-muted">{a.subtitle}</span>
                <span className="font-mono text-[11px] text-accent">{a.metric}</span>
                <p className="text-[14px] leading-relaxed text-muted">{a.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <FinalCTA heading={t("ctaHeading")} sub={t("ctaSub")}>
          <Button variant="primary" href="/contact">
            {t("ctaPrimary")}
          </Button>
          <CvDownloadButton label={t("ctaSecondary")} />
        </FinalCTA>
      </main>
      <Footer />
    </>
  );
}
