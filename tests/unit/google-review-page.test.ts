import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: {
    NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de",
    isProduction: true,
  },
}));
vi.mock("@/lib/faq/public-repository", () => ({
  getPublicFaqCatalog: async () => ({ entries: [] }),
}));

import GoogleReviewPage, { metadata } from "@/app/google-bewertung/page";
import sitemap from "@/app/sitemap";

describe("Google review invitation", () => {
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

  it("provides noindex, follow and complete canonical social metadata", () => {
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates?.canonical).toBe("https://www.energie-kraft.de/google-bewertung");
    expect(metadata.openGraph).toMatchObject({
      title: "Energie-Kraft Süd | Ihre Meinung zählt",
      description:
        "Waren Sie mit unserer Arbeit zufrieden? Wir freuen uns über Ihre Bewertung bei Google.",
      type: "website",
      url: "https://www.energie-kraft.de/google-bewertung",
      images: [
        {
          url: "https://www.energie-kraft.de/images/google-bewertung/google-bewertung-share.jpg",
          width: 1200,
          height: 630,
          alt: expect.any(String),
        },
      ],
    });
  });

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
