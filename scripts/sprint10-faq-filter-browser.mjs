// Small local browser acceptance check; no external writes or form submissions.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const profile = await mkdtemp(join(tmpdir(), "ek-faq-routing-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9335",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ws;
try {
  let tabs;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      tabs = await (await fetch("http://127.0.0.1:9335/json")).json();
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
  const errors = [];
  ws.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request.reject(message.error);
      else request.resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown")
      errors.push(message.params.exceptionDetails.text);
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
  await send("Page.enable");
  await send("Runtime.enable");
  const base = "http://localhost:3020";
  const output = join(process.cwd(), "artifacts/sprint10-faq-filter-routing");
  await mkdir(output, { recursive: true });
  const counts = {
    photovoltaik: 45,
    stromspeicher: 40,
    waermepumpe: 40,
    klimaanlage: 40,
    wallbox: 9,
  };
  const report = [];
  async function until(expression, label) {
    for (let attempt = 0; attempt < 200; attempt++) {
      if (await js(expression)) return;
      await pause(100);
    }
    throw Error("Timeout: " + label);
  }
  async function navigate(path) {
    await send("Page.navigate", { url: base + path });
    await until(
      "document.readyState === 'complete' && !!document.querySelector('#faq-category')",
      path,
    );
    await pause(600);
  }
  async function check(category, count = category ? counts[category] : 174) {
    await until(
      `document.querySelector("#faq-category")?.value === ${JSON.stringify(category)} && document.querySelector("[role=status]")?.textContent.startsWith(${JSON.stringify(count + " Fragen gefunden")})`,
      "filter " + category,
    );
    const state = await js(
      `({ count: document.querySelectorAll(".faq-result").length, paths: [...document.querySelectorAll(".faq-result h3 a")].map(a => a.pathname), overflow: document.documentElement.scrollWidth > innerWidth, canonical: document.querySelector("link[rel=canonical]")?.href, labels: ["faq-search","faq-category"].every(id => !!document.querySelector("label[for="+id+"]")) })`,
    );
    assert.equal(state.count, Math.min(count, 12));
    assert(!state.overflow, "horizontal overflow");
    assert(state.labels, "associated labels");
    assert.equal(new URL(state.canonical).pathname, "/faq");
    assert.equal(new URL(state.canonical).search, "");
    if (category) assert(state.paths.every((path) => path.startsWith("/faq/" + category + "/")));
  }
  async function choose(value) {
    await js(
      `(() => { const select = document.querySelector("#faq-category"); select.focus(); select.value = ${JSON.stringify(value)}; select.dispatchEvent(new Event("change", {bubbles: true})); })()`,
    );
    await until(
      `new URLSearchParams(location.search).get("category") === ${JSON.stringify(value || null)}`,
      "select URL",
    );
    await pause(100);
  }
  async function search(value) {
    await js(
      `(() => { const input = document.querySelector("#faq-search"); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, ${JSON.stringify(value)}); input.dispatchEvent(new Event("input", {bubbles: true})); })()`,
    );
    await pause(150);
  }
  for (const width of [1440, 1024, 390, 375]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 500,
    });
    await navigate("/faq?utm_source=homepage");
    await check("");
    await js("window.__faqDocumentMarker = 123");
    await choose("photovoltaik");
    await check("photovoltaik");
    await choose("stromspeicher");
    await check("stromspeicher");
    await js("history.back()");
    await check("photovoltaik");
    await js("history.back()");
    await check("");
    await js("history.forward()");
    await check("photovoltaik");
    assert.equal(await js("new URLSearchParams(location.search).get('utm_source')"), "homepage");
    assert.equal(await js("window.__faqDocumentMarker"), 123, "no full reload");
    await js("document.querySelector('main button').click()");
    await until("document.querySelectorAll('.faq-result').length === 24", "show more");
    await choose("stromspeicher");
    await check("stromspeicher");
    await js("history.back()");
    await check("photovoltaik");
    await search("Speicher");
    const searched = await js(
      `({ total: parseInt(document.querySelector("[role=status]").textContent), paths: [...document.querySelectorAll(".faq-result h3 a")].map(a=>a.pathname) })`,
    );
    assert(searched.total > 0 && searched.total < counts.photovoltaik);
    assert(searched.paths.every((path) => path.startsWith("/faq/photovoltaik/")));
    await choose("stromspeicher");
    assert.equal(await js("document.querySelector('#faq-search').value"), "Speicher");
    await search("zzzznonexistent");
    await until(
      "document.querySelector('[role=status]').textContent === '0 Fragen gefunden'",
      "empty search",
    );
    await search("");
    await choose("");
    await check("");
    assert.equal(await js("location.search"), "?utm_source=homepage");
    for (const category of Object.keys(counts)) {
      await navigate("/faq?category=" + category);
      await check(category);
    }
    await navigate("/faq?category=invalid");
    await check("");
    await choose("photovoltaik");
    await check("photovoltaik");
    await js(
      `document.documentElement.style.scrollBehavior="auto"; document.querySelector(".faq-search-panel").scrollIntoView({block:"start",behavior:"instant"})`,
    );
    const before = await js("scrollY");
    await choose("stromspeicher");
    await check("stromspeicher");
    assert.equal(await js("document.activeElement.id"), "faq-category");
    assert(Math.abs((await js("scrollY")) - before) < 3, "no scroll jump");
    const shot = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(join(output, "faq-filter-" + width + ".png"), Buffer.from(shot.data, "base64"));
    for (const [path, text] of [
      ["/", "Fragen zur Solarstromnutzung"],
      ["/photovoltaik", "Alle Fragen zu Photovoltaik"],
    ]) {
      await send("Page.navigate", { url: base + path });
      const link = `[...document.querySelectorAll("main a")].find(a => a.textContent.trim() === ${JSON.stringify(text)})`;
      await until(`document.readyState === "complete" && !!(${link})`, path + " link");
      await pause(500);
      assert.equal(await js(`(${link}).getAttribute("href")`), "/faq?category=photovoltaik");
      await js(`(${link}).click()`);
      await check("photovoltaik");
    }
    await navigate("/faq/photovoltaik");
    await check("photovoltaik");
    assert.equal(await js("location.pathname + location.search"), "/faq?category=photovoltaik");
    report.push({
      width,
      result: "PASS",
      checks:
        "categories, counts, search, history, reset, pagination, UTM, focus, scroll, links, redirect, canonical, overflow",
    });
    console.log("PASS " + width + "px");
  }
  for (const category of ["photovoltaik", "stromspeicher"]) {
    const response = await fetch(base + "/faq/" + category, { redirect: "manual" });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), "/faq?category=" + category);
  }
  for (const path of [
    "/faq",
    "/faq?category=invalid",
    ...Object.keys(counts).map((c) => "/faq?category=" + c),
  ])
    assert.equal((await fetch(base + path)).status, 200, path);
  const detail = await js("document.querySelector('.faq-result h3 a').pathname");
  assert.equal((await fetch(base + detail, { redirect: "manual" })).status, 200);
  await send("Page.navigate", { url: base + detail });
  await until(
    "document.readyState === 'complete' && !!document.querySelector('#long-answer')",
    "detail",
  );
  const detailState = await js(
    `({ canonical: document.querySelector("link[rel=canonical]").href, back: document.querySelector("article > a").getAttribute("href") })`,
  );
  assert.equal(new URL(detailState.canonical).pathname, detail);
  assert.equal(detailState.back, "/faq?category=photovoltaik");
  assert.deepEqual(errors, []);
  await writeFile(
    join(output, "report.json"),
    JSON.stringify({ report, detail, redirects: "308", errors }, null, 2),
  );
  console.log("PASS HTTP, redirects, detail canonical and browser errors. Artifacts: " + output);
} finally {
  ws?.close();
  chrome.kill();
}
