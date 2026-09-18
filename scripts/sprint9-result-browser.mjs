// Focused local Sprint 9 browser acceptance check. No form submission or external write.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const profile = await mkdtemp(join(tmpdir(), "ek-sprint9-browser-"));
const outputDir = process.env.RESULT_BROWSER_OUTPUT_DIR ?? profile;
await mkdir(outputDir, { recursive: true });
const baseUrl = process.env.SPRINT9_BROWSER_BASE_URL ?? "http://localhost:3020";
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9340",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket;

try {
  let targets;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      targets = await (await fetch("http://127.0.0.1:9340/json")).json();
      break;
    } catch {
      await pause(250);
    }
  }
  assert(targets, "Chrome did not start");
  socket = new WebSocket(targets.find((target) => target.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  const runtimeErrors = [];
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request.reject(message.error);
      else request.resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown")
      runtimeErrors.push(message.params.exceptionDetails.text);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  async function js(expression) {
    const result = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }
  async function waitFor(expression, message) {
    for (let attempt = 0; attempt < 120; attempt += 1) {
      if (await js(expression)) return;
      await pause(100);
    }
    throw new Error(`Timeout: ${message}`);
  }
  async function navigate(route) {
    await send("Page.navigate", { url: `${baseUrl}${route}` });
    await waitFor(
      `location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && !!document.querySelector('main')`,
      route,
    );
    await pause(250);
  }
  async function clickMain(text, exact = false) {
    const predicate = exact
      ? `e.textContent.trim() === ${JSON.stringify(text)}`
      : `e.textContent.includes(${JSON.stringify(text)})`;
    const clicked = await js(
      `(() => { const items=[...document.querySelectorAll('main button, main a')].filter(e=>e.getBoundingClientRect().height>0); const item=items.find(e=>${predicate}); if(item?.disabled) return false; item?.click(); return !!item; })()`,
    );
    assert(clicked, `Missing action: ${text}`);
    await pause(180);
  }
  async function setInput(selector, value) {
    assert(
      await js(
        `(() => { const input=document.querySelector(${JSON.stringify(selector)}); if(!input) return false; const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,${JSON.stringify(String(value))}); input.dispatchEvent(new Event('input',{bubbles:true})); return true; })()`,
      ),
      `Missing input ${selector}`,
    );
    await pause(120);
  }
  async function assertLayout(width, label) {
    const info = await js(
      `({overflow:document.documentElement.scrollWidth > document.documentElement.clientWidth,viewportWidth:window.innerWidth,documentWidth:document.documentElement.clientWidth,bodyWidth:document.body.clientWidth,h1:document.querySelectorAll('main h1').length,crash:document.body.innerText.includes('Ein technischer Fehler')})`,
    );
    assert.equal(info.viewportWidth, width, `${label} viewport width`);
    if (width === 390) {
      assert.equal(info.documentWidth, width, `${label} document width`);
      assert.equal(info.bodyWidth, width, `${label} body width`);
    }
    assert.equal(info.h1, 1, `${label} h1 at ${width}`);
    assert.equal(info.overflow, false, `${label} overflow at ${width}`);
    assert.equal(info.crash, false, `${label} crash at ${width}`);
  }
  async function screenshot(name, selector, includeNextSibling = false) {
    await js(
      "document.querySelectorAll('nextjs-portal').forEach((node) => { node.style.display = 'none'; })",
    );
    const clip = await js(`(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const next = ${includeNextSibling} ? element.nextElementSibling?.getBoundingClientRect() : null;
      const x = Math.max(0, Math.floor(rect.left + scrollX - 16));
      const y = Math.max(0, Math.floor(rect.top + scrollY - 12));
      return { x, y, width: Math.min(document.documentElement.scrollWidth, Math.ceil(rect.right + scrollX + 16)) - x, height: Math.ceil((next?.bottom ?? rect.bottom) + scrollY + 12) - y, scale: 1 };
    })()`);
    assert(clip, `Missing screenshot target: ${selector}`);
    const image = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip,
    });
    await writeFile(join(outputDir, `${name}.png`), Buffer.from(image.data, "base64"));
  }
  async function clearProject() {
    await js("sessionStorage.clear()");
  }

  await send("Page.enable");
  await send("Runtime.enable");

  for (const width of process.env.RESULT_BROWSER_WIDTH
    ? [Number(process.env.RESULT_BROWSER_WIDTH)]
    : [1440, 390]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width === 390 ? 844 : 1000,
      deviceScaleFactor: 1,
      mobile: width === 390,
    });

    await navigate("/konfigurator/photovoltaik");
    await clearProject();
    await navigate("/konfigurator/photovoltaik");
    await waitFor(
      "document.body.innerText.includes('Energiesystem konfigurieren')",
      "PV project phase",
    );
    for (const choice of ["3 Personen", "Eigentümer", "Freistehendes Einfamilienhaus"]) {
      await clickMain(choice);
      await clickMain("Weiter", true);
    }
    await clickMain("Weiter", true);
    for (const choice of ["Normal geneigt", "Dachziegel", "Süd", "Nach 1990", "Keine Erhöhung"]) {
      await clickMain(choice);
      await clickMain("Weiter", true);
    }
    await clickMain("Weiter", true);
    await clickMain("Nein, aktuell nicht");
    await clickMain("Weiter zum Ergebnis");
    await waitFor(
      "document.querySelector('main h1')?.textContent.includes('Photovoltaik-Empfehlung')",
      "PV result",
    );
    assert(await js("document.body.innerText.includes('Finanzieller Vorteil im ersten Jahr')"));
    assert(await js("document.body.innerText.includes('Solarinvestition')"));
    await assertLayout(width, "PV result");
    if (width === 1440)
      await screenshot(
        "01-pv-result-desktop",
        'section[aria-labelledby="photovoltaic-result-heading"]',
      );
    if (process.env.RESULT_BROWSER_STOP_AFTER_PV) {
      console.log(`PASS Sprint 9 compact PV result at ${width}px`);
      break;
    }

    await clickMain("Stromspeicher mit berücksichtigen");
    await clickMain("Weiter zum Stromspeicher");
    await waitFor("location.pathname === '/konfigurator/stromspeicher'", "storage route");
    for (const choice of ["Über den Tag verteilt", "Nein", "Ausgewogen"]) {
      await clickMain(choice);
      if (choice === "Ausgewogen") await clickMain("Ergebnis anzeigen");
      else await clickMain("Weiter", true);
    }
    await waitFor(
      "document.querySelector('main h1')?.textContent.includes('Stromspeicher-Empfehlung')",
      "storage result",
    );
    assert(
      await js(
        "document.querySelector('main').textContent.toLowerCase().includes('ohne speicher') && document.querySelector('main').textContent.toLowerCase().includes('mit speicher')",
      ),
    );
    await assertLayout(width, "PV/storage result");
    await screenshot(
      width === 1440 ? "02-storage-result-desktop" : "03-storage-result-mobile",
      'section[aria-labelledby="battery-result-heading"]',
    );

    await js(
      `(() => { const key='energie-kraft:configurator:state:v10'; const state=JSON.parse(sessionStorage.getItem(key)); state.interests.heatPump=true; state.interests.climate=true; state.interests.wallbox=true; sessionStorage.setItem(key,JSON.stringify(state)); })()`,
    );
    await navigate("/konfigurator/waermepumpe");
    for (const choice of ["Gasheizung", null, "Ca. 90", "4 Personen", "Ca. 45", "JAZ 3,5"]) {
      if (choice) await clickMain(choice);
      else await setInput("#heat-pump-heated-area", 160);
      if (choice === "JAZ 3,5") await clickMain("Ergebnis anzeigen");
      else await clickMain("Weiter", true);
    }
    await waitFor(
      "document.querySelector('main h1')?.textContent.includes('Wärmepumpen-Orientierung')",
      "heat pump result",
    );
    assert(
      await js(
        "document.body.innerText.toLowerCase().includes('modellierte heizkostenersparnis') && document.body.innerText.toLowerCase().includes('förderung nicht berücksichtigt')",
      ),
    );
    await assertLayout(width, "heat pump result");
    if (width === 1440)
      await screenshot(
        "04-heat-pump-result-desktop",
        'section[aria-labelledby="heating-cost-heading"]',
      );

    await js(
      `(() => { const key='energie-kraft:configurator:state:v10'; const state=JSON.parse(sessionStorage.getItem(key)); state.climate.conditionedAreaM2=state.heatPump.heatedAreaM2; state.climate.occupancyPersons=state.heatPump.occupancyPersons; sessionStorage.setItem(key,JSON.stringify(state)); })()`,
    );

    await navigate("/konfigurator/klimaanlage");
    await waitFor(
      "document.querySelector('#climate-conditioned-area')?.value === '160'",
      "inherited climate area",
    );
    await setInput("#climate-room-count", 4);
    assert(await js("document.body.innerText.includes('Wärmepumpen-Konfiguration übernommen')"));
    if (width === 1440) {
      const tops = await js(
        "({left:document.querySelector('#climate-conditioned-area').getBoundingClientRect().top,right:document.querySelector('#climate-room-count').getBoundingClientRect().top})",
      );
      assert.equal(tops.left, tops.right, "climate desktop input alignment");
    }
    await assertLayout(width, "climate input");
    await screenshot(
      width === 1440 ? "05-climate-input-desktop" : "06-climate-input-mobile",
      'section[aria-labelledby="climate-step-heading"]',
    );
    await setInput("#climate-conditioned-area", 150);
    assert(await js("document.querySelector('#climate-conditioned-area')?.value === '150'"));
    await setInput("#climate-conditioned-area", 160);
    await clickMain("Weiter", true);
    for (const choice of ["Durchschnittlich", "Mittel"]) {
      await clickMain(choice);
      await clickMain("Weiter", true);
    }
    await setInput("#climate-occupancy", 4);
    await clickMain("Ergebnis anzeigen");
    await waitFor(
      "document.querySelector('main h1')?.textContent.includes('Klimaanlagen-Orientierung')",
      "climate result",
    );
    assert(
      await js(
        "document.body.innerText.toLowerCase().includes('angenehme temperaturen') && !document.querySelector('main section')?.innerText.includes('Klimaanlagen-Rendite')",
      ),
    );
    await assertLayout(width, "climate result");
    await screenshot(
      width === 1440 ? "07-climate-result-desktop" : "08-climate-result-mobile",
      'section[aria-labelledby="climate-result-heading"]',
    );

    await navigate("/konfigurator/wallbox");
    for (const [selector, value] of [
      ["#wallbox-annual-driving", 15000],
      ["#wallbox-vehicle-consumption", 18],
      ["#wallbox-battery-capacity", 60],
    ])
      await setInput(selector, value);
    await clickMain("Weiter", true);
    await clickMain("Überwiegend zu Hause");
    await clickMain("Weiter", true);
    await clickMain("11 kW");
    await clickMain("Weiter", true);
    await clickMain("Etwa 30 %");
    await clickMain("Ergebnis anzeigen");
    await waitFor(
      "document.querySelector('main h1')?.textContent.includes('Wallbox-Empfehlung')",
      "wallbox result",
    );
    assert(
      await js(
        "document.body.innerText.toLowerCase().includes('bequem zu hause laden') && document.body.innerText.toLowerCase().includes('heimladebedarf im jahr')",
      ),
    );
    await assertLayout(width, "wallbox result");
    if (width === 1440)
      await screenshot(
        "09-wallbox-result-desktop",
        'section[aria-labelledby="wallbox-result-heading"]',
      );
    assert(
      await js(
        "document.body.innerText.toLowerCase().includes('dein energieprojekt') && document.body.innerText.toLowerCase().includes('komfort & lebensqualität')",
      ),
    );
    assert(
      await js(
        "document.body.innerText.includes('Hier im Browser erhältst du bereits eine kompakte Auswertung') && document.body.innerText.includes('detaillierter Wirtschaftlichkeitsberechnung')",
      ),
    );
    await screenshot(
      width === 1440 ? "10-project-preview-desktop" : "11-project-preview-mobile",
      'section[aria-labelledby="project-analysis-preview-heading"]',
      true,
    );
    console.log(`PASS Sprint 9 result flows at ${width}px`);
  }

  assert.deepEqual(runtimeErrors, []);
  console.log(`Screenshots: ${outputDir}`);
} finally {
  socket?.close();
  chrome.kill();
}
