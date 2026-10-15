import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { assertReferenceSourceCoverage, isReferenceGroupDirectory, parseReferenceFilename, slugify, uniqueOutputStem, validateReferenceImport } from "../../scripts/reference-image-lib.mjs";
import { listReferenceSources } from "../../scripts/reference-import-pipeline.mjs";
import assignments from "../../scripts/reference-import-manifest.json";
import { formatReferenceCaption, referenceGroups } from "@/content/reference-projects";
import nextConfig from "../../next.config";

describe("reference image metadata", () => {
  it("parses German decimals, integer capacities and explicit Gewerbe", () => {
    expect(parseReferenceFilename("9,60 KWp, Nußdorf.jpg", "Traunstein")).toMatchObject({
      capacityKwp: 9.6, actualLocation: "Nußdorf", customerType: null,
    });
    expect(parseReferenceFilename("12 KWp Ruhpolding.jpg", "Traunstein")).toMatchObject({
      capacityKwp: 12, customerType: null,
    });
    expect(parseReferenceFilename("Gewerbe-95 KWp Siegsdorf.jpg", "Traunstein")).toMatchObject({
      capacityKwp: 95, actualLocation: "Siegsdorf", customerType: "Gewerbe",
    });
    expect(parseReferenceFilename("Referenz-Privat-Waging-10-kWp.jpg", "Traunstein")).toMatchObject({
      capacityKwp: 10, actualLocation: "Waging", customerType: "Privat",
    });
  });

  it("supports location-first names without inventing a customer type or silently correcting ambiguous names", () => {
    expect(parseReferenceFilename("Bad Reichenhall 9,6 kWp.jpeg", "neue-referenzen")).toMatchObject({
      actualLocation: "Bad Reichenhall", capacityKwp: 9.6, customerType: null,
    });
    expect(parseReferenceFilename("BadReichenhall10,56kWp.JPG", "neue-referenzen")).toMatchObject({ capacityKwp: 10.56 });
    expect(parseReferenceFilename("Fridolfing2 24 kWp.jpeg", "neue-referenzen")).toHaveProperty("error");
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
  it("excludes only the reserved import inbox and keeps unknown location folders eligible", () => {
    for (const name of ["Ainring", "Chieming", "neue-referenzen-weitere"]) {
      expect(isReferenceGroupDirectory({ name, isDirectory: () => true })).toBe(true);
    }
    expect(isReferenceGroupDirectory({ name: "neue-referenzen", isDirectory: () => true })).toBe(false);
    expect(isReferenceGroupDirectory({ name: "notes.txt", isDirectory: () => false })).toBe(false);
  });

  it("covers every original with an explicit assignment and every target with a real cover", async () => {
    const sourceDirectory = path.join(process.cwd(), "design-input/reference-originals");
    // This local authoring source is intentionally unavailable in CI.
    if (existsSync(sourceDirectory)) {
      expect(() => assertReferenceSourceCoverage(assignments, [])).toThrow();
      assertReferenceSourceCoverage(assignments, await listReferenceSources(sourceDirectory));
    }
    expect(referenceGroups.map((group) => group.groupSlug)).toEqual(assignments.groups.map((group) => group.groupSlug));
    for (const group of referenceGroups) {
      expect(group.projects.length).toBeGreaterThan(0);
      expect(group.projects.filter((project) => project.image === group.overviewImage)).toHaveLength(1);
      for (const project of group.projects) {
        expect(project.actualLocation).toBeTruthy();
        expect(project.capacityKwp).toBeGreaterThan(0);
        expect(["Privat", "Gewerbe", null]).toContain(project.customerType);
        expect(existsSync(path.join(process.cwd(), "public", project.image))).toBe(true);
        const image = await sharp(path.join(process.cwd(), "public", project.image)).metadata();
        expect([project.width, project.height]).toEqual([image.width, image.height]);
      }
    }
    const manifest = readFileSync(path.join(process.cwd(), "src/generated/reference-projects.generated.ts"), "utf8");
    expect(manifest).not.toMatch(/hasBatteryStorage|dataStatus|placeholder/);
  });

  it("retains all 82 published IDs, paths, image bytes, capacities and customer types", () => {
    const projects = referenceGroups.flatMap((group) => [...group.projects]);
    const previous = assignments.entries.filter((entry) => entry.sourceKind === "existing");
    expect(previous).toHaveLength(82);
    for (const entry of previous) {
      const project = projects.find((candidate) => candidate.id === entry.existingProjectId)!;
      expect(project).toMatchObject({ id: entry.existingProjectId, image: entry.publicImage, capacityKwp: entry.capacityKwp, customerType: entry.customerType });
      expect(createHash("sha256").update(readFileSync(`public${project.image}`)).digest("hex")).toBe(entry.existingPublicSha256);
    }
  });

  it("imports 25 new captures and all 7 archive perspectives, accounting for the Schnaitsee crop exactly once", () => {
    const active = validateReferenceImport(assignments);
    expect(assignments.entries).toHaveLength(115);
    expect(assignments.entries.filter((entry) => entry.sourceKind === "new")).toHaveLength(26);
    expect(active.filter((entry) => entry.sourceKind === "new")).toHaveLength(25);
    expect(active.filter((entry) => entry.sourceKind === "archive")).toHaveLength(7);
    const projects = referenceGroups.flatMap((group) => [...group.projects]);
    expect(projects).toHaveLength(114);
    expect(new Set(projects.map((project) => project.id)).size).toBe(114);
    expect(new Set(projects.map((project) => project.image)).size).toBe(114);
    expect(assignments.entries.filter((entry) => entry.duplicateStatus === "same-capture")).toEqual([
      expect.objectContaining({ sourcePath: "neue-referenzen/Schnaitsee 10,56 kWp.jpeg", duplicateOf: "traunstein-privat-10-56-kwp-schnaitsee-01", projectId: null }),
    ]);
    expect(projects.filter((project) => project.actualLocation === "Schnaitsee")).toHaveLength(1);
  });

  it("applies approved places independently of source folders and project ID prefixes", () => {
    const projects = referenceGroups.flatMap((group) => [...group.projects]);
    expect(projects.find((project) => project.id === "berchtesgaden-privat-17-kwp-schoenau-01"))
      .toMatchObject({ group: "schoenau-am-koenigssee", actualLocation: "Schönau am Königssee" });
    expect(projects.find((project) => project.capacityKwp === 425.5))
      .toMatchObject({ group: "ainring", actualLocation: "Ainring", customerType: "Gewerbe" });
    expect(projects.find((project) => project.actualLocation === "Anger-Aufham"))
      .toMatchObject({ group: "piding", capacityKwp: 21.16, customerType: null });
    expect(projects.find((project) => project.actualLocation === "Teisendorf")?.group)
      .toBe("weitere-referenzen-berchtesgadener-land");
    expect(referenceGroups.find((group) => group.groupSlug === "traunstein")?.projects).toHaveLength(8);
    expect(referenceGroups.find((group) => group.groupSlug === "schoenau-am-koenigssee")?.projects).toHaveLength(4);
    expect(referenceGroups.find((group) => group.groupSlug === "tittmoning")?.projects).toHaveLength(1);
  });

  it("omits unknown customer types from captions and alt text while retaining published types", () => {
    const unknown = referenceGroups.flatMap((group) => [...group.projects]).filter((project) => project.customerType === null);
    expect(unknown).toHaveLength(28);
    for (const project of unknown) {
      expect(formatReferenceCaption(project)).not.toMatch(/Privat|Gewerbe|null|ungeklärt/);
      expect(project.alt).not.toMatch(/Privat|Gewerbe|null|ungeklärt/);
      expect(formatReferenceCaption(project)).toContain(project.actualLocation);
    }
    expect(formatReferenceCaption({ actualLocation: "Ainring", capacityKwp: 425.5, customerType: "Gewerbe" }))
      .toBe("Ainring · 425,5 kWp · Gewerbe");
  });

  it.each(["id", "image", "source", "customer"])("rejects unsafe manifest changes: %s", (kind) => {
    const copy = structuredClone(assignments);
    if (kind === "id") copy.entries[1].projectId = copy.entries[0].projectId;
    if (kind === "image") copy.entries[1].publicImage = copy.entries[0].publicImage;
    if (kind === "source") copy.entries[0].sourcePath = "../outside.jpg";
    if (kind === "customer") {
      const entry = copy.entries.find((candidate) => candidate.customerTypeStatus === "unknown")!;
      entry.customerType = "Privat";
    }
    expect(() => validateReferenceImport(copy)).toThrow();
  });

  it("does not hide unassigned future source images", () => {
    const sources = assignments.entries.map((entry) => entry.sourcePath);
    expect(() => assertReferenceSourceCoverage(assignments, [...sources, "new-place/unreviewed.jpg"]))
      .toThrow(/unassigned.*new-place/);
  });

  it("permanently redirects the old overview and group routes", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "/pv-referenzen", destination: "/referenzen", permanent: true }),
      expect.objectContaining({ source: "/pv-referenzen/:location", destination: "/referenzen/:location", permanent: true }),
    ]));
  });
});
