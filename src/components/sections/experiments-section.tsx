import { getTranslations } from "next-intl/server";
import { ExperimentRow } from "@/components/cards/experiment-row";
import { getExperiments } from "@/lib/api";

export async function ExperimentsSection() {
  const t = await getTranslations("experiments");
  const experiments = await getExperiments();
  const featured = experiments.slice(0, 4);

  return (
    <section className="px-6 py-16 md:px-12 md:py-24">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="eyebrow-marker" aria-hidden />
          <span className="font-mono text-[13px] tracking-widest text-muted">
            (02) — EXPERIMENTS
          </span>
        </div>
        <h2 className="font-display text-[36px] md:text-[52px] leading-[1.05] text-ink">
          {t("heading")}
        </h2>
        <p className="max-w-[560px] text-[16px] md:text-[17px] text-muted">{t("sub")}</p>
      </div>

      <div className="mt-12 flex flex-col">
        {featured.map((experiment) => (
          <ExperimentRow key={experiment.id} experiment={experiment} />
        ))}
      </div>
    </section>
  );
}