import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ConfiguratorHouseNavigation } from "@/components/configurator/configurator-house-navigation";
import { ConfiguratorProductCard } from "@/components/configurator/configurator-product-card";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  configuratorLandingContent,
  configuratorProductList,
} from "@/content/configurators";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata(
  configuratorLandingContent.seo,
);

export default function ConfiguratorLandingPage() {
  return (
    <>
      <JsonLdScript
        data={buildWebPageJsonLd(configuratorLandingContent.seo)}
      />

      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: configuratorLandingContent.breadcrumbLabel,
          currentPath:
            configuratorLandingContent.seo.canonicalPath,
        })}
      />

      <main>
        <Breadcrumbs
          currentLabel={configuratorLandingContent.breadcrumbLabel}
        />

        <section className="bg-background px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
              {configuratorLandingContent.hero.eyebrow}
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-brand-primary md:text-6xl">
              {configuratorLandingContent.hero.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground/70">
              {configuratorLandingContent.hero.description}
            </p>
          </div>
        </section>

        <section
          className="border-y border-border-default bg-surface px-6 py-16 md:py-20"
          aria-labelledby="configurator-house-heading"
        >
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
              {configuratorLandingContent.house.eyebrow}
            </p>

            <h2
              id="configurator-house-heading"
              className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-brand-primary md:text-4xl"
            >
              {configuratorLandingContent.house.title}
            </h2>

            <p className="mt-5 max-w-3xl leading-7 text-foreground/70">
              {configuratorLandingContent.house.description}
            </p>

            <ConfiguratorHouseNavigation
              products={configuratorProductList}
            />

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {configuratorProductList.map((product) => (
                <ConfiguratorProductCard
                  key={product.type}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
                Schritt für Schritt
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary md:text-4xl">
                Wenige Fragen statt komplizierter Technik
              </h2>

              <p className="mt-5 leading-7 text-foreground/70">
                Die Konfiguratoren liefern eine erste Orientierung auf
                Basis deiner Angaben. Die tatsächliche technische
                Auslegung erfolgt anschließend anhand der konkreten
                Gegebenheiten vor Ort.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-border-default p-6">
                <span className="text-sm font-semibold text-brand-secondary">
                  01
                </span>
                <h3 className="mt-3 text-lg font-semibold text-brand-primary">
                  Projekt auswählen
                </h3>
                <p className="mt-2 leading-7 text-foreground/70">
                  Starte mit Photovoltaik, Speicher, Klima,
                  Wärmepumpe oder Wallbox.
                </p>
              </article>

              <article className="rounded-2xl border border-border-default p-6">
                <span className="text-sm font-semibold text-brand-secondary">
                  02
                </span>
                <h3 className="mt-3 text-lg font-semibold text-brand-primary">
                  Einfache Fragen beantworten
                </h3>
                <p className="mt-2 leading-7 text-foreground/70">
                  Wir fragen nur Informationen ab, die für dein
                  Projekt wirklich hilfreich sind.
                </p>
              </article>

              <article className="rounded-2xl border border-border-default p-6">
                <span className="text-sm font-semibold text-brand-secondary">
                  03
                </span>
                <h3 className="mt-3 text-lg font-semibold text-brand-primary">
                  Persönlich weiterplanen
                </h3>
                <p className="mt-2 leading-7 text-foreground/70">
                  Deine Angaben können anschließend direkt für eine
                  persönliche Beratung übernommen werden.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}