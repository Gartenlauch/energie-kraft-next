import { afterEach, describe, expect, it, vi } from "vitest";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { IncomingMessage } from "node:http";
import { Socket } from "node:net";
import { readFileSync } from "node:fs";
import { headers } from "next/headers";
import { matchHas } from "next/dist/shared/lib/router/utils/prepare-destination";
import { resolveSitemap } from "next/dist/build/webpack/loaders/metadata/resolve-route-data";

vi.mock("next/headers", () => ({ headers: vi.fn() }));
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
  isSearchIndexingEnabledForHost,
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
    expect(await responseHeaders("review.energie-kraft.de")).toEqual([
      { key: "X-Robots-Tag", value: SEARCH_NO_INDEX_DIRECTIVE },
    ]);
  });

  it.each([
    ["/", true],
    ["/photovoltaik", true],
    ["/kontakt", true],
    ["/konfigurator", true],
    ["/admin/leads", true],
    ["/google-bewertung", false],
    ["/images/google-bewertung/google-bewertung-share-v2.jpg", false],
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

describe("host-specific indexing, headers, metadata and robots", () => {
  const hosts = [
    ["www.energie-kraft.de", true],
    ["WWW.ENERGIE-KRAFT.DE", true],
    ["www.energie-kraft.de:443", true],
    ["review.energie-kraft.de", false],
    ["energie-kraft.de", false],
    ["energie-kraft-next--preview.europe-west4.hosted.app", false],
    ["energie-kraft-next--energie-kraft-next.europe-west4.hosted.app", false],
    ["energie-kraft-next.web.app", false],
    ["energie-kraft-next.firebaseapp.com", false],
    ["preview.web.app", false],
    ["service.run.app", false],
    ["localhost:3000", false],
    ["127.0.0.1:3000", false],
    ["www.energie-kraft.de.evil.example", false],
    ["wwwXenergie-kraftXde", false],
    ["www.energie-kraft.de,review.energie-kraft.de", false],
    ["www.energie-kraft.de:3000", false],
    ["https://www.energie-kraft.de", false],
    ["www.energie-kraft.de.", false],
    [null, false],
  ] as const;

  it.each(hosts)("keeps the request policy consistent for %s", async (host, allowed) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "production");
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
    vi.mocked(headers).mockResolvedValue(
      new Headers({
        ...(host === null ? {} : { host }),
        "x-forwarded-proto": "https",
        "x-forwarded-host": "www.energie-kraft.de",
        forwarded: "host=www.energie-kraft.de;proto=https",
      }),
    );
    expect(isSearchIndexingEnabledForHost(host)).toBe(allowed);
    const root = await generateMetadata();
    expect(root.robots).toEqual(
      allowed
        ? undefined
        : {
            index: false,
            follow: false,
            noarchive: true,
            nosnippet: true,
          },
    );
    const result = await robots();
    expect(result.sitemap).toBe(allowed ? "https://www.energie-kraft.de/sitemap.xml" : undefined);
    expect(result.host).toBe(allowed ? "https://www.energie-kraft.de" : undefined);
    expect(await responseHeaders(host, "/", "www.energie-kraft.de")).toEqual(
      allowed ? [] : [{ key: "X-Robots-Tag", value: SEARCH_NO_INDEX_DIRECTIVE }],
    );
    // Next replaces a parent's robots whenever the child owns that key,
    // including when its value is undefined. Assert the inheritance contract.
    const page = buildMetadata({
      title: "Kontakt",
      description: "Kontakt",
      canonicalPath: "/kontakt",
    });
    expect(page).not.toHaveProperty("robots");
    expect(page.alternates?.canonical).toBe("https://www.energie-kraft.de/kontakt");
  });

  it.each([null, "http", "https,http", "http,https", "HTTPS", "https "])(
    "fails closed for an unverified HTTPS transport (%s)",
    async (protocol) => {
      vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "production");
      vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
      // Preserve raw values, including whitespace, for the policy/matcher parity check.
      const requestHeaders = new Map([
        ["host", "www.energie-kraft.de"],
        ["forwarded", "host=www.energie-kraft.de;proto=https"],
        ...(protocol === null ? [] : ([["x-forwarded-proto", protocol]] as [string, string][])),
      ]);
      vi.mocked(headers).mockResolvedValue(
        requestHeaders as unknown as Awaited<ReturnType<typeof headers>>,
      );
      expect((await generateMetadata()).robots).toMatchObject({ index: false });
      expect(await robots()).not.toHaveProperty("sitemap");
      expect(
        await responseHeaders("www.energie-kraft.de", "/", undefined, protocol),
      ).toContainEqual({
        key: "X-Robots-Tag",
        value: SEARCH_NO_INDEX_DIRECTIVE,
      });
    },
  );

  it("retains privacy, wizard and admin exclusions after launch", async () => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
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

  it.each([undefined, "false", "TRUE", " true "])(
    "requires explicit production approval (%s)",
    async (flag) => {
      vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "production");
      vi.stubEnv("SEARCH_INDEXING_ENABLED", flag);
      vi.mocked(headers).mockResolvedValue(new Headers({ host: "www.energie-kraft.de" }));
      expect(isSearchIndexingEnabledForHost("www.energie-kraft.de")).toBe(false);
      expect((await generateMetadata()).robots).toMatchObject({ index: false });
      expect(await robots()).not.toHaveProperty("sitemap");
      expect(await responseHeaders("www.energie-kraft.de")).toContainEqual({
        key: "X-Robots-Tag",
        value: SEARCH_NO_INDEX_DIRECTIVE,
      });
    },
  );

  it.each(["local", "ci", undefined])(
    "never releases local/CI environments (%s)",
    async (siteEnv) => {
      vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
      vi.stubEnv("NEXT_PUBLIC_SITE_ENV", siteEnv);
      expect(isSearchIndexingEnabledForHost("www.energie-kraft.de")).toBe(false);
      expect(await responseHeaders("www.energie-kraft.de")).toContainEqual({
        key: "X-Robots-Tag",
        value: SEARCH_NO_INDEX_DIRECTIVE,
      });
    },
  );

  it("keeps preview assets and social pages noindex even when production sharing is exempt", async () => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");
    for (const path of [
      "/google-bewertung",
      "/images/google-bewertung/google-bewertung-share-v2.jpg",
      "/sitemap.xml",
      "/robots.txt",
    ]) {
      expect(await responseHeaders("review.energie-kraft.de", path)).toContainEqual({
        key: "X-Robots-Tag",
        value: SEARCH_NO_INDEX_DIRECTIVE,
      });
    }
  });

  it("does not change sitemap URLs or production canonicals with the launch flag", async () => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");
    const before = await sitemap();
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
    expect(await sitemap()).toEqual(before);
    expect(before).toHaveLength(43); // 24 configured + 17 reference groups + FAQ hub + fixture detail.
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
