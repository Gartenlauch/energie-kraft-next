// Local, read-only acceptance checks. No form submissions or external writes.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = "http://localhost:3020";
const profile = await mkdtemp(join(tmpdir(), "ek-business-pv-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9338",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ws;
const report = { viewports: [], destinations: [], errors: [], failedRequests: [] };
try {
  let tabs;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      tabs = await (await fetch("http://127.0.0.1:9338/json")).json();
      break;
    } catch {
      await pause(250);
    }
  }
  assert(tabs, "Chrome did not start");
  ws = new WebSocket(tabs.find((tab) => tab.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request.reject(message.error);
      else request.resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown")
      report.errors.push(message.params.exceptionDetails.text);
    if (message.method === "Network.responseReceived") {
      const response = message.params.response;
      if (response.url.startsWith(base) && response.status >= 400)
        report.failedRequests.push({ url: response.url, status: response.status });
    }
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async function js(expression) {
    const result = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text);
    return result.result.value;
  }
  async function navigate(path) {
    await send("Page.navigate", { url: base + path });
    for (let attempt = 0; attempt < 160; attempt++) {
      await pause(250);
      if (
        await js(
          `location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete' && !!document.querySelector('main')`,
        )
      )
        return;
    }
    throw Error(`Navigation timeout: ${path}`);
  }
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  const slugs = ["photovoltaik-fuer-unternehmen", "gewerbespeicher", "stromtarife-pv"];
  const mappings = [
    ["/energieloesungen", "/"],
    ...slugs.map((s) => ["/energieloesungen/" + s, "/" + s]),
  ];
  for (const [source, target] of mappings) {
    for (const suffix of ["", "?utm_source=test", "/"]) {
      let url = base + source + suffix;
      const chain = [];
      for (let i = 0; i < 4; i++) {
        const response = await fetch(url, { redirect: "manual" });
        chain.push(response.status);
        if (response.status === 200) break;
        assert.equal(response.status, 308, url);
        url = new URL(response.headers.get("location"), url).href;
      }
      assert.equal(new URL(url).pathname, target);
      assert.equal(new URL(url).search, suffix.startsWith("?") ? suffix : "");
      assert.equal(chain.at(-1), 200);
      assert.equal(chain.length, suffix === "/" ? 3 : 2);
      report.destinations.push({ source: source + suffix, target: url, chain });
    }
  }
  assert.equal(
    (await fetch(base + "/energieloesungen/unbekannte-seite", { redirect: "manual" })).status,
    404,
  );
  const paths = [
    "/",
    "/photovoltaik",
    "/stromspeicher",
    ...slugs.map((s) => "/" + s),
    "/waermepumpen",
    "/klimaanlagen",
    "/wallbox",
    "/service-und-wartung",
    "/referenzen",
    "/kontakt",
  ];
  const energy = [
    "/photovoltaik",
    "/stromspeicher",
    "/photovoltaik-fuer-unternehmen",
    "/gewerbespeicher",
    "/waermepumpen",
    "/klimaanlagen",
    "/wallbox",
    "/stromtarife-pv",
  ];
  for (const width of [1440, 390]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 500,
    });
    for (const path of paths) {
      assert.equal((await fetch(base + path, { redirect: "manual" })).status, 200);
      await navigate(path);
      await pause(450);
      const info = await js(
        `({h1:document.querySelector('main h1')?.textContent, canonical:document.querySelector('link[rel="canonical"]')?.href, overflow:document.documentElement.scrollWidth > innerWidth, links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')), json:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent))})`,
      );
      assert(info.h1, path);
      assert(!info.overflow, path + " overflow " + width);
      assert(!info.links.some((h) => h.startsWith("/energieloesungen")), path);
      if (slugs.some((s) => path === "/" + s)) {
        assert.equal(new URL(info.canonical).pathname, path);
        assert(!JSON.stringify(info.json).includes("/energieloesungen"));
        const web = info.json.find((x) => x["@type"] === "WebPage");
        const crumbs = info.json.find((x) => x["@type"] === "BreadcrumbList");
        assert.equal(new URL(web.url).pathname, path);
        assert.equal(crumbs.itemListElement.length, 2);
        assert.equal(new URL(crumbs.itemListElement[1].item).pathname, path);
      }
      if (path === "/") {
        for (const link of ["/photovoltaik-fuer-unternehmen", "/stromtarife-pv"])
          assert(await js(`!!document.querySelector('main a[href="${link}"]')`));
      }
      if (path === "/gewerbespeicher")
        assert(info.links.includes("/photovoltaik-fuer-unternehmen"));
      if (path === "/photovoltaik-fuer-unternehmen")
        assert(info.links.includes("/gewerbespeicher"));
      if (width < 500)
        await js(`document.querySelector('button[aria-label="Menü öffnen"]').click()`);
      await pause(100);
      const selector =
        width < 500
          ? 'button[aria-controls="mobile-energy-links"]'
          : 'button[aria-controls="energy-mega-menu"]';
      assert(await js(`!!document.querySelector('${selector}')`));
      assert.equal(
        await js(`document.querySelector('${selector}').dataset.activeGroup`),
        String(energy.includes(path)),
      );
      await js(
        `{ const trigger = document.querySelector('${selector}'); if (trigger.getAttribute('aria-expanded') !== 'true') trigger.click(); }`,
      );
      await pause(100);
      const menuSelector = width < 500 ? "#mobile-energy-links" : "#energy-mega-menu";
      const menuLinks = await js(
        `[...document.querySelectorAll('${menuSelector} a')].map(a=>a.getAttribute('href'))`,
      );
      for (const link of energy) assert(menuLinks.includes(link), path + " menu missing " + link);
      assert(
        await js(
          `!!document.querySelector('footer a[href="/photovoltaik-fuer-unternehmen"]') && !!document.querySelector('footer a[href="/stromtarife-pv"]')`,
        ),
      );
      assert(!(await js(`!!document.querySelector('header a[href="/energieloesungen"]')`)));
      report.viewports.push({
        width,
        path,
        h1: info.h1,
        canonical: info.canonical,
        overflow: info.overflow,
      });
    }
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.failedRequests, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  ws?.close();
  chrome.kill();
}
