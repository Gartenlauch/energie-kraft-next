import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { ArrowRightIcon } from "@/components/ui/icons";
import { referenceGroups } from "@/content/reference-projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

const seo = {
  title: "Photovoltaik-Referenzen aus der Region | Energie-Kraft Süd",
  description: "Bilder realisierter Photovoltaikanlagen aus dem Berchtesgadener Land und dem Landkreis Traunstein.",
  canonicalPath: "/referenzen",
};
export const metadata: Metadata = buildMetadata(seo);

export default function ReferencesPage() {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript data={buildBreadcrumbJsonLd({ currentLabel: "Referenzen", currentPath: seo.canonicalPath })} />
      <main id="main-content">
        <Breadcrumbs currentLabel="Referenzen" />
        <section className="bg-surface-soft py-16 md:py-24">
          <div className="section-shell">
            <p className="eyebrow">Referenzen</p>
            <h1 className="section-title mt-4 max-w-4xl">Photovoltaik-Projekte aus unserer Region</h1>
            <p className="lead-copy mt-6 max-w-2xl">Eine Auswahl realisierter Anlagen aus dem Berchtesgadener Land und dem Landkreis Traunstein.</p>
          </div>
        </section>
        <section className="section-space bg-background" aria-label="Referenzorte">
          <div className="section-shell grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {referenceGroups.map((group, index) => {
              const cover = group.projects.find((project) => project.image === group.overviewImage)!;
              return (
                <Link key={group.groupSlug} href={`/referenzen/${group.groupSlug}`} className="group block min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-primary)]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[0.35rem] bg-surface-soft">
                    <Image src={cover.image} alt={cover.alt} fill priority={index < 3} sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 48vw, 32vw" className="object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.035] group-focus-visible:scale-[1.035]" />
                  </div>
                  <div className="border-border-default mt-4 flex items-center justify-between gap-3 border-b pb-4">
                    <h2 className="text-xl font-semibold tracking-tight text-brand-dark md:text-2xl">{group.groupName}</h2>
                    <ArrowRightIcon className="text-brand-primary size-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
