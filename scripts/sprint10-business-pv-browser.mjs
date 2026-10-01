// Local, read-only acceptance checks. No form submissions or external writes.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = "http://localhost:3020";
const route = "/photovoltaik-fuer-unternehmen";
const output = "artifacts/sprint10-business-pv-qa";
await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), "ek-business-pv-"));
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
const report = { viewports: [], destinations: [], errors: [], failedRequests: [] };
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
  async function screenshot(name, full = false) {
    const params = { format: "png", captureBeyondViewport: full };
    if (full) {
      const { cssContentSize } = await send("Page.getLayoutMetrics");
      params.clip = {
        x: 0,
        y: 0,
        width: cssContentSize.width,
        height: cssContentSize.height,
        scale: 1,
      };
    }
    const shot = await send("Page.captureScreenshot", params);
    await writeFile(join(output, name), Buffer.from(shot.data, "base64"));
  }
  async function scrollTo(selector) {
    await js(
      `document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`,
    );
    await pause(1000);
  }
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `window.qaShifts=[];new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.qaShifts.push(e.value)}).observe({type:'layout-shift',buffered:true});`,
  });
  for (const width of [1920, 1440, 1280, 1024, 390, 375]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await navigate(route);
    await js("document.documentElement.style.scrollBehavior='auto'");
    // Trigger the existing reveal animation and lazy images throughout the page.
    await js(
      `(async()=>{await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=650){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}await Promise.all([...document.querySelectorAll('main img')].map(i=>i.decode().catch(()=>{})));scrollTo(0,0)})()`,
    );
    await pause(1200);
    const info = await js(
      `({width:innerWidth,h1:[...document.querySelectorAll('main h1')].map(e=>e.textContent),overflow:document.documentElement.scrollWidth>innerWidth,canonical:document.querySelector('link[rel=canonical]')?.href,title:document.title,signet:!!document.querySelector('.brand-intro__mark img'),brokenImages:[...document.querySelectorAll('main img')].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.currentSrc),faqQuestions:[...document.querySelectorAll('#faq summary')].map(e=>e.textContent),schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent)['@type']),cls:window.qaShifts.reduce((a,b)=>a+b,0),mainText:document.querySelector('main').innerText})`,
    );
    assert.equal(info.overflow, false, `Overflow at ${width}`);
    assert.deepEqual(info.h1, [
      "Photovoltaik für Unternehmen: eigenen Solarstrom wirtschaftlich nutzen",
    ]);
    assert.equal(info.title, "Photovoltaik für Unternehmen & Gewerbe | Energie-Kraft Süd");
    assert.equal(info.canonical, "https://www.energie-kraft.de" + route);
    assert(info.signet, "Missing signet");
    assert.equal(info.brokenImages.length, 0, `Broken images at ${width}`);
    assert(!/Österreich|deutschlandweit/i.test(info.mainText));
    assert(info.schemas.includes("WebPage") && info.schemas.includes("BreadcrumbList"));
    assert(
      !info.schemas.some((type) =>
        ["Product", "Offer", "AggregateRating", "QAPage"].includes(type),
      ),
    );
    delete info.mainText;
    report.viewports.push(info);
    if (width === 1440 || width === 390) {
      await screenshot(
        width === 1440 ? "01-business-pv-full-1440.png" : "06-business-pv-mobile-390-full.png",
        true,
      );
      if (width === 1440) {
        await screenshot("02-business-pv-hero-1440.png");
        for (const [selector, name] of [
          ["#planung", "03-business-pv-planning-1440.png"],
          ["#gewerbespeicher", "04-business-pv-storage-1440.png"],
          ["#service", "05-business-pv-service-1440.png"],
        ]) {
          await scrollTo(selector);
          await screenshot(name);
        }
      } else {
        await scrollTo("#service");
        await screenshot("07-business-pv-mobile-service-390.png");
      }
    }
    if (info.faqQuestions.length) {
      await scrollTo("#faq");
      await js("document.querySelector('#faq summary').click()");
      assert(await js("document.querySelector('#faq details').open"), "FAQ does not open");
    }
    if (width === 1440 || width === 390) {
      const cta =
        width === 1440
          ? ".premium-hero a[href='/kontakt#kontaktformular']"
          : "main > section:last-child a";
      await js(`document.querySelector(${JSON.stringify(cta)}).click()`);
      for (let attempt = 0; attempt < 100; attempt++) {
        await pause(250);
        if (
          await js(
            "location.pathname==='/kontakt' && location.hash==='#kontaktformular' && !!document.querySelector('#kontaktformular')",
          )
        )
          break;
      }
      await pause(1500);
      assert(
        await js(
          "location.pathname==='/kontakt' && location.hash==='#kontaktformular' && !!document.querySelector('#kontaktformular')",
        ),
        "Contact CTA target missing",
      );
      assert(
        await js(
          "(()=>{const r=document.querySelector('#kontaktformular').getBoundingClientRect();return r.top<innerHeight&&r.bottom>0})()",
        ),
        "Contact form not in viewport",
      );
    }
  }
  for (const destination of [
    "/referenzen",
    "/gewerbespeicher",
    "/service-und-wartung",
    "/service-und-wartung/service-und-team",
    "/wallbox",
    "/kontakt",
  ]) {
    const response = await fetch(base + destination);
    assert.equal(response.status, 200, destination);
    await navigate(destination);
    const title = await js("document.querySelector('main h1')?.textContent");
    assert(title && !title.includes("technischer Fehler"), destination);
    report.destinations.push({ destination, status: response.status, title });
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.failedRequests, []);
  await writeFile(join(output, "results.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  ws?.close();
  chrome.kill();
}
