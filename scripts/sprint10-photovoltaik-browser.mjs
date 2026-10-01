// Local, read-only acceptance checks. No form submissions or external writes.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = "http://localhost:3020";
const route = "/photovoltaik";
const screenshotsOnly = process.argv.includes("--screenshots-only");
const output = "artifacts/sprint10-photovoltaik-qa";
await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), "ek-residential-pv-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9337",
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
  calculators: [],
  reducedMotion: null,
  errors: [],
  failedRequests: [],
};
try {
  let tabs;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      tabs = await (await fetch("http://127.0.0.1:9337/json")).json();
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
  const pairs = [
    ["/energieloesungen/photovoltaik-kaufen", "/photovoltaik"],
    ["/photovoltaik/strom-speichern", "/stromspeicher"],
    ["/photovoltaik/foerderungen", "/service-und-wartung/finanzierung-und-foerderung"],
    ["/photovoltaik/preistabelle-photovoltaik", "/rechner/photovoltaik-kosten"],
    ["/photovoltaik/service-und-reparatur", "/service-und-wartung"],
    ["/photovoltaik/strom-produzieren", "/photovoltaik"],
    ["/photovoltaik/strom-tanken", "/wallbox"],
  ];
  for (const [source, destination] of screenshotsOnly ? [] : pairs) {
    for (const slash of ["", "/"]) {
      for (const query of ["", "?utm_source=sprint10-qa"]) {
        let url = base + source + slash + query;
        const hops = [];
        for (let count = 0; count < 5; count++) {
          const response = await fetch(url, { redirect: "manual" });
          const location = response.headers.get("location");
          hops.push({
            url,
            status: response.status,
            location,
            robots: response.headers.get("x-robots-tag"),
          });
          if (!location) {
            assert.equal(response.status, 200, url);
            const body = await response.text();
            assert(
              body.includes("<h1") && !body.includes("technischer Fehler"),
              `Invalid destination: ${url}`,
            );
            assert.equal(new URL(url).pathname, destination);
            assert.equal(new URL(url).search, query);
            assert(response.headers.get("x-robots-tag")?.includes("noindex"));
            break;
          }
          assert.equal(response.status, 308, url);
          url = new URL(location, url).href;
        }
        assert.equal(hops.at(-1).status, 200);
        report.redirects.push({ source: source + slash + query, destination, hops });
      }
    }
  }
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
  for (const width of screenshotsOnly ? [1440, 390] : [1920, 1440, 1280, 1024, 390, 375]) {
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
      const collision=[...document.querySelectorAll('main h1, main h2, main p, main a')].filter(e=>{const b=e.getBoundingClientRect();return b.width&&b.height&&b.left<r.right&&b.right>r.left&&b.top<r.bottom&&b.bottom>r.top}).map(e=>e.textContent);
      const siko=document.querySelector('#montagesysteme img');const b=siko.getBoundingClientRect();
      return {width:innerWidth,h1:[...document.querySelectorAll('main h1')].map(e=>e.textContent),title:document.title,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,overflow:document.documentElement.scrollWidth>innerWidth,animationOverflow:window.qaOverflow,signets:document.querySelectorAll('.brand-intro').length,signetAnimation:getComputedStyle(mark).animationDuration,collision,heroLinks:[...document.querySelectorAll('.premium-hero a')].map(a=>({label:a.textContent.trim(),href:a.getAttribute('href'),height:a.getBoundingClientRect().height})),sigenergy:document.querySelector('#eigenverbrauch img').currentSrc,siko:{src:siko.currentSrc,fit:getComputedStyle(siko).objectFit,width:b.width,height:b.height,naturalWidth:siko.naturalWidth,naturalHeight:siko.naturalHeight},brokenImages:[...document.querySelectorAll('main img')].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc),faqCount:document.querySelectorAll('#faq summary').length,schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent)['@type'])};})()`);
    assert.deepEqual(info.h1, ["Photovoltaik kaufen und eigenen Solarstrom erzeugen"]);
    assert.equal(info.title, "Photovoltaik kaufen: Planung & Montage | Energie-Kraft Süd");
    assert.equal(
      info.description,
      "Photovoltaik kaufen in Bayern: PV-Anlagen mit Speicher, Beratung, Planung und Montage aus einer Hand. Energie-Kraft Süd aus Ainring.",
    );
    assert.equal(info.canonical, "https://www.energie-kraft.de/photovoltaik");
    assert.equal(info.overflow, false);
    assert.equal(info.animationOverflow, false);
    assert.equal(info.signets, 1);
    assert.equal(info.signetAnimation, "0.92s");
    assert.deepEqual(info.collision, []);
    assert.deepEqual(
      info.heroLinks.map((l) => l.href),
      ["/konfigurator/photovoltaik", "/kontakt#kontaktformular"],
    );
    assert(info.heroLinks.every((l) => l.height >= 44));
    assert(
      info.sigenergy.includes(
        `residential-storage-feature-${width < 768 ? "mobile" : "desktop"}.webp`,
      ),
    );
    assert(info.siko.src.includes("siko-montagesystem-schneefang.webp"));
    assert.equal(info.siko.fit, "contain");
    assert(Math.abs(info.siko.width / info.siko.height - 1679 / 1256) < 0.01, "SIKO distorted");
    assert.deepEqual(info.brokenImages, []);
    assert(
      info.schemas.includes("WebPage") &&
        info.schemas.includes("Service") &&
        info.schemas.includes("BreadcrumbList"),
    );
    assert(
      !info.schemas.some((t) => ["Product", "Offer", "AggregateRating", "QAPage"].includes(t)),
    );
    report.viewports.push(info);
    if (width === 1440) {
      await screenshot("01-photovoltaik-full-1440.png", true);
      await scrollTo(".brand-intro");
      await js("scrollBy(0,-600)");
      await screenshot("02-photovoltaik-hero-signet-1440.png");
      await sectionShot("#eigenverbrauch", "03-photovoltaik-sigenergy-1440.png");
      await sectionShot("#montagesysteme", "04-photovoltaik-siko-schneefang-1440.png");
      await scrollTo("#monitoring");
      await screenshot("05-photovoltaik-monitoring-region-1440.png");
      await sectionShot("#regionale-referenzen", "09-photovoltaik-region-1440.png");
      // Supplementary composition overview: browser device emulation scale, never used for normal-width acceptance.
      await send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 900,
        deviceScaleFactor: 0.25,
        mobile: false,
      });
      await js("scrollTo(0,0)");
      await pause(500);
      await screenshot("08-photovoltaik-overview-reduced-zoom.png", true);
      await send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
    }
    if (width === 390) {
      await screenshot("06-photovoltaik-mobile-390-full.png", true);
      await sectionShot("#montagesysteme", "07-photovoltaik-siko-schneefang-mobile-390.png");
      await sectionShot("#eigenverbrauch", "10-photovoltaik-sigenergy-mobile-390.png");
    }
    if (!screenshotsOnly && info.faqCount) {
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
    if (!screenshotsOnly && (width === 1440 || width === 390)) {
      await js("document.querySelector('.premium-hero a').click()");
      for (let i = 0; i < 100; i++) {
        await pause(200);
        if (
          await js(
            "location.pathname==='/konfigurator/photovoltaik'&&!!document.querySelector('main')",
          )
        )
          break;
      }
      assert(
        await js(
          "location.pathname==='/konfigurator/photovoltaik'&&!!document.querySelector('main')",
        ),
      );
      await navigate(route);
      await js(
        "document.querySelector('.premium-hero a[href=\"/kontakt#kontaktformular\"]').click()",
      );
      for (let i = 0; i < 100; i++) {
        await pause(200);
        if (
          await js(
            "location.pathname==='/kontakt'&&location.hash==='#kontaktformular'&&!!document.querySelector('#kontaktformular')",
          )
        )
          break;
      }
      assert(
        await js(
          "location.pathname==='/kontakt'&&location.hash==='#kontaktformular'&&!!document.querySelector('#kontaktformular')",
        ),
      );
    }
    console.log(`PV ${width}px: passed`);
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
  for (const width of screenshotsOnly ? [] : [1440, 390]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    for (const path of [
      "/",
      "/stromspeicher",
      "/wallbox",
      "/waermepumpen",
      "/klimaanlagen",
      "/photovoltaik-fuer-unternehmen",
    ]) {
      await navigate(path);
      await primePage();
      const info = await js(
        `({title:document.querySelector('main h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,signets:document.querySelectorAll('.brand-intro').length,heroImage:document.querySelector('.premium-hero img')?.currentSrc,technical:!!document.querySelector('.editorial-section--technical'),broken:[...document.querySelectorAll('main img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc)})`,
      );
      assert(info.title && !info.title.includes("technischer Fehler"));
      assert.equal(info.overflow, false);
      assert.equal(info.signets, 1);
      assert.equal(info.technical, false);
      assert.deepEqual(info.broken, []);
      if (path === "/stromspeicher")
        assert(
          info.heroImage.includes(
            `residential-storage-hero-${width < 768 ? "mobile" : "desktop"}.webp`,
          ),
        );
      report.regressions.push({ path, width, ...info });
    }
    console.log(`Regression ${width}px: passed`);
  }
  for (const path of screenshotsOnly
    ? []
    : ["/rechner/photovoltaik-kosten", "/rechner/photovoltaik"]) {
    await navigate(path);
    await pause(1000);
    const info = await js(
      `(()=>{const input=document.querySelector('main input[type=number]');const before=input?.value;if(input){const min=Number(input.min)||0;const max=Number(input.max)||10000;const step=Number(input.step)||1;const val=Math.min(max,Math.max(min,Number(before)+step));Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,String(val));input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));}return{h1:document.querySelector('main h1')?.textContent,inputCount:document.querySelectorAll('main input').length,before}})()`,
    );
    await pause(700);
    info.after = await js("document.querySelector('main input[type=number]')?.value");
    assert(info.inputCount > 0 && info.h1 && info.after !== info.before);
    await js("document.querySelector('main button[type=submit]').click()");
    await pause(800);
    info.resultVisible = await js("document.querySelector('main').innerText.includes('Ergebnis')");
    assert(info.resultVisible, `Calculator result missing: ${path}`);
    report.calculators.push({ path, ...info });
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.failedRequests, []);
  report.passed = true;
  console.log(
    screenshotsOnly
      ? "Desktop/mobile screenshots completed; reduced motion passed."
      : `HTTP: ${report.redirects.length} chains passed; calculators and reduced motion passed.`,
  );
} catch (error) {
  report.failure = String(error);
  throw error;
} finally {
  await writeFile(
    join(output, screenshotsOnly ? "screenshots-results.json" : "results.json"),
    JSON.stringify(report, null, 2),
  );
  ws?.close();
  chrome.kill();
}
