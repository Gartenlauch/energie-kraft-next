import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

vi.mock("@/config/env/public", () => ({
  publicEnv: { isProduction: true, NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("@/lib/faq/public-repository", () => ({
  getPublicFaqCatalog: async () => ({ entries: [] }),
}));

import SonnenInsolvenzPage from "@/app/(site)/sonnen-insolvenz/page";
import { SonnenServiceNotice } from "@/components/marketing/sonnen-service-notice";
import { sonnenInformation as info } from "@/content/sonnen-insolvenz";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import sitemap from "@/app/sitemap";

afterEach(() => vi.unstubAllEnvs());

describe("sonnen service information", () => {
  it("renders the four customer questions, valid Article data and existing service target", () => {
    const html = renderToStaticMarkup(createElement(SonnenInsolvenzPage));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain(info.title);
    for (const question of info.questions) expect(html).toContain(question.title);
    expect(html).toContain(`href="${CONTACT_FORM_HREF}"`);
    expect(html.match(new RegExp(`href="${CONTACT_FORM_HREF}"`, "g"))).toHaveLength(2);
    expect(html.split("</header>")[0]).not.toContain(`href="${CONTACT_FORM_HREF}"`);
    expect(html).toContain(
      "Energie-Kraft Süd bleibt Ihr Ansprechpartner für den sonnenBatterie Service.",
    );
    expect(html).toContain(
      "prüfen wir abhängig vom jeweiligen Anliegen und unseren verfügbaren Kapazitäten.",
    );
    expect(html).not.toContain("Auch wenn Ihre Anlage von einem anderen Betrieb stammt");
    const schemas = [
      ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/g),
    ].map((match) => JSON.parse(match[1]));
    const article = schemas.find((schema) => schema["@type"] === "Article");
    expect(article.datePublished).toBe("2026-10-22");
    expect(article.headline).toBe(info.title);
    expect(article.publisher["@id"]).toBe("https://www.energie-kraft.de/#organization");
    expect(article.citation).toEqual(info.sources.map((source) => source.href));
    expect(schemas.some((schema) => schema["@type"] === "FAQPage")).toBe(false);
  });

  it("uses the central canonical, sitemap and existing index guard", async () => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
    expect(buildMetadata(info.seo).robots).toBeUndefined();
    expect(buildMetadata(info.seo).alternates?.canonical).toBe(
      "https://www.energie-kraft.de/sonnen-insolvenz",
    );
    expect(await sitemap()).toContainEqual(
      expect.objectContaining({ url: "https://www.energie-kraft.de/sonnen-insolvenz" }),
    );
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");
    expect(buildMetadata(info.seo).robots).toEqual(expect.objectContaining({ index: false }));
  });

  it("links all four notices and preserves both service actions", () => {
    for (const variant of ["home", "storage", "commercial", "service"] as const) {
      const html = renderToStaticMarkup(createElement(SonnenServiceNotice, { variant }));
      expect(html).toContain(`href="${info.path}"`);
      if (variant === "home") {
        expect(html).toContain("bg-brand-primary text-white");
        expect(html).toContain("Aktuelle Information zur sonnen-Insolvenz");
        expect(html).toContain('class="button-light"');
        expect(html).toContain("section-shell grid gap-7 py-9 md:py-12");
      }
      if (variant === "service") {
        expect(html).toContain(`href="${CONTACT_FORM_HREF}"`);
        expect(html).toContain("Service anfragen");
        expect(html).toContain("Aktuelle Informationen");
      }
    }
    for (const src of [info.image.src, info.image.mobileSrc])
      expect(existsSync(resolve("public", src.slice(1)))).toBe(true);
  });
});
