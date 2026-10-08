import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import config from "../../next.config";

const expected = [
  ["/service-und-team", "/service-und-wartung/service-und-team"],
  ["/unternehmen", "/ueber-uns"],
  ["/jobs-karriere", "/jobs"],
  ["/bewerbung-formular", "/bewerbung"],
  ["/kontakt-formular", "/kontakt#kontaktformular"],
  ["/finanzierung-und-foerderung", "/service-und-wartung/finanzierung-und-foerderung"],
  ["/wartung-und-reinigung", "/service-und-wartung"],
];

describe("Final legacy redirects", () => {
  it("maps the seven documented paths directly to existing final routes", async () => {
    const redirects = await config.redirects!();
    for (const [source, destination] of expected) {
      expect(redirects.filter((redirect) => redirect.source === source)).toEqual([
        { source, destination, permanent: true },
      ]);
      const path = destination.split("#")[0];
      expect(redirects.some((redirect) => redirect.source === path)).toBe(false);
      expect(existsSync(`src/app/(site)${path}/page.tsx`)).toBe(true);
    }
  });

  it("preserves global slash normalization and avoids redirect loops", async () => {
    expect(config.trailingSlash).toBe(false);
    expect(config.skipTrailingSlashRedirect).not.toBe(true);
    const redirects = await config.redirects!();
    for (const redirect of redirects) {
      expect(
        redirects.some((other) => other.source === redirect.destination.split(/[?#]/)[0]),
      ).toBe(false);
    }
  });
});
