// Local production-build gate. No deployment, cookies or business-data requests.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import http from "node:http";
import { once } from "node:events";

const require = createRequire(import.meta.url);
const { parse } = require("yaml");
const config = parse(await readFile("apphosting.yaml", "utf8"));
const env = {
  ...process.env,
  NODE_ENV: "production",
  NEXT_TELEMETRY_DISABLED: "1",
  __NEXT_PROCESSED_ENV: "true",
};
for (const item of config.env ?? []) {
  if (item.value !== undefined) env[item.variable] = String(item.value);
}
// Test the proposed release before changing the checked-in approval flag.
env.SEARCH_INDEXING_ENABLED = "true";
for (const key of [
  "FIRESTORE_EMULATOR_HOST",
  "FIREBASE_AUTH_EMULATOR_HOST",
  "FIREBASE_STORAGE_EMULATOR_HOST",
  "FIREBASE_CONFIG",
])
  delete env[key];
const output = "artifacts/search-indexing-qa";
await mkdir(output, { recursive: true });
const next = require.resolve("next/dist/bin/next");
const build = spawn(process.execPath, [next, "build"], {
  env,
  stdio: "inherit",
  windowsHide: true,
});
const [buildCode] = await once(build, "exit");
assert.equal(buildCode, 0, "Production build failed");

const port = 3038;
const server = spawn(
  process.execPath,
  [next, "start", "--hostname", "127.0.0.1", "--port", String(port)],
  {
    env,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  },
);
let serverLog = "";
server.stdout.on("data", (chunk) => {
  serverLog += chunk;
});
server.stderr.on("data", (chunk) => {
  serverLog += chunk;
});
const results = [];
function request(path, host, protocol = "https", extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: "127.0.0.1",
        port,
        path,
        headers: {
          host,
          ...(protocol === null ? {} : { "x-forwarded-proto": protocol }),
          "user-agent": "Googlebot",
          ...extraHeaders,
        },
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () =>
          resolve({ status: response.statusCode, headers: response.headers, body }),
        );
      },
    );
    req.setTimeout(15000, () => req.destroy(new Error("HTTP QA timeout")));
    req.on("error", reject);
  });
}
try {
  for (let attempt = 0; ; attempt++) {
    try {
      await request("/robots.txt", "localhost");
      break;
    } catch (error) {
      if (attempt === 60 || server.exitCode !== null) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  for (const [host, protocol, allowed] of [
    ["www.energie-kraft.de", "https", true],
    ["www.energie-kraft.de:443", "https", true],
    ["review.energie-kraft.de", "https", false],
    ["energie-kraft-next--energie-kraft-next.europe-west4.hosted.app", "https", false],
    ["energie-kraft-next.web.app", "https", false],
    ["energie-kraft-next.firebaseapp.com", "https", false],
    ["energie-kraft.de", "https", false],
    ["preview.example", "https", false],
    ["localhost:3038", "http", false],
    ["www.energie-kraft.de", "http", false],
    ["www.energie-kraft.de", null, false],
    ["www.energie-kraft.de", "https,http", false],
  ]) {
    const extra = {
      "x-forwarded-host": "www.energie-kraft.de",
      forwarded: "host=www.energie-kraft.de;proto=https",
    };
    const response = await request("/impressum", host, protocol, extra);
    assert.equal(response.status, 200);
    const robots = [
      ...response.body.matchAll(/<meta\s+name="(?:robots|googlebot)"\s+content="([^"]*)"/g),
    ].map((match) => match[1]);
    const header = response.headers["x-robots-tag"] ?? "";
    assert.equal(header.includes("noindex"), !allowed, `${host}/${protocol}: response header`);
    assert.equal(
      robots.some((value) => value.includes("noindex")),
      !allowed,
      `${host}/${protocol}: HTML robots`,
    );
    assert.match(
      response.body,
      /<link rel="canonical" href="https:\/\/www\.energie-kraft\.de\/impressum"/,
    );
    const txt = await request("/robots.txt", host, protocol, extra);
    assert.equal(txt.status, 200);
    assert.match(txt.body, /Allow: \/\n/);
    assert.match(txt.body, /Disallow: \/admin\//);
    assert.equal(txt.body.includes("Sitemap: https://www.energie-kraft.de/sitemap.xml"), allowed);
    assert.equal(txt.body.includes("Host: https://www.energie-kraft.de"), allowed);
    assert.equal((txt.headers["x-robots-tag"] ?? "").includes("noindex"), !allowed);
    results.push({
      host,
      protocol,
      allowed,
      status: response.status,
      header,
      robots,
      canonical: "https://www.energie-kraft.de/impressum",
      robotsTxt: txt.body,
    });
  }
  for (const path of ["/datenschutz", "/admin/login", "/google-bewertung"]) {
    const response = await request(path, "www.energie-kraft.de");
    assert.equal(response.status, 200, path);
    assert.match(response.body, /<meta name="robots" content="[^"]*noindex/, path);
    results.push({ path, status: response.status, noindex: true });
  }
  const admin = await request("/admin", "www.energie-kraft.de");
  assert.equal(admin.status, 307);
  assert.equal(admin.headers.location, "/admin/login");
  for (const [source, target] of [
    ["/service-und-team", "/service-und-wartung/service-und-team"],
    ["/unternehmen", "/ueber-uns"],
    ["/jobs-karriere", "/jobs"],
    ["/bewerbung-formular", "/bewerbung"],
    ["/kontakt-formular", "/kontakt#kontaktformular"],
    ["/finanzierung-und-foerderung", "/service-und-wartung/finanzierung-und-foerderung"],
    ["/wartung-und-reinigung", "/service-und-wartung"],
  ]) {
    const response = await request(source, "www.energie-kraft.de");
    assert.equal(response.status, 308, source);
    assert.equal(response.headers.location, target, source);
    results.push({ source, target, status: response.status });
  }
  await writeFile(`${output}/http-results.json`, JSON.stringify(results, null, 2));
  console.log(`PASS: ${results.length} HTTP/HTML/robots/redirect checks without consent cookies.`);
} finally {
  server.kill();
  await once(server, "exit");
  await writeFile(`${output}/server.log`, serverLog);
}
