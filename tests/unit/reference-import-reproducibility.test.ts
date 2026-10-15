import { afterEach, describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, writeFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import assignments from "../../scripts/reference-import-manifest.json";
import { processReferenceImport, parseGeneratedReferences } from "../../scripts/reference-import-pipeline.mjs";

const temporaryRoots: string[] = [];
afterEach(async () => {
  for (const root of temporaryRoots.splice(0)) {
    if (path.dirname(root) !== path.resolve(tmpdir()) || !path.basename(root).startsWith("ek-reference-test-"))
      throw new Error("Refusing cleanup outside the test workspace");
    await rm(root, { recursive: true, force: true });
  }
});

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), "ek-reference-test-"));
  temporaryRoots.push(root);
  const directory = path.join(root, "design-input/reference-originals/inbox");
  await mkdir(directory, { recursive: true });
  const image = await sharp({ create: { width: 64, height: 48, channels: 3, background: "#005ca9" } })
    .jpeg().withMetadata({ orientation: 6 }).toBuffer();
  const sourceSha256 = createHash("sha256").update(image).digest("hex");
  await writeFile(path.join(directory, "first.jpg"), image);
  await writeFile(path.join(directory, "copy.jpg"), image);
  const entry = {
    ...assignments.entries[0], sourcePath: "inbox/first.jpg", sourceSha256, sourceKind: "new",
    actualLocation: "Sample", targetGroup: "sample", customerType: null, customerTypeStatus: "unknown",
    projectId: "sample-01", existingProjectId: null, existingPublicSha256: null,
    publicImage: "/images/references/sample/sample-01.webp",
  };
  const manifest = {
    ...assignments, groups: [{ groupSlug: "sample", groupName: "Sample", coverProjectId: "sample-01" }],
    entries: [entry, { ...entry, sourcePath: "inbox/copy.jpg", projectId: null, publicImage: null,
      duplicateStatus: "same-capture", duplicateOf: "sample-01", reviewNote: "Reviewed exact copy" }],
  };
  return { root, directory, manifest, output: path.join(root, "public/images/references/sample/sample-01.webp"),
    generated: path.join(root, "src/generated/reference-projects.generated.ts") };
}

describe("reference importer filesystem regression", () => {
  it("supports read-only preview and produces byte-identical repeat imports without upscaling", async () => {
    const f = await fixture();
    expect(await processReferenceImport(f.root, f.manifest, { check: true })).toMatchObject({ publishedImages: 1, manifestChanged: true });
    await expect(stat(f.output)).rejects.toThrow();
    const first = await processReferenceImport(f.root, f.manifest);
    expect(first.createdImages).toHaveLength(1);
    const generated = await readFile(f.generated, "utf8"), bytes = await readFile(f.output);
    const mtime = (await stat(f.output)).mtimeMs;
    expect(parseGeneratedReferences(generated)[0].projects[0]).toMatchObject({ width: 48, height: 64, customerType: null });
    const second = await processReferenceImport(f.root, f.manifest);
    expect(second).toMatchObject({ createdImages: [], manifestChanged: false });
    expect(await readFile(f.generated, "utf8")).toBe(generated);
    expect(await readFile(f.output)).toEqual(bytes);
    expect((await stat(f.output)).mtimeMs).toBe(mtime);
  });

  it("refuses unknown originals and changed sources before generating files", async () => {
    const f = await fixture();
    await writeFile(path.join(f.directory, "unreviewed.jpg"), "not imported");
    await expect(processReferenceImport(f.root, f.manifest)).rejects.toThrow(/unassigned/);
    await expect(stat(f.generated)).rejects.toThrow();
    await rm(path.join(f.directory, "unreviewed.jpg"));
    await writeFile(path.join(f.directory, "first.jpg"), "changed original");
    await expect(processReferenceImport(f.root, f.manifest)).rejects.toThrow(/Source changed/);
    await expect(stat(f.generated)).rejects.toThrow();
  });

  it("refuses output collisions and preserves the current generated manifest on failure", async () => {
    const f = await fixture();
    await processReferenceImport(f.root, f.manifest);
    const generated = await readFile(f.generated, "utf8");
    await writeFile(f.output, "unrelated existing asset");
    await expect(processReferenceImport(f.root, f.manifest)).rejects.toThrow(/refusing to overwrite/);
    expect(await readFile(f.output, "utf8")).toBe("unrelated existing asset");
    expect(await readFile(f.generated, "utf8")).toBe(generated);
  });

  it("refuses removal of a published ID or group URL", async () => {
    const f = await fixture();
    await processReferenceImport(f.root, f.manifest);
    const removedId = structuredClone(f.manifest);
    removedId.groups[0].coverProjectId = "replacement-01";
    removedId.entries[0].projectId = "replacement-01";
    removedId.entries[1].duplicateOf = "replacement-01";
    await expect(processReferenceImport(f.root, removedId)).rejects.toThrow(/published ID/);
    const removedGroup = structuredClone(f.manifest);
    removedGroup.groups[0].groupSlug = "other";
    for (const entry of removedGroup.entries) entry.targetGroup = "other";
    await expect(processReferenceImport(f.root, removedGroup)).rejects.toThrow(/published group URL/);
  });
});
