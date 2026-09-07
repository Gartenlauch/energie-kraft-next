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

      <main id="main-content">
        <Breadcrumbs
          currentLabel={
            wallboxCalculatorContent.breadcrumbLabel
          }
        />

        <section className="flex min-h-[36rem] items-center bg-brand-navy py-16 text-white md:py-24">
          <div className="section-shell">
            <p className="mb-4 text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
              {wallboxCalculatorContent.hero.eyebrow}
            </p>

            <h1 className="max-w-4xl text-[clamp(2.35rem,4.6vw,4.75rem)] leading-[1.04] tracking-[-0.045em] text-white">
              {wallboxCalculatorContent.hero.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72 md:text-xl">
              {wallboxCalculatorContent.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#wallbox-berechnung"
                className="button-light"
              >
                Berechnung starten
              </a>

              <Link
                href="/wallbox"
                className="inline-flex min-h-13 items-center justify-center rounded-[var(--radius-md)] border border-white/30 px-5 py-3 text-sm font-semibold text-white"
              >
                Wallbox-Beratung
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

        <WallboxCostCalculator />

        <section className="section-space bg-surface">
          <div className="section-shell">
            <p className="eyebrow">
              Technische Prüfung
            </p>

            <h2 className="section-title mt-4">
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
                className="button-primary"
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
