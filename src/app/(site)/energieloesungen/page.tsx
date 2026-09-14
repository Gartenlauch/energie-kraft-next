import type { Metadata } from "next";

import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  EditorialFeatureSection,
  SplitFeatureSection,
} from "@/components/marketing/marketing-sections";
import { SecondaryPageHeading } from "@/components/marketing/secondary-page-heading";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import { sprint8Pages } from "@/content/sprint8-pages";
import { buildMetadata } from "@/lib/seo/metadata";

const content = sprint8Pages.energySolutions;

export const metadata: Metadata = buildMetadata(content.seo);

export default function EnergySolutionsPage() {
  const [solar, additions] = content.sections;
  if (!solar || !additions) throw new Error("Energy solutions overview content is incomplete.");
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(content.seo)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: content.breadcrumbLabel,
          currentPath: content.seo.canonicalPath,
        })}
      />
      <main id="main-content">
        <Breadcrumbs currentLabel={content.breadcrumbLabel} />
        <SecondaryPageHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
        <SplitFeatureSection
          id="solarstrom"
          eyebrow="01 / Erzeugen & speichern"
          title={solar.title}
          description={solar.paragraphs.join(" ")}
          benefits={solar.items}
          image={{
            desktopSrc: "/images/photovoltaic/photovoltaic-feature-desktop.webp",
            mobileSrc: "/images/photovoltaic/photovoltaic-feature-mobile.webp",
            desktopWidth: 1600,
            desktopHeight: 1200,
            mobileWidth: 1200,
            mobileHeight: 1500,
            alt: "Photovoltaikmodule auf einem Wohnhaus",
          }}
          primaryCta={{ label: "Photovoltaik entdecken", href: "/photovoltaik" }}
          secondaryCta={{ label: "Stromspeicher entdecken", href: "/stromspeicher" }}
          surface="blue"
          imagePosition="left"
        />
        <EditorialFeatureSection
          eyebrow="02 / Wärme & Raumklima"
          title="Energie für ein angenehmes Zuhause"
          paragraphs={additions.paragraphs}
          links={additions.links.slice(0, 2)}
          layout="image-right"
          surface="white"
          image={{
            desktopSrc: "/images/heat-pump/heat-pump-feature-desktop.webp",
            mobileSrc: "/images/heat-pump/heat-pump-feature-mobile.webp",
            desktopWidth: 1600,
            desktopHeight: 1200,
            mobileWidth: 1200,
            mobileHeight: 1500,
            alt: "Luft-Wasser-Wärmepumpe an einem Wohnhaus",
          }}
        />
        <EditorialFeatureSection
          eyebrow="03 / Sinnvoll ergänzen"
          title="Solarstrom auch unterwegs nutzen"
          paragraphs={[
            "Eine Wallbox ergänzt das Energiesystem um das Laden zu Hause. Auch der verbleibende Netzbezug und das Tarifmodell gehören zur Planung.",
          ]}
          links={additions.links.slice(2)}
          layout="editorial"
          surface="soft"
        />
        <section className="brand-gradient py-16 text-white md:py-20">
          <div className="section-shell grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="section-title text-white">{content.ctaTitle}</h2>
            <Link href={content.ctaHref} className="button-light">
              {content.ctaLabel}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
