import type { Metadata } from "next";
import Link from "next/link";

import { HeatPumpCostCalculator } from "@/components/calculators/heat-pump-cost-calculator";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { heatPumpCalculatorContent } from "@/content/pages/waermepumpen-rechner";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata(
  heatPumpCalculatorContent.seo,
);

export default function HeatPumpCalculatorPage() {
  return (
    <>
      <JsonLdScript
        data={buildWebPageJsonLd(
          heatPumpCalculatorContent.seo,
        )}
      />

      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel:
            heatPumpCalculatorContent.breadcrumbLabel,

          currentPath:
            heatPumpCalculatorContent.seo.canonicalPath,
        })}
      />

      <main id="main-content">
        <Breadcrumbs
          currentLabel={
            heatPumpCalculatorContent.breadcrumbLabel
          }
        />

        <section className="flex min-h-[36rem] items-center bg-brand-navy py-16 text-white md:py-24">
          <div className="section-shell">
            <p className="mb-4 text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
              {heatPumpCalculatorContent.hero.eyebrow}
            </p>

            <h1 className="max-w-4xl text-[clamp(2.35rem,4.6vw,4.75rem)] leading-[1.04] tracking-[-0.045em] text-white">
              {heatPumpCalculatorContent.hero.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72 md:text-xl">
              {heatPumpCalculatorContent.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#waermepumpen-berechnung"
                className="button-light"
              >
                Berechnung starten
              </a>

              <Link
                href="/waermepumpen"
                className="inline-flex min-h-13 items-center justify-center rounded-[var(--radius-md)] border border-white/30 px-5 py-3 text-sm font-semibold text-white"
              >
                Wärmepumpen-Beratung
              </Link>

              <Link
                href="/photovoltaik"
                className="inline-flex min-h-13 items-center justify-center rounded-[var(--radius-md)] border border-white/30 px-5 py-3 text-sm font-semibold text-white"
              >
                Photovoltaik kombinieren
              </Link>
            </div>
          </div>
        </section>

        <HeatPumpCostCalculator />

        <section className="section-space bg-surface">
          <div className="section-shell">
            <p className="eyebrow">
              Konkrete Planung
            </p>

            <h2 className="section-title mt-4">
              Die belastbare Auslegung benötigt eine
              individuelle Heizlastprüfung
            </h2>

            <p className="text-foreground/70 mt-6 max-w-3xl text-lg leading-8">
              Für eine konkrete Planung werden Gebäudehülle,
              Heizflächen, Raumtemperaturen, Warmwasserbedarf,
              hydraulische Situation, Aufstellort,
              Schallschutz, elektrische Anschlussleistung und
              das bestehende Heizsystem geprüft. Erst daraus
              entstehen die passende Wärmepumpe und ein
              verbindliches Angebot.
            </p>

            <div className="mt-8">
              <Link
                href="/kontakt"
                className="button-primary"
              >
                Wärmepumpenprojekt anfragen
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
