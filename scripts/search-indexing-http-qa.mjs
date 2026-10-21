// Real Next.js HTTP/HTML checks in an isolated local app. No deployment or production data.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { copyFile, cp, mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import http from "node:http";
import { once } from "node:events";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const require = createRequire(import.meta.url);
const { parse } = require("yaml");
const config = parse(await readFile("apphosting.yaml", "utf8"));
const approval = config.env.find(({ variable }) => variable === "SEARCH_INDEXING_ENABLED");
assert.equal(String(approval.value), "true");
assert.deepEqual(approval.availability, ["BUILD", "RUNTIME"]);
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: "1", __NEXT_PROCESSED_ENV: "true" };
for (const item of config.env ?? []) {
  if (item.value !== undefined) env[item.variable] = String(item.value);
}
// No production credentials or external data adapters participate in this check.
for (const key of [
  "NODE_ENV", "GOOGLE_APPLICATION_CREDENTIALS", "FIRESTORE_EMULATOR_HOST",
  "FIREBASE_AUTH_EMULATOR_HOST", "FIREBASE_STORAGE_EMULATOR_HOST",
  "GOOGLE_PLACES_API_KEY", "GOOGLE_PLACE_ID",
]) delete env[key];
env.GCLOUD_PROJECT = "demo-indexing-qa";
env.GOOGLE_CLOUD_PROJECT = "demo-indexing-qa";
env.FIREBASE_CONFIG = JSON.stringify({ projectId: "demo-indexing-qa" });

