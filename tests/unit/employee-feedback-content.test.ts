import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { activeJobOpenings, jobOpenings } from "@/content/jobs";
import {
  APPLICATION_JOB_TITLES,
  INACTIVE_APPLICATION_JOB_IDS,
} from "../../functions/src/application-validation";
import { partners } from "@/components/marketing/partner-logo-carousel";

describe("employee feedback catalogs", () => {
  it("retains the apprenticeship while keeping public and server availability aligned", () => {
    expect(
      jobOpenings.find((job) => job.id === "ausbildung-elektroniker-gebaeudetechnik")?.active,
    ).toBe(true);
    expect(activeJobOpenings).toHaveLength(4);
    expect(activeJobOpenings.filter((job) => job.id === "ausbildung-elektroniker-gebaeudetechnik")).toHaveLength(1);
    expect(activeJobOpenings.find((job) => job.id === "dachmonteur")?.title).toBe("Dachmonteur:in (w/m/d)");
    expect(activeJobOpenings.find((job) => job.id === "elektriker")?.title).toBe(
      "Elektriker:in (w/m/d)",
    );
    expect(activeJobOpenings.map((job) => job.id).sort()).toEqual(
      Object.keys(APPLICATION_JOB_TITLES)
        .filter((id) => !INACTIVE_APPLICATION_JOB_IDS.includes(id))
        .sort(),
    );
    for (const job of activeJobOpenings)
      expect(APPLICATION_JOB_TITLES[job.id as keyof typeof APPLICATION_JOB_TITLES]).toBe(job.title);
  });
  it("contains fourteen unique partner logos, exactly one Fronius and safe Krannich artwork", () => {
    expect(partners).toHaveLength(14);
    expect(new Set(partners.map((partner) => partner.name)).size).toBe(14);
    expect(partners.filter((partner) => partner.name === "Fronius")).toHaveLength(1);
    expect(partners.map((partner) => partner.name)).toContain("Krannich Solar");
    expect(partners.map((partner) => partner.name)).toContain("Siko");
    for (const partner of partners) expect(existsSync(`public${partner.src}`)).toBe(true);
    const svg = readFileSync("public/brand/partners/krannich-solar-logo.svg", "utf8");
    expect(svg).toContain('viewBox="0 0 136 48.4"');
    expect(svg).not.toMatch(
      /<(?:script|foreignObject|image|iframe)\b|\bon\w+\s*=|(?:href|url)\s*[=(]|<!ENTITY/i,
    );
  });
});
