import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EditorialFeatureSection } from "@/components/marketing/marketing-sections";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CONTACT_FORM_HREF } from "@/config/routes";
import {
  getReferenceProjectsByLocation,
  referenceLocations,
  regionalReferenceProjects,
} from "@/content/reference-projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

const seo = {
  title: "Photovoltaik-Referenzen aus der Region | Energie-Kraft Süd",
  description:
    "Echte Photovoltaik-Referenzen aus Ainring, Freilassing, Bad Reichenhall, Berchtesgaden, Kirchanschöring, Laufen und Saaldorf-Surheim.",
  canonicalPath: "/pv-referenzen",
};

export const metadata: Metadata = buildMetadata(seo);

export default function ReferencesPage() {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: "PV-Referenzen",
          currentPath: seo.canonicalPath,
        })}
      />
      <main id="main-content">
        <Breadcrumbs currentLabel="PV-Referenzen" />

        <section
          className="bg-brand-navy py-16 text-white md:py-24"
          aria-labelledby="reference-title"
        >
          <div className="section-shell">
            <Reveal className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
              <div className="min-w-0">
                <p className="eyebrow eyebrow-on-dark">Dächer aus unserer Region</p>
                <h1 id="reference-title" className="section-title mt-5 max-w-4xl text-white">
                  Photovoltaik. Vor Ort. Im Alltag.
                </h1>
              </div>
              <p className="max-w-xl text-lg leading-8 text-white">
                Private Wohngebäude und gewerbliche Dachflächen: Unser Referenzarchiv zeigt reale
                Projekte aus der Region und macht unterschiedliche Ausgangslagen sichtbar.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section-space bg-background" aria-labelledby="selected-projects-title">
          <div className="section-shell">
            <Reveal className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="eyebrow">Ausgewählte Projekte</p>
                <h2 id="selected-projects-title" className="section-title mt-4">
                  Sieben Orte. Viele reale Dachflächen.
                </h2>
              </div>
              <p className="lead-copy lg:justify-self-end">
                Jede Aufnahme stammt aus dem lokalen Energie-Kraft-Referenzbestand. Technische
                Detailwerte zeigen wir nur, wenn sie eindeutig bestätigt sind.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {regionalReferenceProjects.map((project, index) => (
                <Reveal key={project.id} delay={(index % 3) * 60}>
                  <Link
                    href={`/pv-referenzen/${project.locationSlug}#${project.id}`}
                    className="group border-border-default bg-surface block overflow-hidden border"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-4 p-5">
                      <div>
                        <p className="text-brand-primary text-xs font-bold tracking-[0.12em] uppercase">
                          {project.customerType}
                        </p>
                        <h3 className="mt-2 text-xl">{project.location}</h3>
                      </div>
                      <ArrowRightIcon className="text-brand-primary mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space bg-surface-soft" aria-labelledby="locations-title">
          <div className="section-shell">
            <Reveal>
              <p className="eyebrow">Regionale Projektübersicht</p>
              <h2 id="locations-title" className="section-title mt-4 max-w-3xl">
                Referenzen nach Ort entdecken
              </h2>
            </Reveal>
            <ul className="border-border-strong mt-12 grid border-y md:grid-cols-2 lg:grid-cols-3">
              {referenceLocations.map((location, index) => {
                const projects = getReferenceProjectsByLocation(location.slug);
                const customerTypes = [...new Set(projects.map((project) => project.customerType))];

                return (
                  <li
                    key={location.slug}
                    className="border-border-strong border-b p-6 lg:border-l lg:first:border-l-0"
                  >
                    <Reveal delay={(index % 3) * 50}>
                      <p className="text-xs font-bold tracking-[0.12em] text-[var(--text-subtle)] uppercase">
                        Landkreis {location.district}
                      </p>
                      <h3 className="mt-3 text-2xl">{location.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                        {projects.length} Projekte · {customerTypes.join(" & ")}
                      </p>
                      <Link
                        href={`/pv-referenzen/${location.slug}`}
                        className="text-brand-primary mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
                      >
                        Ortsreferenzen ansehen <ArrowRightIcon className="size-4" />
                      </Link>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <EditorialFeatureSection
          eyebrow="Private & gewerbliche Anlagen"
          title="Jedes Dach beginnt mit anderen Voraussetzungen"
          paragraphs={[
            "Referenzbilder zeigen das Ergebnis, aber nicht alle Entscheidungen dahinter. Für ein neues Vorhaben betrachten wir Dach, Verbrauch, Gebäude und mögliche Speicher- oder Verbraucherkomponenten erneut.",
          ]}
          surface="white"
          layout="editorial"
          cta={{ label: "PV-Projekt starten", href: CONTACT_FORM_HREF }}
          links={[
            {
              label: "Photovoltaik für Zuhause",
              href: "/photovoltaik",
              description: "Planung für Dach, Eigenverbrauch und Speicher.",
            },
            {
              label: "Photovoltaik für Unternehmen",
              href: "/energieloesungen/photovoltaik-fuer-unternehmen",
              description: "Gewerbedach, Lastprofil und betriebliche Nutzung.",
            },
          ]}
        />
      </main>
    </>
  );
}
