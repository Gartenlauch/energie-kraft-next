import type { Metadata } from "next";
import Link from "next/link";

import { ClimateCostCalculator } from "@/components/calculators/climate-cost-calculator";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { climateCalculatorContent } from "@/content/pages/klima-kostenrechner";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata(climateCalculatorContent.seo);

export default function ClimateCalculatorPage() {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(climateCalculatorContent.seo)} />

      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: climateCalculatorContent.breadcrumbLabel,
          currentPath: climateCalculatorContent.seo.canonicalPath,
        })}
      />

      <main>
        <Breadcrumbs currentLabel={climateCalculatorContent.breadcrumbLabel} />

        <section className="bg-background flex min-h-[65vh] items-center px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-4 text-sm font-semibold tracking-widest uppercase">
              {climateCalculatorContent.hero.eyebrow}
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              {climateCalculatorContent.hero.title}
            </h1>

            <p className="text-foreground/70 mt-6 max-w-3xl text-lg leading-8">
              {climateCalculatorContent.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#klima-berechnung"
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
              >
                Berechnung starten
              </a>

              <Link
                href="/klimaanlagen"
                className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
              >
                Klimaanlagen-Beratung
              </Link>
            </div>
          </div>
        </section>

        <ClimateCostCalculator />

        <section className="border-foreground/10 border-t px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-sm font-semibold tracking-widest uppercase">Konkrete Planung</p>

            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
              Jeder Raum benötigt eine individuelle Kühllastprüfung
            </h2>

            <p className="text-foreground/70 mt-6 max-w-3xl text-lg leading-8">
              Für eine konkrete Auslegung werden Fenster, Ausrichtung, Verschattung, Raumvolumen,
              Wärmelasten, Leitungswege, Kondensatabführung, Schallschutz und Aufstellort des
              Außengeräts geprüft. Erst daraus entstehen die passende Gerätekombination und ein
              verbindliches Angebot.
            </p>

            <div className="mt-8">
              <Link
                href="/kontakt"
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
              >
                Klimaanlagen-Planung anfragen
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
