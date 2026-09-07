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

      <main id="main-content">
        <Breadcrumbs currentLabel={climateCalculatorContent.breadcrumbLabel} />

        <section className="flex min-h-[36rem] items-center bg-brand-navy py-16 text-white md:py-24">
          <div className="section-shell">
            <p className="mb-4 text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
              {climateCalculatorContent.hero.eyebrow}
            </p>

            <h1 className="max-w-4xl text-[clamp(2.35rem,4.6vw,4.75rem)] leading-[1.04] tracking-[-0.045em] text-white">
              {climateCalculatorContent.hero.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72 md:text-xl">
              {climateCalculatorContent.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#klima-berechnung"
                className="button-light"
              >
                Berechnung starten
              </a>

              <Link
                href="/klimaanlagen"
                className="inline-flex min-h-13 items-center justify-center rounded-[var(--radius-md)] border border-white/30 px-5 py-3 text-sm font-semibold text-white"
              >
                Klimaanlagen-Beratung
              </Link>
            </div>
          </div>
        </section>

        <ClimateCostCalculator />

        <section className="section-space bg-surface">
          <div className="section-shell">
            <p className="eyebrow">Konkrete Planung</p>

            <h2 className="section-title mt-4">
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
                className="button-primary"
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
