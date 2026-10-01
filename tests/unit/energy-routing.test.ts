import { existsSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: {
    isProduction: true,
    NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de",
  },
}));
vi.mock("@/lib/faq/public-repository", () => ({
  getPublicFaqCatalog: vi.fn(async () => ({ entries: [], categories: [] })),
}));

import config from "../../next.config";
import sitemap from "@/app/sitemap";
import { PUBLIC_ROUTES } from "@/config/routes";
import { sprint8Pages } from "@/content/sprint8-pages";

const mappings = [
  ["/energieloesungen", "/"],
  ["/energieloesungen/photovoltaik-fuer-unternehmen", "/photovoltaik-fuer-unternehmen"],
  ["/energieloesungen/gewerbespeicher", "/gewerbespeicher"],
  ["/energieloesungen/stromtarife-pv", "/stromtarife-pv"],
] as const;

describe("Energy route migration", () => {
  it("redirects only explicit legacy paths permanently and without chains", async () => {
    const redirects = await config.redirects!();
    for (const [source, destination] of mappings) {
      expect(redirects).toContainEqual({ source, destination, permanent: true });
    }
    for (const redirect of redirects) {
      expect(redirect.destination).not.toContain("/energieloesungen");
      expect(redirects.some((other) => other.source === redirect.destination)).toBe(false);
      if (redirect.source.startsWith("/energieloesungen")) {
        expect(redirect.source).not.toMatch(/[:*]/);
      }
    }
    expect(existsSync("src/app/(site)/energieloesungen")).toBe(false);
    expect(PUBLIC_ROUTES).not.toHaveProperty("energieloesungen");
  });

  it("generates a production sitemap containing only final energy URLs", async () => {
    const urls = (await sitemap()).map(({ url }) => new URL(url).pathname);
    for (const path of [
      "/photovoltaik",
      "/stromspeicher",
      "/photovoltaik-fuer-unternehmen",
      "/gewerbespeicher",
      "/waermepumpen",
      "/klimaanlagen",
      "/wallbox",
      "/stromtarife-pv",
    ])
      expect(urls).toContain(path);
    expect(urls.some((url) => url.startsWith("/energieloesungen"))).toBe(false);
    const redirects = await config.redirects!();
    for (const { source } of redirects) expect(urls).not.toContain(source);
  });

  it("uses top-level canonicals without an artificial breadcrumb parent", () => {
    for (const [content, path] of [
      [sprint8Pages.businessPv, "/photovoltaik-fuer-unternehmen"],
      [sprint8Pages.commercialStorage, "/gewerbespeicher"],
      [sprint8Pages.electricityTariffs, "/stromtarife-pv"],
    ] as const) {
      expect(content.seo.canonicalPath).toBe(path);
      expect(content).not.toHaveProperty("breadcrumbItems");
      expect(existsSync(`src/app/(site)${path}/page.tsx`)).toBe(true);
    }
  });
});
