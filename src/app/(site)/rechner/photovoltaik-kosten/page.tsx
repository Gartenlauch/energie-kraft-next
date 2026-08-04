import type { Metadata } from "next";
import Link from "next/link";

import { PvSizingCalculator } from "@/components/calculators/pv-sizing-calculator";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { pvSizingCalculatorContent } from "@/content/pages/pv-kostenrechner";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata(pvSizingCalculatorContent.seo);

export default function PvSizingCalculatorPage() {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(pvSizingCalculatorContent.seo)} />

      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: pvSizingCalculatorContent.breadcrumbLabel,

          currentPath: pvSizingCalculatorContent.seo.canonicalPath,
        })}
      />

      <main>
        <Breadcrumbs currentLabel={pvSizingCalculatorContent.breadcrumbLabel} />

        <section className="bg-background flex min-h-[65vh] items-center px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-4 text-sm font-semibold tracking-widest uppercase">
              {pvSizingCalculatorContent.hero.eyebrow}
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              {pvSizingCalculatorContent.hero.title}
            </h1>

            <p className="text-foreground/70 mt-6 max-w-3xl text-lg leading-8">
              {pvSizingCalculatorContent.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#pv-kosten-berechnung"
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
              >
                Berechnung starten
              </a>

              <Link
                href="/rechner/photovoltaik"
                className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
              >
                Rendite und Amortisation
              </Link>

              <Link
                href="/photovoltaik"
                className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
              >
                Photovoltaik-Beratung
              </Link>
            </div>
          </div>
        </section>

        <PvSizingCalculator />

        <section className="border-foreground/10 border-t px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-sm font-semibold tracking-widest uppercase">Nächster Schritt</p>

            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
              Vom Orientierungswert zur konkreten PV-Planung
            </h2>

            <p className="text-foreground/70 mt-6 max-w-3xl text-lg leading-8">
              Eine konkrete Anlagenplanung berücksichtigt Dachbelegung, Statik, Leitungswege,
              Netzanschluss, Wechselrichterauslegung, Verbrauchsprofil und die tatsächlichen
              Komponenten. Erst daraus entstehen eine belastbare Ertragsprognose und ein
              verbindliches Angebot.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
              >
                Individuelle PV-Planung anfragen
              </Link>

              <Link
                href="/rechner/photovoltaik"
                className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
              >
                Wirtschaftlichkeit berechnen
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
