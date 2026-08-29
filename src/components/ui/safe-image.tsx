"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "fill" | "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
  fallbackClassName?: string;
};

/**
 * Optimized CMS image with a stable, accessible fallback when the origin or
 * Next image optimizer is unavailable. The parent must provide a positioned
 * box with the intended dimensions for `fill` sizing.
 */
export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  sizes,
  loading = "lazy",
  onError,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const validSrc = typeof src === "string" && /^https?:\/\//i.test(src);

  if (!validSrc || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("bg-panel", fallbackClassName ?? className)}
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={loading}
      className={className}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
