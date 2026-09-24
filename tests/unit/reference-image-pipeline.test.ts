import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseReferenceFilename, slugify, uniqueOutputStem } from "../../scripts/reference-image-lib.mjs";
import { referenceGroups } from "@/content/reference-projects";
import nextConfig from "../../next.config";

describe("reference image metadata", () => {
  it("parses German decimals, integer capacities and explicit Gewerbe", () => {
    expect(parseReferenceFilename("9,60 KWp, Nußdorf.jpg", "Traunstein")).toMatchObject({
      capacityKwp: 9.6, actualLocation: "Nußdorf", customerType: "Privat",
    });
    expect(parseReferenceFilename("12 KWp Ruhpolding.jpg", "Traunstein")).toMatchObject({
      capacityKwp: 12, customerType: "Privat",
    });
    expect(parseReferenceFilename("Gewerbe-95 KWp Siegsdorf.jpg", "Traunstein")).toMatchObject({
      capacityKwp: 95, actualLocation: "Siegsdorf", customerType: "Gewerbe",
    });
    expect(parseReferenceFilename("Referenz-Privat-Waging-10-kWp.jpg", "Traunstein")).toMatchObject({
      capacityKwp: 10, actualLocation: "Waging", customerType: "Privat",
    });
  });

  it("normalizes German group slugs and rejects uncertain filenames", () => {
    expect(slugify("Kirchanschöring")).toBe("kirchanschoering");
    expect(parseReferenceFilename("unbekannt.jpg", "Traunstein")).toHaveProperty("error");
    expect(parseReferenceFilename("Gewerbe-425,5KWp Anring.jpg", "Ainring")).toHaveProperty("error");
  });

  it("assigns collision-safe stable output names", () => {
    const used = new Map<string, number>();
    expect(uniqueOutputStem("privat-10-kwp-laufen", used)).toBe("privat-10-kwp-laufen-01");
    expect(uniqueOutputStem("privat-10-kwp-laufen", used)).toBe("privat-10-kwp-laufen-02");
  });
});

describe("generated reference routes", () => {
  it("covers every source folder with a real cover and nonempty gallery", () => {
    const sourceDirectory = path.join(process.cwd(), "design-input/reference-originals");
    // This local authoring source is intentionally unavailable in CI.
    if (existsSync(sourceDirectory)) {
      const sourceFolders = readdirSync(sourceDirectory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory()).map((entry) => slugify(entry.name)).sort();
      expect(referenceGroups.map((group) => group.groupSlug).sort()).toEqual(sourceFolders);
    }
    for (const group of referenceGroups) {
      expect(group.projects.length).toBeGreaterThan(0);
      expect(group.projects.filter((project) => project.image === group.overviewImage)).toHaveLength(1);
      for (const project of group.projects) {
        expect(project.actualLocation).toBeTruthy();
        expect(project.capacityKwp).toBeGreaterThan(0);
        expect(["Privat", "Gewerbe"]).toContain(project.customerType);
        expect(existsSync(path.join(process.cwd(), "public", project.image))).toBe(true);
      }
    }
    const manifest = readFileSync(path.join(process.cwd(), "src/generated/reference-projects.generated.ts"), "utf8");
    expect(manifest).not.toMatch(/hasBatteryStorage|dataStatus|placeholder/);
  });

  it("permanently redirects the old overview and group routes", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "/pv-referenzen", destination: "/referenzen", permanent: true }),
      expect.objectContaining({ source: "/pv-referenzen/:location", destination: "/referenzen/:location", permanent: true }),
    ]));
  });
});
