// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as CookieConsent from "vanilla-cookieconsent";
import { isExternalWebLink } from "@/lib/navigation/link-behavior";
import { PublicLink } from "@/components/ui/public-link";
import { CustomerReviewsSection } from "@/components/marketing/customer-reviews-section";
import { ConsentManager } from "@/components/consent/consent-manager";
import type { ReviewCollection } from "@/lib/reviews/types";

vi.mock("embla-carousel-react", () => ({ default: () => [() => {}, undefined] }));
vi.mock("@/config/env/public", () => {
  throw new Error("PublicLink must not load the environment validator");
});
const base = "https://www.energie-kraft.de";
beforeEach(() => vi.stubEnv("NEXT_PUBLIC_CANONICAL_BASE_URL", base));
afterEach(() => vi.unstubAllEnvs());

describe("public link policy", () => {
  describe("review links and consent", () => {
    const collection: ReviewCollection = {
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
    };
    let container: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
      vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
      localStorage.clear();
      container = document.createElement("div");
      document.body.append(container);
      root = createRoot(container);
    });

    afterEach(() => {
      act(() => root.unmount());
      container.remove();
      CookieConsent.reset(true);
      localStorage.clear();
      vi.unstubAllGlobals();
    });

    it("renders only the internal privacy link in server HTML without consent", () => {
      const html = renderToStaticMarkup(createElement(CustomerReviewsSection, collection));
      const links = html.match(/<a\b[^>]*>/g) ?? [];
      expect(links).toHaveLength(1);
      expect(links[0]).toContain('href="/datenschutz"');
      expect(links[0]).not.toContain('target="_blank"');
      expect(html).toContain("Google-Bewertungen aktivieren");
      expect(html).not.toMatch(/maps\.google\.com|Test Reviewer|Fixture only/);
    });

    it("renders all seven secure review links only after Google reviews consent without importing validation", async () => {
      await act(async () => root.render(createElement("div", null,
        createElement(ConsentManager),
        createElement(CustomerReviewsSection, collection),
      )));
      const reviewLinks = () => Array.from(container.querySelectorAll<HTMLAnchorElement>(
        '[aria-labelledby="customer-reviews-heading"] a',
      ));
      act(() => CookieConsent.acceptCategory([]));
      expect(reviewLinks().map((link) => link.getAttribute("href"))).toEqual(["/datenschutz"]);
      expect(reviewLinks()[0].target).toBe("");
      expect(container.querySelector("blockquote")).toBeNull();

      act(() => CookieConsent.acceptCategory(["necessary", "googleReviews"]));
      const links = reviewLinks();
      // Four review/author actions plus the three existing Google policy links.
      expect(links).toHaveLength(7);
      expect(links.map((link) => link.href)).toEqual(expect.arrayContaining([
        "https://maps.google.com/test-author",
        "https://maps.google.com/test-review",
        "https://maps.google.com/test-overview",
        "https://maps.google.com/test-write",
        "https://support.google.com/contributionpolicy/answer/7400114",
        "https://maps.google.com/help/terms_maps.html",
        "https://policies.google.com/privacy",
      ]));
      for (const link of links) {
        expect(link.target).toBe("_blank");
        expect(link.rel).toBe("noopener noreferrer");
        expect(link.textContent).toContain("öffnet in neuem Tab");
      }

      act(() => CookieConsent.acceptCategory([]));
      expect(reviewLinks().map((link) => link.getAttribute("href"))).toEqual(["/datenschutz"]);
      expect(container.querySelector("blockquote")).toBeNull();
    });
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
