import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PvRoiCalculator } from "@/components/calculators/pv-roi-calculator";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { pvCalculatorContent } from "@/content/pages/pv-rechner";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata(pvCalculatorContent.seo);

export default function PvCalculatorPage() {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(pvCalculatorContent.seo)} />

      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: pvCalculatorContent.breadcrumbLabel,
          currentPath: pvCalculatorContent.seo.canonicalPath,
        })}
      />

      <main id="main-content">
        <Breadcrumbs currentLabel={pvCalculatorContent.breadcrumbLabel} />

        <section className="flex min-h-[36rem] items-center bg-brand-navy py-16 text-white md:py-24">
          <div className="section-shell">
            <p className="mb-4 text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
              {pvCalculatorContent.hero.eyebrow}
            </p>

            <h1 className="max-w-4xl text-[clamp(2.35rem,4.6vw,4.75rem)] leading-[1.04] tracking-[-0.045em] text-white">
              {pvCalculatorContent.hero.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72 md:text-xl">
              {pvCalculatorContent.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#pv-berechnung"
                className="button-light"
              >
                Berechnung starten
              </a>

              <Link
                href="/photovoltaik"
                className="inline-flex min-h-13 items-center justify-center rounded-[var(--radius-md)] border border-white/30 px-5 py-3 text-sm font-semibold text-white"
              >
                Photovoltaik-Beratung
              </Link>
              <Link
                href="/rechner/photovoltaik-kosten"
                className="inline-flex min-h-13 items-center justify-center rounded-[var(--radius-md)] border border-white/30 px-5 py-3 text-sm font-semibold text-white"
              >
                PV-Größe und Kosten
              </Link>
            </div>
          </div>
        </section>

        <PvRoiCalculator />

        <section className="section-space bg-surface">
          <div className="section-shell">
            <p className="eyebrow">Einordnung</p>

            <h2 className="section-title mt-4">
              Was bei einer realen PV-Planung zusätzlich berücksichtigt wird
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <article className="premium-card p-6">
                <h3 className="text-xl font-semibold">Dach und Standort</h3>

                <p className="text-foreground/70 mt-3 leading-7">
                  Ausrichtung, Neigung, Verschattung, verfügbare Dachfläche und regionale
                  Einstrahlung beeinflussen den tatsächlichen Solarertrag.
                </p>
              </article>

              <article className="premium-card p-6">
                <h3 className="text-xl font-semibold">Verbrauchsprofil</h3>

                <p className="text-foreground/70 mt-3 leading-7">
                  Nicht nur der Jahresverbrauch, sondern auch die zeitliche Verteilung entscheidet
                  über Eigenverbrauch und mögliche Speichergröße.
                </p>
              </article>

              <article className="premium-card p-6">
                <h3 className="text-xl font-semibold">Gesamtsystem</h3>

                <p className="text-foreground/70 mt-3 leading-7">
                  Stromspeicher, Wallbox, Wärmepumpe, Wechselrichter und Energiemanagement müssen
                  gemeinsam dimensioniert werden.
                </p>
              </article>
            </div>

            <div className="mt-8">
              <Link
                href="/kontakt"
                className="button-primary"
              >
                Individuelle PV-Planung anfragen
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
