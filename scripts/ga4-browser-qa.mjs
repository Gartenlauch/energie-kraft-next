// Local production build + headless Chrome. Google tag and collection are intercepted:
// no measurement or other external request leaves the browser. No extra dependency.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import http from "node:http";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const config = require("yaml").parse(await readFile("apphosting.yaml", "utf8"));
const env = {
  ...process.env,
  NODE_ENV: "production",
  NEXT_TELEMETRY_DISABLED: "1",
  __NEXT_PROCESSED_ENV: "true",
};
for (const item of config.env ?? [])
  if (item.value !== undefined) env[item.variable] = String(item.value);
for (const key of [
  "FIRESTORE_EMULATOR_HOST",
  "FIREBASE_AUTH_EMULATOR_HOST",
  "FIREBASE_STORAGE_EMULATOR_HOST",
  "FIREBASE_CONFIG",
])
  delete env[key];
const next = require.resolve("next/dist/bin/next");
if (!process.argv.includes("--skip-build")) {
  const build = spawn(process.execPath, [next, "build"], {
    env,
    stdio: "inherit",
    windowsHide: true,
  });
  assert.equal((await once(build, "exit"))[0], 0, "Production build failed");
}
const port = 3049;
const server = spawn(
  process.execPath,
  [next, "start", "--hostname", "127.0.0.1", "--port", String(port)],
  { env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
);
let chrome;
let socket;
const results = [];
const requests = [];
const errors = [];
const id = "G-5XEMD60ZRV";
const allowedHosts = new Set([
  "www.energie-kraft.de",
  "review.energie-kraft.de",
  "preview.hosted.app",
  "preview.web.app",
  "preview.firebaseapp.com",
  "localhost",
]);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const local = (url, method = "GET", browserHeaders = {}) =>
  new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: url.pathname + url.search,
        method,
        headers: {
          ...browserHeaders,
          host: url.host,
          "accept-encoding": "identity",
          "x-forwarded-proto": url.protocol.slice(0, -1),
        },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () =>
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: Buffer.concat(chunks),
          }),
        );
      },
    );
    request.on("error", reject);
    request.end();
  });

// Test double processes the real app's Google command queue and emits intercepted beacons.
const tag = `(() => {
  const layer = window.dataLayer ||= [];
  let consent = 'denied';
  const consume = (entry) => {
    const [command, name, value] = Array.from(entry);
    if (command === 'consent') consent = value.analytics_storage;
    if (command === 'config') {
      window.__qaConfigCount = (window.__qaConfigCount || 0) + 1;
      document.cookie = '_ga=qa; Path=/; Secure; SameSite=Lax';
      document.cookie = '_ga_5XEMD60ZRV=qa; Domain=energie-kraft.de; Path=/; Secure; SameSite=Lax';
    }
    if (command === 'event' && consent === 'granted' && !window['ga-disable-${id}'])
      navigator.sendBeacon('https://www.google-analytics.com/g/collect', JSON.stringify({name, ...value}));
  };
  layer.forEach(consume);
  const push = layer.push.bind(layer);
  layer.push = (...entries) => { entries.forEach(consume); return push(...entries); };
})();`;

