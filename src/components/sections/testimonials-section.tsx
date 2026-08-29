import { Quote } from "lucide-react";
import { SEED_TESTIMONIALS } from "@/lib/seed";

export function TestimonialsSection() {
  return (
    <section className="px-6 py-16 md:px-12 md:py-24">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="eyebrow-marker" aria-hidden />
          <span className="font-mono text-[11px] tracking-widest text-muted md:text-[13px]">
            (04) — TESTIMONIALS
          </span>
        </div>
        <h2 className="font-display text-[36px] leading-[1.08] text-ink md:text-[52px] md:leading-[1.05]">
          What Clients Say
        </h2>
        <p className="max-w-[560px] text-[16px] text-muted md:text-[17px]">
          A few words from people I&apos;ve had the pleasure to build for.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SEED_TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex flex-col justify-between gap-6 border border-line bg-panel p-6"
          >
            <div className="flex flex-col gap-4">
              <Quote aria-hidden="true" className="h-6 w-6 text-accent" />
              <blockquote className="text-[16px] leading-relaxed text-ink">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
            </div>
            <figcaption className="flex flex-col gap-1 border-t border-line pt-4">
              <span className="font-display text-[18px] text-ink">
                {testimonial.name}
              </span>
              <span className="font-mono text-[11px] tracking-wider text-muted">
                {testimonial.role}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
