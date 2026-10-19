import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isExternalWebLink } from "@/lib/navigation/link-behavior";
import { PublicLink } from "@/components/ui/public-link";
import { CustomerReviewsSection } from "@/components/marketing/customer-reviews-section";

vi.mock("@/config/env/public", () => {
  throw new Error("PublicLink must not load the environment validator");
});
const base = "https://www.energie-kraft.de";
beforeEach(() => vi.stubEnv("NEXT_PUBLIC_CANONICAL_BASE_URL", base));
afterEach(() => vi.unstubAllEnvs());

describe("public link policy", () => {
  it("renders review, author and provider links without importing validation", () => {
    const html = renderToStaticMarkup(createElement(CustomerReviewsSection, {
      reviews: [{
        id: "test-review", provider: "google", author: "Test Reviewer", rating: 5,
        text: "Fixture only", publishedAt: "2026-10-01T12:00:00Z",
        authorUrl: "https://maps.google.com/test-author",
        sourceUrl: "https://maps.google.com/test-review",
      }],
      summaries: [{
        provider: "google", averageRating: 5, totalReviews: 1,
        sourceUrl: "https://maps.google.com/test-overview",
        writeReviewUrl: "https://maps.google.com/test-write",
      }],
    }));
    const links = html.match(/<a\b[^>]*>/g) ?? [];
    // Four review/author actions plus the three existing Google policy links.
    expect(links).toHaveLength(7);
    for (const link of links) {
      expect(link).toContain('target="_blank"');
      expect(link).toContain('rel="noopener noreferrer"');
    }
  });
  it.each([
    "http://localhost:3000/",
    "https://review.energie-kraft.de/",
    "https://www.energie-kraft.de/",
  ])("uses the configured origin %s without the environment validator", (canonical) => {
    vi.stubEnv("NEXT_PUBLIC_CANONICAL_BASE_URL", canonical);
    const href = new URL("kontakt", canonical).href;
    const html = renderToStaticMarkup(createElement(PublicLink, { href }, "Kontakt"));
    expect(html).not.toContain('target="_blank"');
    expect(html).toContain(`href="${href}"`);
    const external = renderToStaticMarkup(
      createElement(PublicLink, { href: "//example.org/info", target: "_self", rel: "nofollow noopener" }, "Quelle"),
    );
    expect(external).toContain('target="_blank"');
    expect(external).toContain('rel="nofollow noopener"');
  });

  it("preserves the existing review-domain rule when production is canonical", () => {
    const html = renderToStaticMarkup(
      createElement(PublicLink, { href: "https://review.energie-kraft.de/kontakt" }, "Kontakt"),
    );
    expect(html).toContain('target="_blank"');
  });

  it.each([
    { pathname: "/kontakt", query: { source: "test" }, hash: "formular" },
    { protocol: "https:", host: "www.energie-kraft.de", pathname: "/kontakt" },
  ])("preserves internal URL objects %j", (href) => {
    expect(renderToStaticMarkup(createElement(PublicLink, { href }, "Kontakt"))).not.toContain('target="_blank"');
  });

  it("handles external URL objects and preserves explicit internal targets", () => {
    expect(renderToStaticMarkup(createElement(PublicLink, {
      href: { protocol: "https:", host: "example.org", pathname: "/info" },
    }, "Quelle"))).toContain('target="_blank"');
    expect(renderToStaticMarkup(createElement(PublicLink, {
      href: "/kontakt", target: "_self", rel: "author",
    }, "Kontakt"))).toContain('target="_self" rel="author"');
  });
  it.each([
    "/kontakt",
    "../kontakt",
    "#quellen",
    "?category=wallbox",
    "mailto:office@energie-kraft.de",
    "tel:+498654771610",
    "https://www.energie-kraft.de/kontakt",
    "https://energie-kraft.de/kontakt",
    "//www.energie-kraft.de/kontakt",
    "https://energie-kraft-next--energie-kraft-next.europe-west4.hosted.app/kontakt",
  ])("keeps %s in the same tab", (href) => {
    expect(isExternalWebLink(href, base)).toBe(false);
    expect(renderToStaticMarkup(createElement(PublicLink, { href }, "Kontakt"))).not.toContain(
      'target="_blank"',
    );
  });
  it.each([
    "https://www.kfw.de/",
    "//www.google.com/maps",
    "https://energie-kraft.de.example.org/",
    "https://example.org/?next=https://www.energie-kraft.de",
  ])("opens %s securely with a screenreader hint", (href) => {
    const html = renderToStaticMarkup(createElement(PublicLink, { href }, "Quelle"));
    expect(isExternalWebLink(href, base)).toBe(true);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener"');
    expect(html).toContain("öffnet in neuem Tab");
  });
  it("recognizes the configured local origin and preserves noreferrer and icon labels", () => {
    expect(isExternalWebLink("http://localhost:3000/kontakt", "http://localhost:3000")).toBe(false);
    const html = renderToStaticMarkup(
      createElement(PublicLink, {
        href: "https://example.org",
        rel: "noreferrer",
        "aria-label": "Facebook",
      }),
    );
    expect(html).toContain('rel="noreferrer noopener"');
    expect(html).toContain('aria-label="Facebook (öffnet in neuem Tab)"');
  });
  it("preserves downloads and the intentional internal privacy new tab", () => {
    const download = renderToStaticMarkup(
      createElement(PublicLink, { href: "https://example.org/info.pdf", download: true }, "PDF"),
    );
    expect(download).not.toContain('target="_blank"');
    const privacy = renderToStaticMarkup(
      createElement(PublicLink, { href: "/datenschutz", target: "_blank" }, "Datenschutz"),
    );
    expect(privacy).toContain('target="_blank"');
    expect(privacy).toContain('rel="noopener"');
    expect(privacy).toContain("öffnet in neuem Tab");
  });
});
