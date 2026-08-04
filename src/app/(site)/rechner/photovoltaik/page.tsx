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

      <main>
        <Breadcrumbs currentLabel={pvCalculatorContent.breadcrumbLabel} />

        <section className="bg-background flex min-h-[65vh] items-center px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-4 text-sm font-semibold tracking-widest uppercase">
              {pvCalculatorContent.hero.eyebrow}
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              {pvCalculatorContent.hero.title}
            </h1>

            <p className="text-foreground/70 mt-6 max-w-3xl text-lg leading-8">
              {pvCalculatorContent.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#pv-berechnung"
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
              >
                Berechnung starten
              </a>

              <Link
                href="/photovoltaik"
                className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
              >
                Photovoltaik-Beratung
              </Link>
            </div>
          </div>
        </section>

        <PvRoiCalculator />

        <section className="border-foreground/10 border-t px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-sm font-semibold tracking-widest uppercase">Einordnung</p>

            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
              Was bei einer realen PV-Planung zusätzlich berücksichtigt wird
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <article className="border-foreground/10 bg-foreground/[0.02] rounded-xl border p-6">
                <h3 className="text-xl font-semibold">Dach und Standort</h3>

                <p className="text-foreground/70 mt-3 leading-7">
                  Ausrichtung, Neigung, Verschattung, verfügbare Dachfläche und regionale
                  Einstrahlung beeinflussen den tatsächlichen Solarertrag.
                </p>
              </article>

              <article className="border-foreground/10 bg-foreground/[0.02] rounded-xl border p-6">
                <h3 className="text-xl font-semibold">Verbrauchsprofil</h3>

                <p className="text-foreground/70 mt-3 leading-7">
                  Nicht nur der Jahresverbrauch, sondern auch die zeitliche Verteilung entscheidet
                  über Eigenverbrauch und mögliche Speichergröße.
                </p>
              </article>

              <article className="border-foreground/10 bg-foreground/[0.02] rounded-xl border p-6">
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
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
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