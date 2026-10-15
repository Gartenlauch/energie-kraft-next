import { createHash } from "node:crypto";
import { readFile, readdir, mkdir, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { assertReferenceSourceCoverage, validateReferenceImport } from "./reference-image-lib.mjs";

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const rasterPattern = /\.(jpe?g|png|webp|tiff?)$/i;
const capacityFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 3 });

export async function listReferenceSources(sourceRoot, prefix = "") {
  const result = [];
  for (const entry of await readdir(path.join(sourceRoot, prefix), { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Reference source symlinks are not supported: ${relative}`);
    if (entry.isDirectory()) result.push(...await listReferenceSources(sourceRoot, relative));
    else if (entry.isFile() && rasterPattern.test(entry.name)) result.push(relative);
  }
  return result.sort();
}

function inside(root, relative) {
  const resolved = path.resolve(root, relative);
  const difference = path.relative(root, resolved);
  if (!difference || difference.startsWith("..") || path.isAbsolute(difference))
    throw new Error(`Reference path leaves its designated root: ${relative}`);
  return resolved;
}

async function readOptional(file) {
  try { return await readFile(file); }
  catch (error) { if (error.code === "ENOENT") return null; throw error; }
}

export function parseGeneratedReferences(text) {
  const match = text.match(/export const referenceGroups\s*=\s*([\s\S]*?)\s+as const;\s*$/);
  if (!match) throw new Error("Cannot read the existing generated reference manifest safely");
  return JSON.parse(match[1]);
}

/** All inputs and output collisions are checked before any writes. Existing assets are never overwritten. */
export async function processReferenceImport(root, manifest, { check = false } = {}) {
  const entries = validateReferenceImport(manifest);
  const sourceRoot = path.join(root, "design-input/reference-originals");
  const publicRoot = path.join(root, "public");
  const generatedPath = path.join(root, "src/generated/reference-projects.generated.ts");
  assertReferenceSourceCoverage(manifest, await listReferenceSources(sourceRoot));

  const previousBytes = await readOptional(generatedPath);
  const previous = previousBytes ? parseGeneratedReferences(previousBytes.toString("utf8")) : [];
  const previousProjects = new Map(previous.flatMap((group) => group.projects).map((project) => [project.id, project]));
  const configured = new Map(entries.map((entry) => [entry.projectId, entry]));
  for (const project of previousProjects.values()) {
    if (configured.get(project.id)?.publicImage !== project.image)
      throw new Error(`Import would remove or change a published ID/image: ${project.id}`);
  }
  for (const group of previous) {
    if (!manifest.groups.some((next) => next.groupSlug === group.groupSlug))
      throw new Error(`Import would remove a published group URL: ${group.groupSlug}`);
  }

  const sourceBuffers = new Map(), sourceHashes = new Map();
  for (const entry of manifest.entries) {
    const bytes = await readFile(inside(sourceRoot, entry.sourcePath));
    const hash = sha256(bytes);
    if (hash !== entry.sourceSha256) throw new Error(`Source changed; review the assignment first: ${entry.sourcePath}`);
    const retained = entry.duplicateStatus === "same-capture" ? entry.duplicateOf : entry.projectId;
    if (sourceHashes.has(hash) && sourceHashes.get(hash) !== retained)
      throw new Error(`Unreviewed exact duplicate: ${entry.sourcePath}`);
    sourceHashes.set(hash, retained);
    sourceBuffers.set(entry.sourcePath, bytes);
  }

  const projects = new Map(), pendingImages = [], preservedImages = [];
  for (const entry of entries) {
    const target = inside(publicRoot, entry.publicImage.slice(1));
    const existing = await readOptional(target);
    let dimensions;
    if (entry.sourceKind === "existing") {
      if (!existing || sha256(existing) !== entry.existingPublicSha256)
        throw new Error(`Published image missing or changed; refusing to replace it: ${entry.publicImage}`);
      dimensions = await sharp(existing).metadata();
      preservedImages.push(entry.publicImage);
    } else {
      const encoded = await sharp(sourceBuffers.get(entry.sourcePath)).rotate()
        .resize({ width: manifest.processing.maxDimension, height: manifest.processing.maxDimension,
          fit: "inside", withoutEnlargement: true })
        .webp({ quality: manifest.processing.webpQuality }).toBuffer({ resolveWithObject: true });
      dimensions = encoded.info;
      if (existing && !existing.equals(encoded.data))
        throw new Error(`Image path collision; refusing to overwrite: ${entry.publicImage}`);
      if (!existing) pendingImages.push({ target, image: entry.publicImage, bytes: encoded.data });
    }
    if (!dimensions.width || !dimensions.height) throw new Error(`Invalid image dimensions: ${entry.publicImage}`);
    const old = previousProjects.get(entry.projectId);
    const suffix = entry.customerType === "Gewerbe" ? ", Gewerbeanlage" : entry.customerType === "Privat" ? ", Privatanlage" : "";
    const alt = old && old.actualLocation === entry.actualLocation && old.customerType === entry.customerType
      ? old.alt : `Photovoltaikanlage in ${entry.actualLocation} mit ${capacityFormat.format(entry.capacityKwp)} kWp${suffix}`;
    projects.set(entry.projectId, {
      id: entry.projectId, group: entry.targetGroup, actualLocation: entry.actualLocation,
      customerType: entry.customerType, capacityKwp: entry.capacityKwp, image: entry.publicImage,
      width: dimensions.width, height: dimensions.height, alt,
    });
  }
  const groups = manifest.groups.map((group) => ({
    groupName: group.groupName, groupSlug: group.groupSlug,
    overviewImage: projects.get(group.coverProjectId).image,
    projects: entries.filter((entry) => entry.targetGroup === group.groupSlug).map((entry) => projects.get(entry.projectId)),
  }));
  const generated = `// Generated by npm run images:references. Do not edit by hand.\nexport const referenceGroups = ${JSON.stringify(groups, null, 2)} as const;\n`;
  const manifestChanged = previousBytes?.toString("utf8") !== generated;
  if (!check) {
    for (const image of pendingImages) {
      await mkdir(path.dirname(image.target), { recursive: true });
      await writeFile(image.target, image.bytes, { flag: "wx" });
    }
    if (manifestChanged) {
      await mkdir(path.dirname(generatedPath), { recursive: true });
      const temporary = `${generatedPath}.${process.pid}.tmp`;
      await writeFile(temporary, generated, { flag: "wx" });
      await rename(temporary, generatedPath);
    }
  }
  return {
    check, sourceImages: manifest.entries.length, publishedImages: entries.length, groups: groups.length,
    duplicates: manifest.entries.filter((entry) => entry.duplicateStatus === "same-capture").map((entry) => ({ source: entry.sourcePath, retainedProjectId: entry.duplicateOf })),
    preservedImages, createdImages: pendingImages.map((image) => image.image), manifestChanged,
  };
}