// Reuse every real route, layout, metadata helper and header/redirect rule.
// Only unrelated data adapters use fixtures; configurator settings use existing defaults.
const app = await mkdtemp(join(tmpdir(), "energie-kraft-indexing-http-"));
await cp(resolve("src"), join(app, "src"), { recursive: true });
for (const name of ["public", "node_modules", "functions"]) {
  await symlink(resolve(name), join(app, name), "junction");
}
for (const name of ["package.json", "tsconfig.json", "postcss.config.mjs", "next.config.ts"]) {
  await copyFile(resolve(name), join(app, name));
}
const faqFixture = join(app, "src/lib/faq/public-repository.ts");
const reviewFixture = join(app, "src/lib/reviews/index.ts");
await writeFile(faqFixture, `
export async function getPublicFaqEntriesByRoute() { return []; }
export async function getPublicFaqCatalog() { return { categories: [], entries: [] }; }
`);
await writeFile(reviewFixture, `
export async function getCustomerReviews() { return { reviews: [], summaries: [] }; }
`);
await writeFile(join(app, "src/lib/configurator/settings-repository.ts"), `
import { DEFAULT_CONFIGURATOR_SETTINGS } from "./settings-model";
export async function getCurrentConfiguratorSettings() { return DEFAULT_CONFIGURATOR_SETTINGS; }
`);
const next = require.resolve("next/dist/bin/next");
const results = [];
function request(port, path, host = "www.energie-kraft.de", extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get({
      hostname: "127.0.0.1", port, path,
      headers: { host, "user-agent": "Googlebot", ...extraHeaders },
    }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body }));
    });
    req.setTimeout(90000, () => req.destroy(new Error(`HTTP QA timeout: ${path}`)));
    req.on("error", reject);
  });
}
function checkHeader(response, enabled, label) {
  assert.equal(response.headers["x-robots-tag"], enabled ? undefined : "noindex, nofollow, noarchive, nosnippet", label);
}
function checkPage(response, enabled, path, excluded = false) {
  assert.equal(response.status, 200, path);
  checkHeader(response, enabled, path);
  const robots = [...response.body.matchAll(/<meta\s+name="(?:robots|googlebot)"\s+content="([^"]*)"/g)].map((match) => match[1]);
  assert.equal(robots.some((value) => value.includes("noindex")), excluded || !enabled, `${path}: HTML robots`);
  if (!excluded) assert.ok(response.body.includes(`rel="canonical" href="https://www.energie-kraft.de${path}"`), `${path}: canonical`);
  results.push({ enabled, path, status: response.status, header: response.headers["x-robots-tag"] ?? null, robots });
}
for (const [index, flag] of ["false", "true"].entries()) {
  const enabled = flag === "true";
  const port = 3038 + index;
  const server = spawn(process.execPath, [next, "dev", "--webpack", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: app, env: { ...env, SEARCH_INDEXING_ENABLED: flag },
    stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
  });
  let log = "";
  server.stdout.on("data", (chunk) => { log += chunk; });
  server.stderr.on("data", (chunk) => { log += chunk; });
  server.on("error", (error) => { log += error.stack; });
  const exited = once(server, "exit");
  try {
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await request(port, "/robots.txt");
        assert.equal(response.status, 200, response.body.slice(0, 300));
        break;
      } catch (error) {
        if (!["ECONNREFUSED", "ECONNRESET"].includes(error.code) || attempt === 60 || server.exitCode !== null) throw error;
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
    for (const path of ["/", "/photovoltaik", "/stromspeicher"]) {
      checkPage(await request(port, path), enabled, path);
    }
    // App Hosting's internal Host and absent/contradictory forwarded headers
    // must not change the single-switch policy, in either direction.
    checkPage(await request(port, "/photovoltaik", "internal.run.app", {
      "x-forwarded-host": "untrusted.example", "x-forwarded-proto": "http,https",
      forwarded: "host=review.energie-kraft.de;proto=http",
    }), enabled, "/photovoltaik");
    for (const path of ["/datenschutz", "/admin/login", "/google-bewertung", "/konfigurator/photovoltaik"]) {
      checkPage(await request(port, path), enabled, path, true);
    }
    const txt = await request(port, "/robots.txt");
    assert.equal(txt.status, 200);
    checkHeader(txt, enabled, "robots.txt");
    assert.match(txt.body, /Allow: \/\n/);
    assert.match(txt.body, /Disallow: \/admin\//);
    assert.equal(txt.body.includes("Sitemap: https://www.energie-kraft.de/sitemap.xml"), enabled);
    assert.equal(txt.body.includes("Host: https://www.energie-kraft.de"), enabled);
    results.push({ enabled, path: "/robots.txt", body: txt.body });
    const xml = await request(port, "/sitemap.xml");
    assert.equal(xml.status, 200);
    checkHeader(xml, enabled, "sitemap.xml");
    assert.match(xml.body, /<urlset\b/);
    assert.match(xml.body, /<loc>https:\/\/www\.energie-kraft\.de\/photovoltaik<\/loc>/);
    const urls = [...xml.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
    assert.ok(urls.length > 0);
    assert.ok(urls.every((url) => url.origin === "https://www.energie-kraft.de"));
    assert.ok(urls.every((url) => !/^\/(admin|datenschutz|google-bewertung)(\/|$)/.test(url.pathname) && !url.pathname.startsWith("/konfigurator/")));
    results.push({ enabled, path: "/sitemap.xml", status: xml.status, urls: urls.length });
    const admin = await request(port, "/admin");
    assert.equal(admin.status, 307);
    assert.equal(admin.headers.location, "/admin/login");
    checkHeader(admin, enabled, "/admin");
    results.push({ enabled, path: "/admin", status: admin.status });
    for (const [source, target] of [
      ["/service-und-team", "/service-und-wartung/service-und-team"],
      ["/unternehmen", "/ueber-uns"], ["/jobs-karriere", "/jobs"],
      ["/bewerbung-formular", "/bewerbung"], ["/kontakt-formular", "/kontakt#kontaktformular"],
      ["/finanzierung-und-foerderung", "/service-und-wartung/finanzierung-und-foerderung"],
      ["/wartung-und-reinigung", "/service-und-wartung"],
    ]) {
      const response = await request(port, source);
      assert.equal(response.status, 308, source);
      assert.equal(response.headers.location, target, source);
      results.push({ enabled, source, target, status: response.status });
    }
    console.log(`PASS: SEARCH_INDEXING_ENABLED=${flag}: HTTP headers, rendered pages, exclusions, robots, sitemap and redirects.`);
  } catch (error) {
    console.error(log.slice(-4000));
    throw error;
  } finally {
    server.kill();
    await exited;
    await writeFile(join(app, `server-${flag}.log`), log);
  }
}
await writeFile(join(app, "http-results.json"), JSON.stringify(results, null, 2));
console.log(`PASS: ${results.length} HTTP checks. Isolated app and evidence: ${app}`);
