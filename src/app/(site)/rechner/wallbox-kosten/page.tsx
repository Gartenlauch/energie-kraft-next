import type { Metadata } from "next";
import Link from "next/link";

import { WallboxCostCalculator } from "@/components/calculators/wallbox-cost-calculator";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { wallboxCalculatorContent } from "@/content/pages/wallbox-rechner";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata(
  wallboxCalculatorContent.seo,
);

export default function WallboxCalculatorPage() {
  return (
    <>
      <JsonLdScript
        data={buildWebPageJsonLd(
          wallboxCalculatorContent.seo,
        )}
      />

      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel:
            wallboxCalculatorContent.breadcrumbLabel,

          currentPath:
            wallboxCalculatorContent.seo.canonicalPath,
        })}
      />

      <main>
        <Breadcrumbs
          currentLabel={
            wallboxCalculatorContent.breadcrumbLabel
          }
        />

        <section className="bg-background flex min-h-[65vh] items-center px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-4 text-sm font-semibold tracking-widest uppercase">
              {wallboxCalculatorContent.hero.eyebrow}
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              {wallboxCalculatorContent.hero.title}
            </h1>

            <p className="text-foreground/70 mt-6 max-w-3xl text-lg leading-8">
              {wallboxCalculatorContent.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#wallbox-berechnung"
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
              >
                Berechnung starten
              </a>

              <Link
                href="/wallbox"
                className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
              >
                Wallbox-Beratung
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

        <WallboxCostCalculator />

        <section className="border-foreground/10 border-t px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-sm font-semibold tracking-widest uppercase">
              Technische Prüfung
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
              Die passende Wallbox beginnt mit der Prüfung
              der Elektroinstallation
            </h2>

            <p className="text-foreground/70 mt-6 max-w-3xl text-lg leading-8">
              Für die konkrete Planung werden Hausanschluss,
              Elektroverteilung, Leitungsweg, Absicherung,
              Fahrzeug, Ladeleistung, Lastmanagement und eine
              mögliche Photovoltaik-Anbindung geprüft. Erst
              daraus entstehen die passende Lösung und ein
              verbindliches Angebot.
            </p>

            <div className="mt-8">
              <Link
                href="/kontakt"
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
              >
                Wallbox-Projekt anfragen
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}