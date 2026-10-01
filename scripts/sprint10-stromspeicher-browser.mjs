// Local, read-only acceptance checks. No form submissions or external writes.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = "http://localhost:3021";
const route = "/stromspeicher";

const output = "artifacts/sprint10-stromspeicher-qa";
await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), "ek-storage-"));
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
const report = {
  viewports: [],
  redirects: [],
  regressions: [],
  linkTargets: [],
  reducedMotion: null,
  errors: [],
  failedRequests: [],
};
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
      ) {
        await pause(600);
        return;
      }
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
    source: `window.qaOverflow=false;const check=()=>{if(document.documentElement.scrollWidth>innerWidth)window.qaOverflow=true;requestAnimationFrame(check)};requestAnimationFrame(check);`,
  });
  async function primePage() {
    await js(
      `(async()=>{await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=650){scrollTo(0,y);await new Promise(r=>setTimeout(r,110))}await Promise.all([...document.querySelectorAll('main img')].map(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,1500))])));scrollTo(0,0)})()`,
    );
    await pause(1000);
    await js(
      `(async()=>{for(const e of document.querySelectorAll('main [data-reveal-state=pending]')){e.scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,250))}scrollTo(0,0)})()`,
    );
    await pause(1000);
    assert.equal(
      await js("document.querySelectorAll('main [data-reveal-state=pending]').length"),
      0,
      "Unrevealed content before screenshot",
    );
  }
  async function sectionShot(selector, name) {
    await js(
      `(async()=>{const e=document.querySelector(${JSON.stringify(selector)});const top=scrollY+e.getBoundingClientRect().top;for(let y=top;y<top+e.offsetHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,220))}})()`,
    );
    await scrollTo(selector);
    const box = await js(
      `(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:0,y:scrollY+r.top,width:innerWidth,height:r.height}})()`,
    );
    const shot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: { ...box, scale: 1 },
    });
    await writeFile(join(output, name), Buffer.from(shot.data, "base64"));
  }
  for (const width of [1920, 1440, 1280, 1024, 390, 375]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await navigate(route);
    await primePage();
    const info = await js(`(()=>{
      const mark=document.querySelector('.brand-intro__mark');const r=mark.getBoundingClientRect();
      const collision=[...document.querySelectorAll('main h1,main h2,main p,main a')].filter(e=>{const b=e.getBoundingClientRect();return b.width&&b.height&&b.left<r.right&&b.right>r.left&&b.top<r.bottom&&b.bottom>r.top}).map(e=>e.textContent);
      return {width:innerWidth,h1:[...document.querySelectorAll('main h1')].map(e=>e.textContent),title:document.title,canonical:document.querySelector('link[rel=canonical]')?.href,overflow:document.documentElement.scrollWidth>innerWidth,animationOverflow:window.qaOverflow,signets:document.querySelectorAll('.brand-intro--brand').length,collision,heroLinks:[...document.querySelectorAll('.premium-hero a')].map(e=>({label:e.textContent,href:e.getAttribute('href'),height:e.getBoundingClientRect().height})),links:[...document.querySelectorAll('main a')].map(e=>e.getAttribute('href')),products:[...document.querySelectorAll('#speicherprodukte article')].map(e=>({id:e.id,img:e.querySelector('img').currentSrc,fit:getComputedStyle(e.querySelector('img')).objectFit})),brokenImages:[...document.querySelectorAll('main img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc),faq:[...document.querySelectorAll('#faq summary')].map(e=>e.textContent.trim()),schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent)['@type'])};})()`);
    assert.deepEqual(info.h1, ["Solarstrom speichern und dann nutzen, wenn Sie ihn brauchen"]);
    assert.equal(info.title, "Stromspeicher für Photovoltaik | Energie-Kraft Süd");
    assert.equal(info.canonical, "https://www.energie-kraft.de/stromspeicher");
    assert.equal(info.overflow, false);
    assert.equal(info.animationOverflow, false);
    assert.equal(info.signets, 1);
    assert.deepEqual(info.collision, []);
    assert.deepEqual(
      info.heroLinks.map((l) => l.href),
      ["/konfigurator/stromspeicher", "/kontakt#kontaktformular"],
    );
    assert(info.heroLinks.every((l) => l.height >= 44));
    for (const href of [
      "/photovoltaik",
      "/wallbox",
      "/waermepumpen",
      "/kontakt#kontaktformular",
      "/konfigurator/stromspeicher",
    ])
      assert(info.links.includes(href));
    assert(!info.links.includes("/stromtarife-pv"));
    assert.deepEqual(
      info.products.map((p) => p.id),
      ["sigenstor-neo", "sigenstor"],
    );
    assert(info.products.every((p) => p.fit === "contain"));
    assert.deepEqual(info.brokenImages, []);
    assert(info.schemas.includes("WebPage") && info.schemas.includes("BreadcrumbList"));
    assert(
      !info.schemas.some((t) => ["Product", "Offer", "AggregateRating", "QAPage"].includes(t)),
    );
    const menuSelector =
      width >= 1280
        ? 'header button[aria-controls="energy-mega-menu"]'
        : 'header button[aria-controls="mobile-navigation"]';
    await js(`document.querySelector(${JSON.stringify(menuSelector)}).click()`);
    await pause(350);
    assert(
      await js(
        `!!document.querySelector('footer a[href="/stromtarife-pv"]') && !!document.querySelector('header a[href="/stromtarife-pv"]') && !document.querySelector('main a[href="/stromtarife-pv"]')`,
      ),
    );
    await js(`document.querySelector(${JSON.stringify(menuSelector)}).click()`);
    await pause(350);
    info.tariffInGlobalNavigation = true;
    report.viewports.push(info);
    if (width === 1440) {
      await screenshot("01-stromspeicher-full-1440.png", true);
      await screenshot("02-stromspeicher-hero-1440.png");
      await sectionShot("#speicherprodukte", "03-stromspeicher-products-1440.png");
      await sectionShot("#sigenstor-neo", "04-stromspeicher-sigenstor-neo-1440.png");
      await sectionShot("#sigenstor", "05-stromspeicher-sigenstor-1440.png");
      await sectionShot("#energiemanagement", "06-stromspeicher-mysigen-1440.png");
      await sectionShot("#ersatzstrom", "07-stromspeicher-backup-1440.png");
    }
    if (width === 390) {
      await screenshot("08-stromspeicher-mobile-390-full.png", true);
      await sectionShot("#speicherprodukte", "09-stromspeicher-products-mobile-390.png");
      await sectionShot("#energiemanagement", "10-stromspeicher-mysigen-mobile-390.png");
    }
    if (info.faq.length) {
      await scrollTo("#faq");
      await js("document.querySelector('#faq summary').focus()");
      await send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Enter",
        code: "Enter",
        text: "\r",
        windowsVirtualKeyCode: 13,
      });
      await send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Enter",
        code: "Enter",
        windowsVirtualKeyCode: 13,
      });
      assert(await js("document.querySelector('#faq details').open"));
    }
    if (width === 1440 || width === 390) {
      for (const [selector, path, hash] of [
        [".premium-hero a", "/konfigurator/stromspeicher", ""],
        ['.premium-hero a[href="/kontakt#kontaktformular"]', "/kontakt", "#kontaktformular"],
      ]) {
        await navigate(route);
        await js(`document.querySelector(${JSON.stringify(selector)}).click()`);
        for (let i = 0; i < 100; i++) {
          await pause(200);
          if (
            await js(
              `location.pathname===${JSON.stringify(path)}&&location.hash===${JSON.stringify(hash)}&&!!document.querySelector('main')`,
            )
          )
            break;
        }
        assert(
          await js(
            `location.pathname===${JSON.stringify(path)}&&location.hash===${JSON.stringify(hash)}&&!!document.querySelector('main')`,
          ),
        );
        if (hash) assert(await js("!!document.querySelector('#kontaktformular')"));
      }
    }
    console.log(`Storage ${width}px: passed`);
  }
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await navigate(route);
  await primePage();
  report.reducedMotion = await js(
    `({animation:getComputedStyle(document.querySelector('.brand-intro__mark')).animationName,pending:document.querySelectorAll('[data-reveal-state=pending]').length})`,
  );
  assert.equal(report.reducedMotion.animation, "none");
  assert.equal(report.reducedMotion.pending, 0);
  await send("Emulation.setEmulatedMedia", { features: [] });
  for (const width of [1440, 390]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    for (const path of ["/", "/photovoltaik", "/wallbox", "/waermepumpen", "/klimaanlagen"]) {
      await navigate(path);
      await primePage();
      const info = await js(
        `({h1:document.querySelector('main h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,signets:document.querySelectorAll('.brand-intro').length,tariffLink:!!document.querySelector('footer a[href="/stromtarife-pv"]'),broken:[...document.querySelectorAll('main img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc)})`,
      );
      assert(info.h1 && !info.h1.includes("technischer Fehler"));
      assert.equal(info.overflow, false);
      assert.equal(info.signets, 1);
      assert.deepEqual(info.broken, []);
      assert.equal(info.tariffLink, true);
      report.regressions.push({ path, width, ...info });
    }
  }
  for (const path of [
    "/photovoltaik",
    "/wallbox",
    "/waermepumpen",
    "/konfigurator/stromspeicher",
    "/kontakt",
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    report.linkTargets.push({ path, status: response.status });
  }
  for (const slash of ["", "/"]) {
    const r = await fetch(base + "/energieloesungen/batteriespeicher-photovoltaik" + slash, {
      redirect: "manual",
    });
    assert.equal(r.status, 308);
    const next = new URL(r.headers.get("location"), base);
    const final = await fetch(next);
    assert.equal(final.status, 200);
    assert.equal(new URL(final.url).pathname, route);
    report.redirects.push({ source: slash, status: r.status, final: final.url });
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.failedRequests, []);
  report.passed = true;
  console.log("Storage browser acceptance passed.");
} catch (error) {
  report.failure = String(error);
  throw error;
} finally {
  await writeFile(join(output, "results.json"), JSON.stringify(report, null, 2));
  ws?.close();
  chrome.kill();
}
