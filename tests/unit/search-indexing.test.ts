import { afterEach, describe, expect, it, vi } from "vitest";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { IncomingMessage } from "node:http";
import { Socket } from "node:net";
import { readFileSync } from "node:fs";
import { matchHas } from "next/dist/shared/lib/router/utils/prepare-destination";
import { resolveSitemap } from "next/dist/build/webpack/loaders/metadata/resolve-route-data";

vi.mock("next/font/local", () => ({ default: () => ({ variable: "font-montserrat" }) }));
vi.mock("@/config/env/public", () => ({ publicEnv: { isProduction: true } }));
vi.mock("@/lib/faq/public-repository", () => ({
  getPublicFaqCatalog: async () => ({ entries: [{ href: "/faq/photovoltaik/stabile-frage" }] }),
}));

vi.mock("@/config/site", () => ({
  siteConfig: {
    canonicalBaseUrl: "https://www.energie-kraft.de",
    locale: "de_DE",
    name: "Energie-Kraft Süd",
  },
}));

import robots, { buildRobots } from "@/app/robots";
import { generateMetadata } from "@/app/layout";
import sitemap from "@/app/sitemap";
import {
  isSearchIndexingEnabled,
  SEARCH_NO_INDEX_DIRECTIVE,
} from "@/config/search-indexing";
import { buildMetadata } from "@/lib/seo/metadata";
import { configuratorProducts } from "@/content/configurators/landing";
import { metadata as privacyMetadata } from "@/app/(site)/datenschutz/page";
import nextConfig from "../../next.config";

async function responseHeaders(
  host: string | null,
  path = "/",
  forwardedHost?: string,
  protocol: string | null = "https",
) {
  const request = new IncomingMessage(new Socket());
  request.headers = {
    ...(host === null ? {} : { host }),
    ...(protocol === null ? {} : { "x-forwarded-proto": protocol }),
    ...(forwardedHost
      ? { "x-forwarded-host": forwardedHost, forwarded: `host=${forwardedHost}` }
      : {}),
  };
  const rules = await nextConfig.headers!();
  return rules
    .filter(
      (rule) =>
        getPathMatch(rule.source, { strict: true })(path) &&
        matchHas(request, {}, rule.has, rule.missing),
    )
    .flatMap((rule) => rule.headers);
}

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
    expect(SEARCH_NO_INDEX_DIRECTIVE).toBe("noindex, nofollow, noarchive, nosnippet");
  });

  it("emits the global response header until indexing is enabled", async () => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "production");
    expect(await responseHeaders("www.energie-kraft.de")).toEqual([
      { key: "X-Robots-Tag", value: SEARCH_NO_INDEX_DIRECTIVE },
    ]);

    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
    expect(await responseHeaders("www.energie-kraft.de")).toEqual([]);
    expect(await responseHeaders("review.energie-kraft.de")).toEqual([]);
  });

  it.each([
    ["/", true],
    ["/photovoltaik", true],
    ["/kontakt", true],
    ["/konfigurator", true],
    ["/admin/leads", true],
    ["/google-bewertung", true],
    ["/images/google-bewertung/google-bewertung-share-v2.jpg", true],
    ["/brand/energie-kraft/eksued-logo-website.svg", true],
    ["/google-bewertung/extra", true],
    ["/google-bewertung-extra", true],
    ["/images/google-bewertung/other.jpg", true],
    ["/images/google-bewertung/google-bewertung-shareXjpg", true],
    ["/images/google-bewertung/google-bewertung-share-v2.jpg/extra", true],
  ])("applies the pre-launch header to %s: %s", async (path, guarded) => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");
    // Use the installed Next.js path and condition matchers.
    expect(await responseHeaders("www.energie-kraft.de", path)).toEqual(
      guarded ? [{ key: "X-Robots-Tag", value: SEARCH_NO_INDEX_DIRECTIVE }] : [],
    );
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
    expect(buildMetadata(pageSeo)).not.toHaveProperty("robots");
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

describe("single-switch indexing, headers, metadata and robots", () => {
  it.each([undefined, "false", "FALSE", "TRUE", " true ", "", "1", "true"])(
    "uses only the exact switch value across hosts and environments (%s)",
    async (flag) => {
      vi.stubEnv("SEARCH_INDEXING_ENABLED", flag);
      const allowed = flag === "true";
      for (const siteEnv of ["production", "local", "ci", undefined]) {
        vi.stubEnv("NEXT_PUBLIC_SITE_ENV", siteEnv);
        expect((await generateMetadata()).robots).toEqual(
          allowed ? undefined : {
            index: false, follow: false, noarchive: true, nosnippet: true,
          },
        );
        const result = await robots();
        expect(result.sitemap).toBe(allowed ? "https://www.energie-kraft.de/sitemap.xml" : undefined);
        expect(result.host).toBe(allowed ? "https://www.energie-kraft.de" : undefined);
        for (const [host, protocol] of [
          ["www.energie-kraft.de", "https"],
          ["review.energie-kraft.de", "https"],
          ["energie-kraft-next--energie-kraft-next.europe-west4.hosted.app", "https"],
          ["internal.run.app", null],
          ["localhost:3000", "http"],
          [null, "https,http"],
        ]) {
          expect(await responseHeaders(host, "/photovoltaik", "spoof.example", protocol)).toEqual(
            allowed ? [] : [{ key: "X-Robots-Tag", value: SEARCH_NO_INDEX_DIRECTIVE }],
          );
        }
      }
    },
  );

  it.each(["false", "true"])("retains privacy, wizard and admin exclusions with indexing %s", async (flag) => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", flag);
    expect(privacyMetadata.robots).toMatchObject({ index: false });
    for (const product of Object.values(configuratorProducts)) {
      expect(buildMetadata(product.seo).robots).toMatchObject({ index: false });
    }
    for (const file of [
      "src/app/(admin)/admin/layout.tsx",
      "src/app/(admin-auth)/admin/login/page.tsx",
    ]) {
      expect(readFileSync(file, "utf8")).toMatch(/robots:\s*\{\s*index: false/);
    }
    const urls = (await sitemap()).map(({ url }) => new URL(url).pathname);
    expect(urls).not.toContain("/datenschutz");
    expect(urls).not.toContain("/google-bewertung");
    expect(
      urls.some((path) => path.startsWith("/admin") || path.startsWith("/konfigurator/")),
    ).toBe(false);
  });

  it("does not change sitemap URLs or production canonicals with the launch flag", async () => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");
    const before = await sitemap();
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
    expect(await sitemap()).toEqual(before);
    expect(before).toHaveLength(44); // 25 configured + 17 reference groups + FAQ hub + fixture detail.
    expect(before.every(({ url }) => new URL(url).origin === "https://www.energie-kraft.de")).toBe(
      true,
    );
    expect(before.some(({ url }) => url.includes("?"))).toBe(false);
    expect(before).toContainEqual(
      expect.objectContaining({
        url: "https://www.energie-kraft.de/faq/photovoltaik/stabile-frage",
      }),
    );
    const xml = resolveSitemap(before);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml.match(/<loc>/g)).toHaveLength(before.length);
    expect(xml).toContain("<loc>https://www.energie-kraft.de/photovoltaik</loc>");
  });
});
