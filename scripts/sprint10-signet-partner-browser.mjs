// Local Chrome acceptance checks. No form submissions or external writes.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const output = "artifacts/sprint10-signet-partner-qa";
const shotsOnly = process.argv.includes("--screenshots");
const carouselOnly = process.argv.includes("--carousel");
const port = shotsOnly ? 9341 : carouselOnly ? 9342 : 9340;
await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), "ek-sprint10-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ws;
const results = { signets: [], carousel: {}, exceptions: [] };
try {
  let tabs;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      break;
    } catch {
      await wait(250);
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
      results.exceptions.push(message.params.exceptionDetails.text);
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
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function viewport(width) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: width < 500,
    });
  }
  async function navigate(route) {
    await send("Page.navigate", { url: `http://127.0.0.1:3000${route}` });
    let ready = false;
    for (let attempt = 0; attempt < 180; attempt++) {
      await wait(250);
      ready = await js(
        `location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && !!document.querySelector('main h1')`,
      );
      if (ready) break;
    }
    assert(ready, `Page not ready: ${route}`);
    await wait(1100);
  }
  async function screenshot(name) {
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(join(output, name), Buffer.from(data, "base64"));
  }
  await send("Page.enable");
  await send("Runtime.enable");
  const routes = [
    "/",
    "/photovoltaik",
    "/stromspeicher",
    "/photovoltaik-fuer-unternehmen",
    "/gewerbespeicher",
    "/waermepumpen",
    "/klimaanlagen",
    "/wallbox",
    "/stromtarife-pv",
    "/service-und-wartung",
    "/service-und-wartung/service-und-team",
    "/service-und-wartung/wartung-und-reinigung",
    "/service-und-wartung/finanzierung-und-foerderung",
    "/ueber-uns",
    "/referenzen",
    "/jobs",
    "/kontakt",
  ];
  const names = {
    "/": "homepage",
    "/photovoltaik": "photovoltaik",
    "/photovoltaik-fuer-unternehmen": "business-pv",
    "/service-und-wartung": "service",
    "/ueber-uns": "about",
    "/referenzen": "references",
    "/jobs": "jobs",
    "/kontakt": "kontakt",
  };
  for (const width of carouselOnly ? [] : shotsOnly ? [1440, 390] : [1440, 1920, 390, 375, 1024]) {
    await viewport(width);
    for (const route of routes) {
      if (shotsOnly && !(width === 1440 ? names[route] : route === "/photovoltaik")) continue;
      await navigate(route);
      await js(
        "document.querySelector('.brand-intro').scrollIntoView({block:'center',behavior:'instant'})",
      );
      await wait(900);
      const info = await js(`(() => {
        const intro = document.querySelector('.brand-intro');
        const mark = intro.querySelector('.brand-intro__mark');
        const image = mark.querySelector('img');
        const r = mark.getBoundingClientRect();
        const before = intro.previousElementSibling.getBoundingClientRect();
        const after = intro.nextElementSibling.getBoundingClientRect();
        const collision = [...document.querySelectorAll('main h1, main h2, main p, main a, main button, main input')].filter(e => {
          const b = e.getBoundingClientRect();
          return b.width && b.height && b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top;
        }).map(e => e.textContent?.trim().slice(0,80));
        return {variant:intro.className, height:intro.getBoundingClientRect().height, boundaryError:Math.abs((r.top+r.bottom)/2-before.bottom), nextGap:after.top-before.bottom, filter:getComputedStyle(mark).filter, animation:getComputedStyle(mark).animationDuration, aspect:r.width/r.height, imageLoaded:image.complete&&image.naturalWidth>0, overflow:document.documentElement.scrollWidth>innerWidth, collision, below:getComputedStyle(intro.nextElementSibling).backgroundColor};
      })()`);
      results.signets.push({ route, width, ...info });
      assert.equal(await js("document.querySelectorAll('.brand-intro').length"), 1);
      assert.equal(info.height, 0);
      assert(info.boundaryError < 1 && Math.abs(info.nextGap) < 1, `${route} boundary at ${width}`);
      assert(!info.overflow && info.imageLoaded, `${route} overflow/image at ${width}`);
      assert.equal(info.collision.length, 0, `${route} collision at ${width}: ${info.collision}`);
      assert(info.variant.includes(route === "/" ? "--white" : "--brand"));
      assert.equal(info.animation, "0.92s");
      assert(route === "/" ? info.filter.includes("invert(1)") : info.filter === "none");
      if (width === 1440 && names[route]) await screenshot(`${names[route]}-signet-1440.png`);
      if (width === 390 && route === "/photovoltaik") await screenshot("signet-mobile-390.png");
    }
    console.log(`Signets: ${width}px passed (${routes.length} routes)`);
  }
  if (!shotsOnly) {
    await viewport(1440);
    await navigate("/");
    await js(
      "document.querySelector('#partners').scrollIntoView({block:'center',behavior:'instant'})",
    );
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 1, y: 1 });
    for (let attempt = 0; attempt < 60; attempt++) {
      if (
        await js(
          "[...document.querySelectorAll('.partner-logo')].every(img=>img.complete&&img.naturalWidth>0)",
        )
      )
        break;
      await wait(100);
    }
    // Lazy image loading can trigger Embla reInit. Let layout and timing settle
    // before measuring an uninterrupted autoplay sequence.
    await wait(1400);
    const snap = () =>
      js(
        `(() => {const root=document.querySelector('.partner-viewport').getBoundingClientRect(); return [...document.querySelectorAll('.partner-logo-item')].map((e,index)=>({index,d:Math.abs(e.getBoundingClientRect().left-root.left)})).sort((a,b)=>a.d-b.d)[0].index})()`,
      );
    // Observe actual rendered slides without exposing or mocking Embla internals.
    const initial = await snap();
    const start = Date.now();
    results.carousel.samples = [{ elapsed: 0, snap: initial }];
    await screenshot("partner-autoplay-t0.png");
    for (const [target, name] of [
      [2200, "t2"],
      [4300, "t4"],
      [6400, "t6"],
    ]) {
      await wait(Math.max(0, target - (Date.now() - start)));
      results.carousel.samples.push({ elapsed: Date.now() - start, snap: await snap() });
      await screenshot(`partner-autoplay-${name}.png`);
    }
    for (let i = 1; i < 4; i++)
      assert.equal(
        results.carousel.samples[i].snap,
        (initial + i) % 12,
        "Automatic one-slide progression",
      );
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 700, y: 500 });
    let before = await snap();
    await wait(2100);
    assert.notEqual(await snap(), before, "Autoplay while hovered");
    results.carousel.hover = true;
    async function click(selector) {
      const r = await js(
        `(() => {const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`,
      );
      await send("Input.dispatchMouseEvent", {
        type: "mousePressed",
        button: "left",
        clickCount: 1,
        ...r,
      });
      await send("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        button: "left",
        clickCount: 1,
        ...r,
      });
    }
    await click('[aria-label="Weitere Partnerlogos anzeigen"]');
    await wait(700);
    before = await snap();
    await wait(500);
    assert.equal(await snap(), before, "Arrow resets countdown");
    await wait(1300);
    assert.equal(await snap(), (before + 1) % 12, "Autoplay after focused next button");
    results.carousel.nextAndResume = true;
    await click('[aria-label="Vorherige Partnerlogos anzeigen"]');
    await wait(700);
    before = await snap();
    await wait(1800);
    assert.equal(await snap(), (before + 1) % 12, "Autoplay after previous button");
    results.carousel.prevAndResume = true;
    await click(".partner-autoplay");
    await wait(700);
    before = await snap();
    await wait(4500);
    assert.equal(await snap(), before, "Explicit pause");
    await click(".partner-autoplay");
    await wait(2500);
    assert.equal(await snap(), (before + 1) % 12, "Explicit resume");
    results.carousel.pauseResume = true;
    await js("window.scrollTo({top:0,behavior:'instant'})");
    await wait(700);
    before = await snap();
    await wait(2500);
    assert.equal(await snap(), before, "Offscreen pause");
    await js(
      "document.querySelector('#partners').scrollIntoView({block:'center',behavior:'instant'})",
    );
    await wait(2500);
    assert.equal(await snap(), (before + 1) % 12, "Visible again resumes");
    results.carousel.viewportResume = true;
    const dragPoint = await js(
      "(() => {const r=document.querySelector('.partner-viewport').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()",
    );
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...dragPoint });
    await send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      button: "left",
      clickCount: 1,
      ...dragPoint,
    });
    await wait(700);
    before = await snap();
    await wait(2300);
    assert.equal(await snap(), before, "Pointer hold pauses autoplay");
    await send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      button: "left",
      clickCount: 1,
      ...dragPoint,
    });
    await wait(2500);
    assert.equal(await snap(), (before + 1) % 12, "Pointer release resumes autoplay");
    results.carousel.dragResume = true;
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
    await wait(700);
    before = await snap();
    await wait(4500);
    assert.equal(await snap(), before, "Reduced motion pauses autoplay");
    assert.equal(
      await js("getComputedStyle(document.querySelector('.brand-intro__mark')).animationName"),
      "none",
    );
    results.carousel.reducedMotion = true;
    await send("Emulation.setEmulatedMedia", { features: [] });
    await wait(2500);
    assert.notEqual(await snap(), before, "Motion preference change resumes");
    results.carousel.motionPreferenceResume = true;
    console.log(JSON.stringify(results.carousel));
  }
} catch (error) {
  results.failure = String(error);
  console.error(error);
  process.exitCode = 1;
} finally {
  await writeFile(
    join(
      output,
      shotsOnly
        ? "screenshots-results.json"
        : carouselOnly
          ? "carousel-results.json"
          : "browser-results.json",
    ),
    JSON.stringify(results, null, 2),
  );
  ws?.close();
  chrome.kill();
}
