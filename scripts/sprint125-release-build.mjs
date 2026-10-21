// Reproduce App Hosting's public configuration without editing local env files.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
const { parse } = require("yaml");
const root = process.cwd();
loadEnvConfig(root, false);
const config = parse(await readFile(resolve("apphosting.yaml"), "utf8"));
const env = { ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" };
for (const item of config.env ?? []) {
  if (item.value !== undefined) env[item.variable] = String(item.value);
}
// loadEnvConfig's processed marker prevents Next from reintroducing local emulator variables.
assert.equal(env.__NEXT_PROCESSED_ENV, "true");
for (const key of [
  "FIRESTORE_EMULATOR_HOST",
  "FIREBASE_AUTH_EMULATOR_HOST",
  "FIREBASE_STORAGE_EMULATOR_HOST",
  "FIREBASE_CONFIG",
])
  delete env[key];
env.GOOGLE_CLOUD_PROJECT = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
env.GCLOUD_PROJECT = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
assert.equal(env.NEXT_PUBLIC_SITE_ENV, "production");
assert.equal(env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS, "false");
assert.equal(env.SEARCH_INDEXING_ENABLED, "false", "Indexing must remain disabled");
const policy = await readFile(resolve("src/lib/consent/policy.ts"), "utf8");
assert.match(policy, /TRACKING_ENABLED = false/);
assert.match(policy, /TRACKING_HOST_ALLOWLIST: readonly string\[\] = \[\]/);
const serve = process.argv.includes("--serve");
const output = resolve("artifacts/sprint12-5-release");
await mkdir(output, { recursive: true });
if (!serve)
  await writeFile(
    resolve(output, "build-environment.json"),
    JSON.stringify(
      {
        siteEnv: env.NEXT_PUBLIC_SITE_ENV,
        project: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        indexing: false,
        tracking: false,
        emulatorHosts: false,
      },
      null,
      2,
    ),
  );
const child = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), ...(serve ? ["start", "--port", "3027"] : ["build"])],
  { env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
);
const chunks = [];
child.stdout.on("data", (chunk) => {
  chunks.push(chunk);
  process.stdout.write(chunk);
});
child.stderr.on("data", (chunk) => {
  chunks.push(chunk);
  process.stderr.write(chunk);
});
process.on("SIGINT", () => child.kill());
const code = await new Promise((resolve, reject) => {
  child.once("error", reject);
  child.once("exit", (code) => resolve(code ?? 1));
});
await writeFile(
  resolve(output, serve ? "production-smoke-server.log" : "build.log"),
  Buffer.concat(chunks),
);
process.exitCode = code;
