import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CONTACT_FORM_HREF } from "@/config/routes";
import {
  getReferenceLocation,
  getReferenceProjectsByLocation,
  referenceLocations,
} from "@/content/reference-projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

interface LocationPageProps {
  params: Promise<{ location: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return referenceLocations.map((location) => ({ location: location.slug }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { location: locationSlug } = await params;
  const location = getReferenceLocation(locationSlug);

  if (!location) return {};

  const projects = getReferenceProjectsByLocation(location.slug);
  const customerTypes = [...new Set(projects.map((project) => project.customerType))];
  const projectScope =
    customerTypes.length > 1
      ? "private und gewerbliche Projekte"
      : customerTypes[0] === "Gewerbe"
        ? "gewerbliche Projekte"
        : "private Projekte";

  return buildMetadata({
    title: `Photovoltaik-Referenzen in ${location.name} | Energie-Kraft Süd`,
    description: `${projects.length} echte Photovoltaik-Referenzen aus ${location.name}: ${projectScope} aus dem regionalen Bestand von Energie-Kraft Süd.`,
    canonicalPath: `/pv-referenzen/${location.slug}`,
  });
}

export default async function ReferenceLocationPage({ params }: LocationPageProps) {
  const { location: locationSlug } = await params;
  const location = getReferenceLocation(locationSlug);

  if (!location) notFound();

  const projects = getReferenceProjectsByLocation(location.slug);
  const nearbyLocations = referenceLocations
    .filter((entry) => entry.slug !== location.slug)
    .slice(0, 4);
  const seo = {
    title: `Photovoltaik-Referenzen in ${location.name} | Energie-Kraft Süd`,
    description: `${projects.length} echte Photovoltaik-Referenzen aus ${location.name} im regionalen Projektbestand von Energie-Kraft Süd.`,
    canonicalPath: `/pv-referenzen/${location.slug}`,
  };

  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: location.name,
          currentPath: seo.canonicalPath,
          items: [{ label: "PV-Referenzen", path: "/pv-referenzen" }],
        })}
      />
      <main id="main-content">
        <Breadcrumbs
          currentLabel={location.name}
          items={[{ label: "PV-Referenzen", href: "/pv-referenzen" }]}
        />

        <section className="bg-surface-soft py-16 md:py-24" aria-labelledby="location-title">
          <div className="section-shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow">Landkreis {location.district}</p>
              <h1 id="location-title" className="section-title mt-5 max-w-4xl min-w-0 break-words">
                <span className="block">Photovoltaik-Referenzen</span>
                <span className="block">in {location.name}</span>
              </h1>
            </Reveal>
            <Reveal delay={80}>
              <p className="lead-copy">{location.intro}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{location.context}</p>
            </Reveal>
          </div>
        </section>

        <section className="section-space bg-background" aria-labelledby="projects-title">
          <div className="section-shell">
            <Reveal className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="eyebrow">Reale Projektaufnahmen</p>
                <h2 id="projects-title" className="section-title mt-4 min-w-0 break-words">
                  Anlagen aus {location.name}
                </h2>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                {projects.length} dokumentierte Projekte
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {projects.map((project, index) => (
                <Reveal key={project.id} delay={(index % 2) * 60}>
                  <article id={project.id} className="scroll-mt-32">
                    <figure>
                      <div className="bg-surface-soft relative aspect-[3/2] overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.imageAlt}
                          fill
                          sizes="(max-width: 767px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="border-border-default flex items-start justify-between gap-4 border-b py-4">
                        <div>
                          <p className="text-brand-primary text-xs font-bold tracking-[0.12em] uppercase">
                            {project.customerType}
                          </p>
                          <h3 className="mt-2 text-xl">{project.category}</h3>
                        </div>
                        <span className="text-sm text-[var(--text-subtle)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </figcaption>
                    </figure>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space bg-surface-soft" aria-labelledby="nearby-title">
          <div className="section-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <p className="eyebrow">Weitere Referenzen</p>
              <h2 id="nearby-title" className="section-title mt-4">
                Weitere Projektorte der Region
              </h2>
            </Reveal>
            <ul className="border-border-strong grid border-y sm:grid-cols-2">
              {nearbyLocations.map((entry) => (
                <li key={entry.slug} className="border-border-strong border-b p-5 sm:border-l">
                  <Link
                    href={`/pv-referenzen/${entry.slug}`}
                    className="text-brand-primary flex min-h-11 items-center justify-between gap-4 font-semibold underline-offset-4 hover:underline"
                  >
                    {entry.name} <ArrowRightIcon className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="brand-gradient py-16 text-white md:py-20">
          <div className="section-shell grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow eyebrow-on-dark">Ihr Dach in {location.name}</p>
              <h2 className="mt-4 max-w-3xl text-3xl text-white md:text-4xl">
                Lassen Sie uns Ihr PV-Projekt individuell prüfen.
              </h2>
            </div>
            <Link href={CONTACT_FORM_HREF} className="button-light">
              PV-Projekt starten
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
