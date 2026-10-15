import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { processReferenceImport } from "./reference-import-pipeline.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--check")) throw new Error("Usage: npm run images:references -- [--check]");
const manifest = JSON.parse(await readFile(path.join(root, "scripts/reference-import-manifest.json"), "utf8"));
const result = await processReferenceImport(root, manifest, { check: args.includes("--check") });
console.log(JSON.stringify(result, null, 2));
if (result.check && (result.createdImages.length || result.manifestChanged)) process.exitCode = 1;
