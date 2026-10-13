import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { isExternalWebLink } from "@/lib/navigation/link-behavior";
import { PublicLink } from "@/components/ui/public-link";

vi.mock("@/config/env/public", () => ({
  publicEnv: {
    NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de",
  },
}));
const base = "https://www.energie-kraft.de";

describe("public link policy", () => {
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
