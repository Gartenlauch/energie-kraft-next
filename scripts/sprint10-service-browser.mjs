// Local, read-only browser QA for the Service & Wartung hub.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = "http://localhost:3022";
const output = "artifacts/sprint10-service-qa";
await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), "ek-service-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9339",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const report = { viewports: [], links: [], regressions: [], errors: [], reducedMotion: null };
let ws;
try {
  let tabs;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      tabs = await (await fetch("http://127.0.0.1:9339/json")).json();
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
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
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
    for (let attempt = 0; attempt < 120; attempt++) {
      await pause(250);
      if (
        await js(
          `location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete' && !!document.querySelector('main')`,
        )
      ) {
        await pause(350);
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
    const { data } = await send("Page.captureScreenshot", params);
    await writeFile(join(output, name), Buffer.from(data, "base64"));
  }
  async function screenshotSection(selector, name) {
    await js(
      `document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`,
    );
    await pause(400);
    await screenshot(name);
  }
  async function revealWholePage() {
    const height = await js("document.documentElement.scrollHeight");
    for (let y = 0; y < height; y += 650) {
      await js(`window.scrollTo({top:${y},behavior:'instant'})`);
      await pause(70);
    }
    await js("window.scrollTo({top:0,behavior:'instant'})");
    await pause(400);
  }
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");

  for (const width of [1920, 1440, 1280, 1024, 390, 375]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await navigate("/service-und-wartung");
    const state = await js(`({
      title:document.querySelector('main h1')?.textContent,
      overflow:document.documentElement.scrollWidth>innerWidth,
      signets:document.querySelectorAll('.brand-intro--brand').length,
      systems:[...document.querySelectorAll('#service-systeme article h3')].map(n=>n.textContent),
      sections:[...document.querySelectorAll('main section[id]')].map(n=>n.id),
      broken:[...document.querySelectorAll('main img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc)
    })`);
    assert.equal(state.title, "Damit Ihre Energietechnik zuverlässig weiterarbeitet");
    assert.equal(state.overflow, false, `Horizontal overflow at ${width}px`);
    assert.equal(state.signets, 1);
    assert.equal(state.systems.length, 4);
    assert(state.systems[2].includes("Wärmepumpe") && state.systems[3].includes("Klimaanlagen"));
    assert.deepEqual(state.broken, []);
    report.viewports.push({ width, ...state });
    if (width === 1440) {
      await revealWholePage();
      await screenshot("01-service-full-1440.png", true);
      await screenshotSection(".premium-hero", "02-service-hero-signet-1440.png");
      await screenshotSection("#service-systeme", "03-service-systems-1440.png");
      await screenshotSection(
        "#service-systeme article:nth-child(4)",
        "04-service-climate-1440.png",
      );
      await screenshotSection("#monitoring", "05-service-monitoring-1440.png");
      await screenshotSection("#wartung", "06-service-maintenance-1440.png");
      await screenshotSection("#service-team", "07-service-team-1440.png");
    }
    if (width === 390) {
      await revealWholePage();
      await screenshot("08-service-mobile-390-full.png", true);
      await screenshotSection("#service-systeme", "09-service-systems-mobile-390.png");
    }
    console.log(`Service ${width}px: passed`);
  }

  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await navigate("/service-und-wartung");
  report.reducedMotion = await js(`({
    animation:getComputedStyle(document.querySelector('.brand-intro__mark')).animationName,
    pending:document.querySelectorAll('[data-reveal-state=pending]').length
  })`);
  assert.equal(report.reducedMotion.animation, "none");
  assert.equal(report.reducedMotion.pending, 0);
  await send("Emulation.setEmulatedMedia", { features: [] });

  const expectedLinks = [
    "/photovoltaik",
    "/stromspeicher",
    "/waermepumpen",
    "/klimaanlagen",
    "/wallbox",
    "/service-und-wartung/service-und-team",
    "/service-und-wartung/wartung-und-reinigung",
    "/kontakt#kontaktformular",
  ];
  for (const href of expectedLinks) {
    const found = await js(`!!document.querySelector('main a[href="${href}"]')`);
    assert(found, `Missing link: ${href}`);
    report.links.push(href);
  }
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Tab",
    code: "Tab",
    windowsVirtualKeyCode: 9,
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Tab",
    code: "Tab",
    windowsVirtualKeyCode: 9,
  });
  const focused = await js(`(()=>{
    const link=document.querySelector('#service-systeme a');
    link.focus();
    return document.activeElement===link && getComputedStyle(link).outlineStyle!=='none';
  })()`);
  assert(focused, "System link has no visible keyboard focus");

  for (const path of ["/", "/klimaanlagen", "/waermepumpen", "/photovoltaik", "/stromspeicher"]) {
    await navigate(path);
    const state = await js(`({
      title:document.querySelector('main h1')?.textContent,
      overflow:document.documentElement.scrollWidth>innerWidth,
      broken:[...document.querySelectorAll('main img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc)
    })`);
    assert(state.title && !state.title.includes("technischer Fehler"));
    assert.equal(state.overflow, false);
    assert.deepEqual(state.broken, []);
    report.regressions.push({ path, ...state });
  }
  assert.deepEqual(report.errors, []);
  report.passed = true;
} catch (error) {
  report.failure = String(error);
  throw error;
} finally {
  await writeFile(join(output, "results.json"), JSON.stringify(report, null, 2));
  ws?.close();
  chrome.kill();
}
