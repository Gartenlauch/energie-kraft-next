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

      <main>
        <Breadcrumbs
          currentLabel={
            heatPumpCalculatorContent.breadcrumbLabel
          }
        />

        <section className="bg-background flex min-h-[65vh] items-center px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-4 text-sm font-semibold tracking-widest uppercase">
              {heatPumpCalculatorContent.hero.eyebrow}
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              {heatPumpCalculatorContent.hero.title}
            </h1>

            <p className="text-foreground/70 mt-6 max-w-3xl text-lg leading-8">
              {heatPumpCalculatorContent.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#waermepumpen-berechnung"
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
              >
                Berechnung starten
              </a>

              <Link
                href="/waermepumpen"
                className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
              >
                Wärmepumpen-Beratung
              </Link>

              <Link
                href="/photovoltaik"
                className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
              >
                Photovoltaik kombinieren
              </Link>
            </div>
          </div>
        </section>

        <HeatPumpCostCalculator />

        <section className="border-foreground/10 border-t px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-sm font-semibold tracking-widest uppercase">
              Konkrete Planung
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
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
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
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