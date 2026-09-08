import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ConfiguratorHouseNavigation } from "@/components/configurator/configurator-house-navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { configuratorLandingContent, configuratorProductList } from "@/content/configurators";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata(configuratorLandingContent.seo);

export default function ConfiguratorLandingPage() {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(configuratorLandingContent.seo)} />

      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: configuratorLandingContent.breadcrumbLabel,
          currentPath: configuratorLandingContent.seo.canonicalPath,
        })}
      />

      <main id="main-content">
        <Breadcrumbs currentLabel={configuratorLandingContent.breadcrumbLabel} />

        <section className="bg-surface-soft py-12 md:py-16">
          <div className="section-shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow">{configuratorLandingContent.hero.eyebrow}</p>
              <h1 className="section-title mt-5 max-w-[22ch]">
                {configuratorLandingContent.hero.title}
              </h1>
            </div>
            <p className="lead-copy">{configuratorLandingContent.hero.description}</p>
          </div>
        </section>

        <section
          className="section-space border-border-default bg-background border-y"
          aria-labelledby="configurator-house-heading"
        >
          <div className="section-shell">
            <p className="eyebrow">{configuratorLandingContent.house.eyebrow}</p>

            <h2 id="configurator-house-heading" className="section-title mt-4">
              {configuratorLandingContent.house.title}
            </h2>

            <p className="text-foreground/70 mt-5 max-w-3xl leading-7">
              {configuratorLandingContent.house.description}
            </p>

            <ConfiguratorHouseNavigation products={configuratorProductList} />
          </div>
        </section>

        <section className="section-space bg-surface">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="eyebrow">Schritt für Schritt</p>

              <h2 className="section-title mt-4">Wenige Fragen statt komplizierter Technik</h2>

              <p className="text-foreground/70 mt-5 leading-7">
                Die Konfiguratoren liefern eine erste Orientierung auf Basis deiner Angaben. Die
                tatsächliche technische Auslegung erfolgt anschließend anhand der konkreten
                Gegebenheiten vor Ort.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <article className="premium-card p-6">
                <span className="text-brand-secondary text-sm font-semibold">01</span>
                <h3 className="text-brand-primary mt-3 text-lg font-semibold">Projekt auswählen</h3>
                <p className="text-foreground/70 mt-2 leading-7">
                  Starte mit Photovoltaik, Speicher, Klima, Wärmepumpe oder Wallbox.
                </p>
              </article>

              <article className="premium-card p-6">
                <span className="text-brand-secondary text-sm font-semibold">02</span>
                <h3 className="text-brand-primary mt-3 text-lg font-semibold">
                  Einfache Fragen beantworten
                </h3>
                <p className="text-foreground/70 mt-2 leading-7">
                  Wir fragen nur Informationen ab, die für dein Projekt wirklich hilfreich sind.
                </p>
              </article>

              <article className="premium-card p-6">
                <span className="text-brand-secondary text-sm font-semibold">03</span>
                <h3 className="text-brand-primary mt-3 text-lg font-semibold">
                  Persönlich weiterplanen
                </h3>
                <p className="text-foreground/70 mt-2 leading-7">
                  Deine Angaben können anschließend direkt für eine persönliche Beratung übernommen
                  werden.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
