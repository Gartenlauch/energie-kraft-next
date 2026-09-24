import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/site", () => ({
  siteConfig: {
    canonicalBaseUrl: "https://www.energie-kraft.de",
    locale: "de_DE",
    name: "Energie-Kraft Süd",
  },
}));

import { buildRobots } from "@/app/robots";
import {
  isSearchIndexingEnabled,
  SEARCH_NO_INDEX_DIRECTIVE,
} from "@/config/search-indexing";
import { buildMetadata } from "@/lib/seo/metadata";
import nextConfig from "../../next.config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("search indexing launch guard", () => {
  const pageSeo = {
    title: "Testseite",
    description: "Beschreibung",
    canonicalPath: "/testseite",
  };

  it("fails safe when the flag is missing or is not exactly true", () => {
    expect(isSearchIndexingEnabled(undefined)).toBe(false);
    expect(isSearchIndexingEnabled("false")).toBe(false);
    expect(isSearchIndexingEnabled("TRUE")).toBe(false);
    expect(isSearchIndexingEnabled(" true ")).toBe(false);
  });

  it("enables indexing only for the exact true value", () => {
    expect(isSearchIndexingEnabled("true")).toBe(true);
  });

  it("allows pre-launch crawling without exposing a sitemap or host", () => {
    const config = buildRobots(false);

    expect(config.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    });
    expect(config.rules).not.toMatchObject({ disallow: "/" });
    expect(config).not.toHaveProperty("sitemap");
    expect(config).not.toHaveProperty("host");
  });

  it("publishes the production sitemap and host after launch", () => {
    const config = buildRobots(true);

    expect(config).toMatchObject({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/"],
      },
      sitemap: "https://www.energie-kraft.de/sitemap.xml",
      host: "https://www.energie-kraft.de",
    });
  });

  it("uses the complete global noindex response directive", () => {
    expect(SEARCH_NO_INDEX_DIRECTIVE).toBe(
      "noindex, nofollow, noarchive, nosnippet",
    );
  });

  it("emits the global response header until indexing is enabled", async () => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");
    const guardedHeaders = await nextConfig.headers?.();

    expect(guardedHeaders).toEqual([
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: SEARCH_NO_INDEX_DIRECTIVE,
          },
        ],
      },
    ]);

    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
    expect(await nextConfig.headers?.()).toEqual([]);
  });

  it("keeps ordinary public pages noindex before launch", () => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");

    expect(buildMetadata({ ...pageSeo, noIndex: false }).robots).toEqual({
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    });
  });

  it("leaves ordinary public pages indexable after launch", () => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");

    expect(buildMetadata({ ...pageSeo, noIndex: false }).robots).toBeUndefined();
  });

  it("keeps page-specific noindex protection after launch", () => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");

    expect(buildMetadata({ ...pageSeo, noIndex: true }).robots).toEqual({
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    });
  });
});
