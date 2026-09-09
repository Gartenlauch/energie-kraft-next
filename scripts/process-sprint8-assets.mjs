import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

const sourceRoot = path.resolve("design-input/reference-originals");
const referenceOutput = path.resolve("public/images/references/projects");
const teamOutput = path.resolve("public/images/team");

const locationRules = [
  { slug: "ainring", directory: "Ainring", accepts: (name) => name.includes("Ainring") },
  {
    slug: "bad-reichenhall",
    directory: "Bad Reichenhall",
    accepts: (name) => name.includes("Reichenhall"),
  },
  {
    slug: "berchtesgaden",
    directory: "Berchtesgaden",
    accepts: (name) => name.includes("Berchtesgaden"),
  },
  {
    slug: "freilassing",
    directory: "Freilassing",
    accepts: (name) => name.includes("Freilassing"),
  },
  {
    slug: "kirchanschoering",
    directory: "Kirchanschoering",
    accepts: (name) => name.includes("Kirchanschoering"),
  },
  { slug: "laufen", directory: "Laufen", accepts: (name) => name.includes("Laufen") },
  {
    slug: "saaldorf-surheim",
    directory: "Ainring",
    accepts: (name) => name.includes("Saaldorf") || name.includes("Surheim"),
  },
  {
    slug: "saaldorf-surheim",
    directory: "Saaldorf-Surheim",
    accepts: (name) => name.includes("Saaldorf") || name.includes("Surheim"),
  },
];

fs.mkdirSync(referenceOutput, { recursive: true });
fs.mkdirSync(teamOutput, { recursive: true });

const conversions = [];

const outputCounts = new Map();

for (const { slug, directory, accepts } of locationRules) {
  const sourceDirectory = path.join(sourceRoot, directory);

  for (const fileName of fs.readdirSync(sourceDirectory).sort()) {
    if (!/\.jpe?g$/i.test(fileName) || !accepts(fileName)) {
      continue;
    }

    const customerType = fileName.includes("Gewerbe") ? "gewerbe" : "privat";
    const countKey = `${slug}-${customerType}`;
    const nextCount = (outputCounts.get(countKey) ?? 0) + 1;
    outputCounts.set(countKey, nextCount);
    const outputName = `${countKey}-${String(nextCount).padStart(2, "0")}.webp`;

    conversions.push(
      sharp(path.join(sourceDirectory, fileName))
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(referenceOutput, outputName)),
    );
  }
}

const teamSource = path.join(sourceRoot, "Ainring", "Service-Team_Header2025.jpg");

conversions.push(
  sharp(teamSource)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(path.join(teamOutput, "company-service-hero-desktop.webp")),
  sharp(teamSource)
    .rotate()
    .resize(1080, 1350, { fit: "cover", position: "left" })
    .webp({ quality: 84 })
    .toFile(path.join(teamOutput, "company-service-hero-mobile.webp")),
);

await Promise.all(conversions);
console.log(`Created ${conversions.length} optimized Sprint 8 assets.`);
