"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAudience } from "@/components/providers/audience-provider";
import { useCv } from "@/components/providers/cv-provider";
import { SITE_CONFIG } from "@/lib/seed";

export function HomeCta() {
  const { path } = useAudience();
  const { openCv } = useCv();
  const t = useTranslations();
  const labels = t.raw(`pathContent.cta.${path}`) as {
    primary: string;
    secondary: string;
  };

  const primaryHref =
    path === "freelance"
      ? `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(
          "Hi Afan, I saw your portfolio and would like to discuss a project."
        )}`
      : "/contact";

  const secondaryHref =
    path === "fulltime"
      ? SITE_CONFIG.socials.linkedin
      : `mailto:${SITE_CONFIG.email}`;

  return (
    <>
      {path === "fulltime" ? (
        <Button variant="primary" onClick={openCv}>
          {labels.primary}
        </Button>
      ) : (
        <Button variant="primary" href={primaryHref}>
          {labels.primary}
        </Button>
      )}
      <Button href={secondaryHref}>{labels.secondary}</Button>
    </>
  );
}