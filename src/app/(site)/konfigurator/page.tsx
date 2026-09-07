import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ArtDirectedImage } from "@/components/media/art-directed-image";
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

      <main id="main-content">
        <Breadcrumbs
          currentLabel={configuratorLandingContent.breadcrumbLabel}
        />

        <section className="bg-surface-soft">
          <div className="section-shell grid min-h-[36rem] items-center gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-18">
            <div>
              <p className="eyebrow">{configuratorLandingContent.hero.eyebrow}</p>
              <h1 className="mt-5 max-w-[17ch] text-[clamp(2.35rem,4.5vw,4.65rem)] leading-[1.04] tracking-[-0.045em]">
                {configuratorLandingContent.hero.title}
              </h1>
              <p className="lead-copy mt-6 max-w-3xl">
                {configuratorLandingContent.hero.description}
              </p>
              <a href="#configurator-house-heading" className="button-primary mt-8">
                Lösung auswählen
              </a>
            </div>

            <div className="media-frame aspect-[4/5] lg:aspect-[4/3]">
              <ArtDirectedImage
                desktopSrc="/images/home-premium/hero-energy-home-desktop.webp"
                mobileSrc="/images/home-premium/hero-energy-home-mobile.webp"
                desktopWidth={2000}
                desktopHeight={1200}
                mobileWidth={1200}
                mobileHeight={1600}
                alt="Modernes Energiesystem mit Photovoltaik, Wärmepumpe und Wallbox"
                sizes="(max-width: 1023px) calc(100vw - 2rem), 52vw"
                fetchPriority="high"
                className="block"
              />
            </div>
          </div>
        </section>

        <section
          className="section-space border-y border-border-default bg-background"
          aria-labelledby="configurator-house-heading"
        >
          <div className="section-shell">
            <p className="eyebrow">
              {configuratorLandingContent.house.eyebrow}
            </p>

            <h2
              id="configurator-house-heading"
              className="section-title mt-4"
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

        <section className="section-space bg-surface">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="eyebrow">
                Schritt für Schritt
              </p>

              <h2 className="section-title mt-4">
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
              <article className="premium-card p-6">
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

              <article className="premium-card p-6">
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

              <article className="premium-card p-6">
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
