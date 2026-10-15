import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ReferenceGallery } from "@/components/marketing/reference-gallery";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { getReferenceGroup, referenceGroups, type ReferenceGroup } from "@/content/reference-projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

interface Props { params: Promise<{ location: string }> }
export const dynamicParams = false;
export function generateStaticParams() {
  return referenceGroups.map((group) => ({ location: group.groupSlug }));
}

function title(name: string, slug: string) {
  if (slug === "traunstein") return "Photovoltaik-Referenzen aus Traunstein und Umgebung";
  if (slug === "weitere-referenzen-berchtesgadener-land") return "Photovoltaik-Referenzen aus dem Berchtesgadener Land";
  return `Photovoltaik-Referenzen in ${name}`;
}

function groupSeo(group: ReferenceGroup) {
  const area = group.groupSlug === "traunstein" ? "aus Traunstein und Umgebung" :
    group.groupSlug === "weitere-referenzen-berchtesgadener-land" ? "aus dem Berchtesgadener Land" : `in ${group.groupName}`;
  return {
    title: `${title(group.groupName, group.groupSlug)} | Energie-Kraft Süd`,
    description: `Bilder realisierter Photovoltaikanlagen ${area} aus dem regionalen Referenzarchiv von Energie-Kraft Süd.`,
    canonicalPath: `/referenzen/${group.groupSlug}`,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const group = getReferenceGroup((await params).location);
  if (!group) return {};
  return buildMetadata(groupSeo(group));
}

export default async function ReferenceGroupPage({ params }: Props) {
  const group = getReferenceGroup((await params).location);
  if (!group) notFound();
  const seo = groupSeo(group);
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript data={buildBreadcrumbJsonLd({ currentLabel: group.groupName, currentPath: seo.canonicalPath, items: [{ label: "Referenzen", path: "/referenzen" }] })} />
      <main id="main-content">
        <Breadcrumbs currentLabel={group.groupName} items={[{ label: "Referenzen", href: "/referenzen" }]} />
        <section className="bg-surface-soft py-14 md:py-20">
          <div className="section-shell">
            <p className="eyebrow">Referenzen</p>
            <h1 className="section-title mt-4 max-w-4xl">{title(group.groupName, group.groupSlug)}</h1>
          </div>
        </section>
        <section className="section-space bg-background" aria-label={`Referenzbilder: ${group.groupName}`}>
          <div className="section-shell"><ReferenceGallery projects={group.projects} /></div>
        </section>
      </main>
    </>
  );
}
