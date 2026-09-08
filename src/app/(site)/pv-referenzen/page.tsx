import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EditorialFeatureSection } from "@/components/marketing/marketing-sections";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { ArrowRightIcon } from "@/components/ui/icons";
import { regionalReferenceProjects } from "@/content/reference-projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

const seo = {
  title: "Photovoltaik-Referenzen aus der Region | Energie-Kraft Süd",
  description:
    "Photovoltaik-Referenzen aus Berchtesgaden, Ainring, Freilassing und Schönram-Petting: Einblicke in Anlagen auf Wohnhäusern und Gewerbedächern.",
  canonicalPath: "/pv-referenzen",
};

export const metadata: Metadata = buildMetadata(seo);

export default function ReferencesPage() {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: "Referenzen",
          currentPath: seo.canonicalPath,
        })}
      />
      <main id="main-content">
        <Breadcrumbs currentLabel="Referenzen" />

        <section className="bg-surface-soft py-16 md:py-24" aria-labelledby="reference-title">
          <div className="section-shell">
            <Reveal className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
              <div className="min-w-0">
                <p className="eyebrow">Dächer aus unserer Region</p>
                <h1 id="reference-title" className="section-title mt-5 max-w-3xl">
                  Photovoltaik. Vor Ort. Im Alltag.
                </h1>
              </div>
              <p className="lead-copy">
                Wohnhäuser und Gewerbedächer, unterschiedliche Orte und Perspektiven. Entdecken Sie
                ausgewählte Anlagen aus unserem regionalen Referenzbestand.
              </p>
            </Reveal>

            <nav
              aria-label="Referenzen nach Ort"
              className="border-border-strong mt-12 flex flex-wrap gap-x-7 gap-y-2 border-t pt-5"
            >
              {regionalReferenceProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`#${project.slug}`}
                  className="text-brand-primary inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
                >
                  {project.location} <ArrowRightIcon className="size-4 rotate-90" />
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className="section-shell py-12 md:py-16" aria-label="Regionale Photovoltaik-Projekte">
          <div className="reference-collection">
            {regionalReferenceProjects.map((project, index) => (
              <article
                key={project.slug}
                id={project.slug}
                className="reference-project"
                aria-labelledby={`${project.slug}-title`}
              >
                <Reveal variant={index % 2 === 0 ? "left" : "right"}>
                  <figure>
                    <div className="reference-project__image bg-surface-soft">
                      <Image
                        src={project.imageSrc}
                        alt={project.imageAlt}
                        fill
                        sizes="(max-width: 1023px) 100vw, 60vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="flex items-start justify-between gap-5">
                      <div>
                        <p className="eyebrow">{project.category}</p>
                        <h2 id={`${project.slug}-title`} className="mt-2 text-2xl md:text-3xl">
                          {project.location}
                        </h2>
                      </div>
                      <span aria-hidden="true" className="text-brand-primary pt-1 text-sm font-semibold">
                        0{index + 1}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              </article>
            ))}
          </div>
        </section>

        <EditorialFeatureSection
          eyebrow="Ihr Gebäude. Ihr Energieprojekt."
          title="Was lässt sich auf Ihrem Dach bewegen?"
          paragraphs={[
            "Jede Anlage beginnt mit anderen Voraussetzungen. Gemeinsam betrachten wir Dachfläche, Verbrauch und Gebäudetechnik – und planen Photovoltaik, Speicher und weitere Komponenten passend zu Ihrem Vorhaben.",
          ]}
          surface="blue"
          layout="editorial"
          cta={{ label: "Projekt besprechen", href: "/kontakt" }}
          links={[
            {
              label: "Photovoltaik kennenlernen",
              href: "/photovoltaik",
              description: "Von der ersten Planung zum abgestimmten Energiesystem.",
            },
          ]}
        />
      </main>
    </>
  );
}
