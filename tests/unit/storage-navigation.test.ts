import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const location = vi.hoisted(() => ({ pathname: "/stromspeicher" }));
vi.mock("next/navigation", () => ({ usePathname: () => location.pathname }));
vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));

import { SiteFooter } from "@/components/layout/site-footer";
import { siteConfig } from "@/config/site";

describe("Global footer navigation", () => {
  it("shows accessible Facebook and Instagram links between email and DGS membership", () => {
    const html = renderToStaticMarkup(createElement(SiteFooter));
    const emailPosition = html.indexOf(`href="${siteConfig.contact.emailHref}"`);
    const dgsPosition = html.indexOf('alt="Mitglied der Deutschen Gesellschaft');

    for (const [url, label] of [
      ["https://www.facebook.com/EnergieKraftSued/?locale=de_DE", "Facebook"],
      ["https://www.instagram.com/energie_kraft_sued/", "Instagram"],
    ]) {
      const escapedUrl = url.replaceAll("&", "&amp;");
      const link = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)]
        .map((match) => match[0])
        .find((anchor) => anchor.includes(`href="${escapedUrl}"`));

      expect(link).toBeDefined();
      expect(link).toContain(`aria-label="Energie-Kraft Süd auf ${label}"`);
      expect(link).toContain('target="_blank"');
      expect(link).toContain('rel="noopener noreferrer"');
      expect(link).toContain('aria-hidden="true"');
      expect(html.indexOf(`href="${escapedUrl}"`)).toBeGreaterThan(emailPosition);
      expect(html.indexOf(`href="${escapedUrl}"`)).toBeLessThan(dgsPosition);
    }

    expect(siteConfig.social.facebook).toBe("https://www.facebook.com/EnergieKraftSued/?locale=de_DE");
    expect(siteConfig.social.instagram).toBe("https://www.instagram.com/energie_kraft_sued/");
  });

  it("preserves the Stromtarife link on storage and other pages", () => {
    for (const pathname of [
      "/stromspeicher",
      "/photovoltaik",
      "/wallbox",
      "/waermepumpen",
      "/klimaanlagen",
      "/",
    ]) {
      location.pathname = pathname;
      const html = renderToStaticMarkup(createElement(SiteFooter));
      expect(html).toContain('href="/stromtarife-pv"');
      expect(html).toContain("Stromtarife");
    }
  });
});
