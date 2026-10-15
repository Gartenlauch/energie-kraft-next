import path from "node:path";

// Reserved mixed-location import inbox, not a publishable location group.
// Assign its images to reviewed location folders before running the importer.
// All other directories remain subject to import and coverage checks.
export function isReferenceGroupDirectory(entry) {
  return entry.isDirectory() && entry.name !== "neue-referenzen";
}

const localityNames = new Map([
  ["kirchanschoering", "Kirchanschöring"],
  ["schoenau", "Schönau"],
  ["schoenau-am-koenigsee", "Schönau am Königssee"],
  ["reitimwinkl", "Reit im Winkl"],
]);

export function slugify(value) {
  return value.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe")
    .replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function parseReferenceFilename(filename, groupName) {
  const stem = path.parse(filename).name.trim();
  if (/^gerwerbe\b/i.test(stem)) return { error: "project type typo is ambiguous" };
  let work = stem.replace(/^Referenz[-_ ,]+/i, "").replace(/^von Berg[-_ ,]+/i, "");
  const customerType = /(?:^|[-_ ,])gewerbe(?:[-_ ,]|$)/i.test(work) ? "Gewerbe" :
    /(?:^|[-_ ,])privat(?:[-_ ,]|$)/i.test(work) ? "Privat" : null;
  work = work.replace(/(?:^|[-_ ,])(?:gewerbe|privat)(?=[-_ ,]|$)/gi, " ").trim();
  const matches = [...work.matchAll(/(?<![\d!])([1-9]\d{0,3}(?:[,.]\d{1,3})?)\s*[-_]?\s*kwp\b/gi)];
  const legacy = work.match(/\b([1-9]\d{0,2})-(\d{1,3})-kwp\b/i);
  if (matches.length !== 1 || legacy) return { error: "capacity in kWp cannot be parsed reliably" };
  const capacityKwp = Number(matches[0][1].replace(",", "."));
  if (!Number.isFinite(capacityKwp)) return { error: "invalid capacity" };
  const localityRaw = `${work.slice(0, matches[0].index)} ${work.slice(matches[0].index + matches[0][0].length)}`
    .replace(/[-_,]+/g, " ").replace(/\s+/g, " ").trim();
  if (!localityRaw || /\d|[!@#]/.test(localityRaw)) return { error: "locality cannot be parsed reliably" };
  const localitySlug = slugify(localityRaw);
  if (localitySlug === "anring" || localitySlug === "reit-im-winkel")
    return { error: "locality spelling is ambiguous" };
  const actualLocation = localityNames.get(localitySlug) ??
    (localitySlug === slugify(groupName) ? (localityNames.get(localitySlug) ?? groupName) : localityRaw);
  return { customerType, capacityKwp, actualLocation };
}

export function uniqueOutputStem(base, used) {
  const next = (used.get(base) ?? 0) + 1;
  used.set(base, next);
  return `${base}-${String(next).padStart(2, "0")}`;
}

/** Validate reviewed assignments before reading or writing any image assets. */
export function validateReferenceImport(manifest) {
  const fail = (message) => { throw new Error(`Reference import: ${message}`); };
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const shaPattern = /^[a-f0-9]{64}$/;
  if (manifest.version !== 1 || !Array.isArray(manifest.groups) || !manifest.groups.length ||
    !Array.isArray(manifest.entries) || !manifest.entries.length) fail("invalid manifest structure");
  if (!Number.isInteger(manifest.processing?.maxDimension) || manifest.processing.maxDimension < 1 ||
    !Number.isInteger(manifest.processing?.webpQuality) || manifest.processing.webpQuality < 1 ||
    manifest.processing.webpQuality > 100) fail("invalid processing settings");
  const groups = new Map();
  for (const group of manifest.groups) {
    if (!slugPattern.test(group.groupSlug) || group.groupSlug === "neue-referenzen" ||
      !group.groupName?.trim() || groups.has(group.groupSlug)) fail("invalid or duplicate group");
    groups.set(group.groupSlug, group);
  }
  const sources = new Set(), ids = new Map(), images = new Set();
  for (const entry of manifest.entries) {
    if (typeof entry.sourcePath !== "string" || entry.sourcePath.split("/").some((part) =>
      !part || part === "." || part === ".." || /[:\\]/.test(part)) ||
      !/\.(jpe?g|png|webp|tiff?)$/i.test(entry.sourcePath)) fail("unsafe source path");
    const sourceKey = entry.sourcePath.toLowerCase();
    if (sources.has(sourceKey)) fail(`duplicate source: ${entry.sourcePath}`);
    sources.add(sourceKey);
    if (!shaPattern.test(entry.sourceSha256) || !groups.has(entry.targetGroup) ||
      !entry.actualLocation?.trim() || !Number.isFinite(entry.capacityKwp) || entry.capacityKwp <= 0 ||
      !["existing", "new", "archive"].includes(entry.sourceKind) ||
      entry.assignmentStatus !== "user-approved-phase-b" || entry.consentStatus !== "user-confirmed" ||
      !["filename-unverified", "verified"].includes(entry.capacityStatus)) fail(`invalid metadata: ${entry.sourcePath}`);
    if (![null, "Privat", "Gewerbe"].includes(entry.customerType) ||
      !["published-unverified", "filename-unverified", "verified", "unknown"].includes(entry.customerTypeStatus) ||
      (entry.customerType === null) !== (entry.customerTypeStatus === "unknown")) fail(`unproven customer type: ${entry.sourcePath}`);
    if (entry.duplicateStatus === "same-capture") {
      if (entry.projectId !== null || entry.publicImage !== null || entry.existingProjectId !== null ||
        !entry.duplicateOf || !entry.reviewNote?.trim()) fail("duplicate needs an explicit retained capture and review");
      continue;
    }
    if (entry.duplicateStatus !== "distinct" || entry.duplicateOf !== null ||
      !slugPattern.test(entry.projectId) || ids.has(entry.projectId)) fail(`invalid or duplicate project ID: ${entry.projectId}`);
    if (!/^\/images\/references\/(?:[a-z0-9-]+\/)+[a-z0-9-]+\.webp$/.test(entry.publicImage) ||
      images.has(entry.publicImage.toLowerCase())) fail(`unsafe or duplicate image path: ${entry.publicImage}`);
    if (entry.sourceKind === "existing") {
      if (entry.existingProjectId !== entry.projectId || !shaPattern.test(entry.existingPublicSha256))
        fail(`missing preservation lock: ${entry.projectId}`);
    } else if (entry.existingProjectId !== null || entry.existingPublicSha256 !== null) fail("invalid preservation lock");
    ids.set(entry.projectId, entry);
    images.add(entry.publicImage.toLowerCase());
  }
  for (const entry of manifest.entries.filter((item) => item.duplicateStatus === "same-capture")) {
    const retained = ids.get(entry.duplicateOf);
    if (!retained || retained.targetGroup !== entry.targetGroup || retained.capacityKwp !== entry.capacityKwp)
      fail(`invalid duplicate target: ${entry.sourcePath}`);
  }
  for (const group of groups.values()) {
    if (ids.get(group.coverProjectId)?.targetGroup !== group.groupSlug) fail(`invalid group cover: ${group.groupSlug}`);
  }
  return [...ids.values()];
}

export function assertReferenceSourceCoverage(manifest, sourcePaths) {
  const assigned = new Set(manifest.entries.map((entry) => entry.sourcePath));
  const found = new Set(sourcePaths);
  const unassigned = sourcePaths.filter((sourcePath) => !assigned.has(sourcePath));
  const missing = [...assigned].filter((sourcePath) => !found.has(sourcePath));
  if (unassigned.length || missing.length) throw new Error(
    `Reference source coverage: unassigned=${JSON.stringify(unassigned)}, missing=${JSON.stringify(missing)}`,
  );
}