try {
  for (let attempt = 0; ; attempt++) {
    try {
      await local(new URL("https://www.energie-kraft.de/robots.txt"));
      break;
    } catch {
      if (attempt > 80) throw new Error("Local Next.js server unavailable");
      await delay(250);
    }
  }
  chrome = spawn(
    process.env.QA_CHROME ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${await mkdtemp(join(tmpdir(), "ek-ga4-qa-"))}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-sync",
      "--disable-extensions",
      "about:blank",
    ],
    { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] },
  );
  const endpoint = await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error("Chrome debugger unavailable")), 15000);
    chrome.stderr.on("data", (chunk) => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    chrome.on("error", reject);
  });
  socket = new WebSocket(endpoint);
  await once(socket, "open");
  let sequence = 0;
  const pending = new Map();
  function cdp(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const commandId = ++sequence;
      const timer = setTimeout(() => {
        pending.delete(commandId);
        reject(new Error(`CDP timeout: ${method}`));
      }, 30000);
      pending.set(commandId, { resolve, reject, timer });
      socket.send(
        JSON.stringify({ id: commandId, method, params, ...(sessionId ? { sessionId } : {}) }),
      );
    });
  }
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      if (!request) return;
      clearTimeout(request.timer);
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    } else if (message.method === "Fetch.requestPaused") {
      void intercept(message.params, message.sessionId).catch((error) =>
        errors.push(error.message),
      );
    }
  });
  async function intercept({ requestId, request }, sessionId) {
    const url = new URL(request.url);
    const fulfill = (
      body,
      responseCode = 200,
      responseHeaders = [{ name: "Content-Type", value: "application/javascript" }],
    ) =>
      cdp(
        "Fetch.fulfillRequest",
        { requestId, responseCode, responseHeaders, body: Buffer.from(body).toString("base64") },
        sessionId,
      );
    if (url.hostname === "www.googletagmanager.com") {
      requests.push({ kind: "script", url: request.url, sessionId });
      return fulfill(tag);
    }
    if (url.hostname.endsWith("google-analytics.com")) {
      requests.push({ kind: "event", body: request.postData ?? "", sessionId });
      return fulfill("", 204, []);
    }
    if (allowedHosts.has(url.hostname)) {
      const response = await local(url, request.method, request.headers);
      const headers = Object.entries(response.headers).filter(
        ([key]) => !["transfer-encoding", "connection", "content-length"].includes(key),
      );
      return fulfill(
        response.body,
        response.status,
        headers.flatMap(([name, value]) =>
          (Array.isArray(value) ? value : [value]).map((item) => ({ name, value: String(item) })),
        ),
      );
    }
    // Includes Places/auth/any unexpected third party; never forwarded externally.
    return cdp("Fetch.failRequest", { requestId, errorReason: "BlockedByClient" }, sessionId);
  }
  async function tab(url) {
    const { targetId } = await cdp("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp("Target.attachToTarget", { targetId, flatten: true });
    await cdp("Fetch.enable", { patterns: [{ urlPattern: "*" }] }, sessionId);
    await cdp("Page.enable", {}, sessionId);
    await cdp("Page.navigate", { url }, sessionId);
    await wait(sessionId, "!!document.querySelector('#cc-main .cm__btn')");
    return sessionId;
  }
  async function evaluate(sessionId, expression) {
    const response = await cdp(
      "Runtime.evaluate",
      { expression, returnByValue: true, awaitPromise: true },
      sessionId,
    );
    if (response.exceptionDetails)
      throw new Error(
        response.exceptionDetails.text + ": " + JSON.stringify(response.exceptionDetails.exception),
      );
    return response.result.value;
  }
  async function wait(sessionId, expression) {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(sessionId, expression)) return;
      await delay(100);
    }
    throw new Error(`Browser condition failed: ${expression}`);
  }
  const count = (sessionId, kind) =>
    requests.filter((r) => r.sessionId === sessionId && r.kind === kind).length;
  async function click(sessionId, text, scope = "#cc-main") {
    await evaluate(
      sessionId,
      `(() => { const button = [...document.querySelectorAll(${JSON.stringify(scope)} + ' button')].find(b => b.textContent.trim() === ${JSON.stringify(text)}); if (!button) throw Error('Missing button: ' + ${JSON.stringify(text)}); button.click(); })()`,
    );
    await delay(150);
  }
  async function preferences(sessionId, analytics) {
    await click(sessionId, "Cookie-Einstellungen", "footer");
    await wait(sessionId, "!!document.querySelector('#cc-main input[value=analytics]')");
    await evaluate(
      sessionId,
      `(() => { const input = document.querySelector('#cc-main input[value=analytics]'); if (input.checked !== ${analytics}) input.click(); })()`,
    );
    await click(sessionId, "Auswahl speichern");
  }
  const check = (name) => {
    results.push(name);
    console.log(`PASS ${name}`);
  };
  const main = await tab(
    "https://www.energie-kraft.de/kontakt?email=private%40example.invalid&phone=0123456789#test",
  );
  await delay(350);
  assert.equal(count(main, "script"), 0);
  check("First visit: no Google script or request");
  await click(main, "Nur notwendige");
  assert.equal(count(main, "script"), 0);
  check("Necessary-only: no GA4");
  await preferences(main, true);
  await wait(main, "window.__qaConfigCount === 1");
  await delay(250);
  assert.equal(count(main, "event"), 1);
  check("Statistics consent: one initial page_view");
  assert.ok(!JSON.stringify(requests).match(/private|0123456789/));
  check("No personal query/fragment in Google requests");
  await evaluate(main, "document.querySelector('footer a[href=\"/photovoltaik\"]').click()");
  await wait(main, "location.pathname === '/photovoltaik'");
  await delay(350);
  assert.equal(count(main, "event"), 2);
  assert.equal(count(main, "script"), 1);
  check("Next.js client navigation: exactly one further page_view");
  await preferences(main, false);
  assert.equal(await evaluate(main, "document.cookie.includes('_ga')"), false);
  await evaluate(
    main,
    "history.pushState(null, '', '/kontakt'); window.dispatchEvent(new PopStateEvent('popstate'))",
  );
  await delay(350);
  assert.equal(count(main, "event"), 2);
  check("Revocation: cookies removed, no further page_view");
  await preferences(main, true);
  await delay(350);
  assert.equal(count(main, "event"), 3);
  assert.equal(await evaluate(main, "window.__qaConfigCount"), 1);
  check("Reconsent: one page_view, no second initialization");
  await preferences(main, false);
  await evaluate(
    main,
    `(() => { const value = JSON.parse(localStorage.getItem('ek_consent')); value.revision = 1; value.categories = ['necessary','analytics']; localStorage.setItem('ek_consent', JSON.stringify(value)); })()`,
  );
  await cdp("Page.reload", {}, main);
  await wait(main, "!!document.querySelector('#cc-main .cm__btn')");
  await delay(350);
  assert.equal(count(main, "script"), 1);
  assert.equal(await evaluate(main, "localStorage.getItem('ek_consent')"), null);
  check("Old consent: rejected, fresh choice required");
  await click(main, "Nur notwendige");
  await click(main, "Cookie-Einstellungen", "footer");
  await evaluate(main, "document.querySelector('#cc-main input[value=googleReviews]').click()");
  await click(main, "Auswahl speichern");
  const reviewChoice = await evaluate(
    main,
    "JSON.parse(localStorage.getItem('ek_consent')).categories",
  );
  assert.ok(reviewChoice.includes("googleReviews") && !reviewChoice.includes("analytics"));
  assert.equal(count(main, "script"), 1);
  check("Google reviews consent independent of statistics");
  for (const host of [
    "review.energie-kraft.de",
    "preview.hosted.app",
    "preview.web.app",
    "preview.firebaseapp.com",
    "localhost",
  ]) {
    const session = await tab(`${host === "localhost" ? "http" : "https"}://${host}/kontakt`);
    await click(session, "Alle akzeptieren");
    await delay(350);
    assert.equal(count(session, "script"), 0);
    assert.equal(count(session, "event"), 0);
    check(`${host}: no GA4 after acceptance`);
  }
  assert.deepEqual(errors, []);
  const privacy = await local(new URL("https://www.energie-kraft.de/datenschutz"));
  assert.equal(privacy.status, 200);
  assert.ok(privacy.body.toString().includes("Google Analytics 4"));
  check("HTTP privacy page renders GA4 text");
  await mkdir("artifacts/ga4-qa", { recursive: true });
  await writeFile(
    "artifacts/ga4-qa/results.json",
    JSON.stringify(
      {
        date: "2026-10-21",
        mode: "Local production build, simulated production/review/Firebase origins, Google tag test double, all external traffic blocked",
        results,
        requests,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`${results.length} targeted browser/HTTP checks passed. No production measurements.`);
  await cdp("Browser.close");
} finally {
  socket?.close();
  chrome?.kill();
  server.kill();
}
