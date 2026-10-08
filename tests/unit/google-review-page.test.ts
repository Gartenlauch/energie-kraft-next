import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: {
    NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de",
    isProduction: true,
  },
}));
vi.mock("@/lib/faq/public-repository", () => ({
  getPublicFaqCatalog: async () => ({ entries: [] }),
}));

import GoogleReviewPage, { generateMetadata } from "@/app/google-bewertung/page";
import sitemap from "@/app/sitemap";
import { headers } from "next/headers";

vi.mock("next/headers", () => ({ headers: vi.fn() }));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Google review invitation", () => {
  it.each(["false", "true"])("keeps page-specific noindex with indexing %s", async (enabled) => {
    vi.stubEnv("SEARCH_INDEXING_ENABLED", enabled);
    vi.mocked(headers).mockResolvedValue(
      new Headers({ host: "www.energie-kraft.de" }) as Awaited<ReturnType<typeof headers>>,
    );
    expect((await generateMetadata()).robots).toEqual({ index: false, follow: true });
  });

  it.each([undefined, "bad/host", "bad:port"])(
    "handles invalid or missing hosts (%s)",
    async (host) => {
      vi.mocked(headers).mockResolvedValue(
        new Headers(host ? { host } : {}) as Awaited<ReturnType<typeof headers>>,
      );
      const metadata = await generateMetadata();
      expect(metadata.openGraph).toMatchObject({
        url: "https://www.energie-kraft.de/google-bewertung",
        images: [
          {
            url: "https://www.energie-kraft.de/images/google-bewertung/google-bewertung-share.jpg",
          },
        ],
      });
    },
  );

  it("derives all site icons from the official, unchanged signet", async () => {
    const source = readFileSync("public/brand/energie-kraft/eksued-signet-website.svg", "utf8");
    const svg = readFileSync("src/app/icon.svg", "utf8");
    expect(svg).toBe(
      source
        .replace('width="52.98" height="51.63"', 'width="64" height="64"')
        .replace('viewBox="0 0 52.98 51.63"', 'viewBox="-5.51 -6.185 64 64"'),
    );
    const apple = readFileSync("src/app/apple-icon.png");
    expect(
      apple.equals(
        await sharp(Buffer.from(svg))
          .resize(180, 180)
          .flatten({ background: "#ffffff" })
          .png()
          .toBuffer(),
      ),
    ).toBe(true);
    const ico = readFileSync("src/app/favicon.ico");
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBe(3);
    for (const [index, size] of [16, 32, 48].entries()) {
      const entry = 6 + index * 16;
      const offset = ico.readUInt32LE(entry + 12);
      const length = ico.readUInt32LE(entry + 8);
      expect(ico[entry]).toBe(size);
      expect(
        ico
          .subarray(offset, offset + length)
          .equals(await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()),
      ).toBe(true);
    }
  });

  it("renders one heading and a deliberate, accessible external link without redirect", () => {
    const html = renderToStaticMarkup(GoogleReviewPage());
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Ihre Meinung zählt.");
    expect(html).toContain('href="https://g.page/r/CbQYaiCf6F9eEBM/review"');
    expect(html).toContain("Google-Bewertung abgeben");
    expect(html).toContain('alt="Energie-Kraft Süd"');
    expect(html).toContain('aria-describedby="google-review-hint"');
    expect(html).not.toMatch(/<script|http-equiv="refresh"|NEXT_REDIRECT/i);
    const source = readFileSync("src/app/google-bewertung/page.tsx", "utf8");
    expect(source).not.toMatch(/redirect\(|location\.(href|replace|assign)|router\.(push|replace)/);
  });

  it.each([
    {
      host: "energie-kraft-next--energie-kraft-next.europe-west4.hosted.app",
      protocol: "https",
      forwarded: true,
    },
    { host: "www.energie-kraft.de", protocol: "https", forwarded: false },
    { host: "localhost:3000", protocol: "http", forwarded: false },
  ])(
    "keeps canonical metadata while using request host $host",
    async ({ host, protocol, forwarded }) => {
      const requestHeaders = new Headers({ host: forwarded ? "internal:8080" : host });
      if (forwarded) {
        requestHeaders.set("x-forwarded-host", `${host}, internal:8080`);
        requestHeaders.set("x-forwarded-proto", `${protocol}, http`);
      }
      vi.mocked(headers).mockResolvedValue(requestHeaders as Awaited<ReturnType<typeof headers>>);
      const metadata = await generateMetadata();
      expect(metadata.robots).toEqual({ index: false, follow: true });
      expect(metadata.alternates?.canonical).toBe("https://www.energie-kraft.de/google-bewertung");
      expect(metadata.openGraph).toMatchObject({
        title: "Energie-Kraft Süd | Ihre Meinung zählt",
        description:
          "Waren Sie mit unserer Arbeit zufrieden? Wir freuen uns über Ihre Bewertung bei Google.",
        type: "website",
        url: `${protocol}://${host}/google-bewertung`,
        images: [
          {
            url: `${protocol}://${host}/images/google-bewertung/google-bewertung-share.jpg`,
            type: "image/jpeg",
            width: 1200,
            height: 630,
            alt: expect.any(String),
          },
        ],
      });
    },
  );

  it("excludes the invitation from the production sitemap", async () => {
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.some(({ url }) => url.includes("/google-bewertung"))).toBe(false);
  });

  it("ships the social image as a 1200 × 630 sRGB JPEG", async () => {
    const image = await sharp(
      "public/images/google-bewertung/google-bewertung-share.jpg",
    ).metadata();
    expect(image).toMatchObject({ format: "jpeg", width: 1200, height: 630, space: "srgb" });
  });
});
