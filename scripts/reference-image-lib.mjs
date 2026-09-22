import path from "node:path";

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
  const customerType = /(?:^|[-_ ,])gewerbe(?:[-_ ,]|$)/i.test(work) ? "Gewerbe" : "Privat";
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
