import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FinalCTA } from "@/components/ui/final-cta";
import { AudienceProvider } from "@/components/providers/audience-provider";
import { PathSwitcher } from "@/components/sections/path-switcher";
import { Hero } from "@/components/sections/hero";
import { HomeCta } from "@/components/sections/home-cta";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ExperimentsSection } from "@/components/sections/experiments-section";
import { BlogSection } from "@/components/sections/blog-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { FAQSection } from "@/components/sections/faq-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <Header />
      <AudienceProvider>
        <main className="flex-1">
          <PathSwitcher />
          <Hero />
          <ProjectsSection />
          <ExperimentsSection />
          <BlogSection />
          <TestimonialsSection />
          <AboutTeaser />
          <FAQSection />
          <FinalCTA heading={t("home.ctaHeading")} sub={t("home.ctaSub")}>
            <HomeCta />
          </FinalCTA>
        </main>
      </AudienceProvider>
      <Footer />
    </>
  );
}