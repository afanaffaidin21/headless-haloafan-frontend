"use client";

import { Button } from "@/components/ui/button";
import { useCv } from "@/components/providers/cv-provider";

export function CvDownloadButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { openCv } = useCv();
  return (
    <Button onClick={openCv} className={className}>
      {label}
    </Button>
  );
}