import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { isProduction: true, NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("@/lib/faq/public-repository", () => ({ getPublicFaqCatalog: async () => ({ entries: [], categories: [] }) }));
vi.mock("@/components/marketing/reference-gallery", () => ({
  ReferenceGallery: ({ projects }: { projects: Array<{ id: string }> }) => createElement("div", {
    "data-project-ids": projects.map((project) => project.id).join(","),
  }),
}));

import ReferencesPage from "@/app/(site)/referenzen/page";
import GroupPage, { generateMetadata, generateStaticParams, dynamicParams } from "@/app/(site)/referenzen/[location]/page";
import sitemap from "@/app/sitemap";
import { referenceGroups } from "@/content/reference-projects";
import { ReferenceProjectsSection } from "@/components/marketing/marketing-sections";
import nextConfig from "../../next.config";

const oldSlugs = ["ainring", "bad-reichenhall", "berchtesgaden", "freilassing", "hammerau", "kirchanschoering", "laufen", "piding", "reit-im-winkl", "saaldorf-surheim", "tittmoning", "traunstein"];
const newSlugs = ["chieming", "fridolfing", "schoenau-am-koenigssee", "seeon-seebruck", "weitere-referenzen-berchtesgadener-land"];

describe("reference group pages and SEO", () => {
  it("generates exactly the existing twelve and new five group routes, all present in the production sitemap", async () => {
    expect(dynamicParams).toBe(false);
    const locations = generateStaticParams().map((params) => params.location).sort();
    expect(locations).toEqual([...oldSlugs, ...newSlugs].sort());
    const urls = (await sitemap()).map((entry) => new URL(entry.url).pathname);
    for (const slug of locations) expect(urls.filter((url) => url === `/referenzen/${slug}`)).toHaveLength(1);
    expect(locations).not.toContain("schnaitsee");
    expect(locations).not.toContain("neue-referenzen");
  });

  it.each([...oldSlugs, ...newSlugs])("keeps canonical, OpenGraph, breadcrumb, JSON-LD and gallery consistent for %s", async (slug) => {
    const props = { params: Promise.resolve({ location: slug }) };
    const group = referenceGroups.find((candidate) => candidate.groupSlug === slug)!;
    const canonical = `https://www.energie-kraft.de/referenzen/${slug}`;
    const metadata = await generateMetadata(props);
    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.openGraph?.url).toBe(canonical);
    const html = renderToStaticMarkup(await GroupPage(props));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('href="/referenzen"');
    expect(html).toContain('aria-current="page"');
    const structured = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]));
    expect(structured).toEqual(expect.arrayContaining([
      expect.objectContaining({ "@type": "WebPage", url: canonical }),
      expect.objectContaining({ "@type": "BreadcrumbList", itemListElement: expect.arrayContaining([
        expect.objectContaining({ name: group.groupName, item: canonical }),
      ]) }),
    ]));
    const renderedIds = html.match(/data-project-ids="([^"]+)"/)?.[1].split(",");
    expect(renderedIds).toEqual(group.projects.map((project) => project.id));
  });

  it("uses natural regional headings, retains all overview links and contains portrait covers", async () => {
    const html = renderToStaticMarkup(createElement(ReferencesPage));
    for (const group of referenceGroups) expect(html).toContain(`href="/referenzen/${group.groupSlug}"`);
    const seeon = html.split('href="/referenzen/seeon-seebruck"')[1].split("</a>")[0];
    expect(seeon).toContain("object-contain");
    const traunstein = renderToStaticMarkup(await GroupPage({ params: Promise.resolve({ location: "traunstein" }) }));
    expect(traunstein).toContain("Photovoltaik-Referenzen aus Traunstein und Umgebung");
    expect(traunstein).not.toContain("im Raum Traunstein");
    const regional = renderToStaticMarkup(await GroupPage({ params: Promise.resolve({ location: newSlugs[4] }) }));
    expect(regional).toContain("Photovoltaik-Referenzen aus dem Berchtesgadener Land");
  });

  it("preserves valid homepage reference tiles and avoids redirects for all active groups", async () => {
    const html = renderToStaticMarkup(createElement(ReferenceProjectsSection, { projects: referenceGroups }));
    const tiles = [...html.matchAll(/href="\/referenzen\/([a-z-]+)"/g)].map((match) => match[1]);
    expect(tiles).toEqual(oldSlugs.slice(0, 4));
    const redirects = await nextConfig.redirects!();
    for (const slug of [...oldSlugs, ...newSlugs]) expect(redirects.some((redirect) => redirect.source === `/referenzen/${slug}`)).toBe(false);
  });
});
