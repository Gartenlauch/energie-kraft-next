// Focused local Sprint 9 browser acceptance check. No form submission or external write.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const profile = await mkdtemp(join(tmpdir(), "ek-sprint9-browser-"));
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
    await send("Page.navigate", { url: `http://localhost:3020${route}` });
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
      `(() => { const items=[...document.querySelectorAll('main button, main a')].filter(e=>e.getBoundingClientRect().height>0); const item=items.find(e=>${predicate}); item?.click(); return !!item; })()`,
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
      `({overflow:document.documentElement.scrollWidth > document.documentElement.clientWidth,h1:document.querySelectorAll('main h1').length,crash:document.body.innerText.includes('Ein technischer Fehler')})`,
    );
    assert.equal(info.h1, 1, `${label} h1 at ${width}`);
    assert.equal(info.overflow, false, `${label} overflow at ${width}`);
    assert.equal(info.crash, false, `${label} crash at ${width}`);
  }
  async function screenshot(name) {
    const image = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(join(profile, `${name}.png`), Buffer.from(image.data, "base64"));
  }
  async function clearProject() {
    await js("sessionStorage.clear()");
  }

  await send("Page.enable");
  await send("Runtime.enable");

  for (const width of [1440, 390]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width === 390 ? 844 : 1000,
      deviceScaleFactor: 1,
      mobile: width === 390,
    });

    await navigate("/konfigurator/photovoltaik");
    await clearProject();
    await navigate("/konfigurator/photovoltaik");
    await clickMain("3 Personen");
    await clickMain("Weiter", true);
    await clickMain("Eigentümer");
    await clickMain("Weiter", true);
    await clickMain("Freistehendes Einfamilienhaus");
    await clickMain("Weiter", true);
    await clickMain("Weiter", true);
    await clickMain("Normal geneigt");
    await clickMain("Weiter", true);
    await clickMain("Dachziegel");
    await clickMain("Weiter", true);
    await clickMain("Süd");
    await clickMain("Weiter", true);
    await clickMain("Nach 1990");
    await clickMain("Weiter", true);
    await clickMain("Keine Erhöhung");
    await clickMain("Weiter", true);
    await clickMain("Weiter", true);
    await clickMain("Nein, aktuell nicht");
    await clickMain("Weiter zum Ergebnis");
    await waitFor(
      "document.querySelector('main h1')?.textContent.includes('Photovoltaik-Empfehlung')",
      "PV result",
    );
    assert(await js("document.body.innerText.includes('Stromspeicher mit berücksichtigen')"));
    assert(await js("document.body.innerText.includes('Modellierter Projektkosten-Korridor')"));
    await assertLayout(width, "PV result");
    await screenshot(`pv-result-${width}`);
    await js("document.querySelector('main figure')?.scrollIntoView({block:'center'})");
    await pause(150);
    await screenshot(`pv-chart-${width}`);
    await clickMain("Stromspeicher mit berücksichtigen");
    await waitFor(
      "document.body.innerText.includes('Weiter zum Stromspeicher')",
      "storage journey action",
    );
    await clickMain("Weiter zum Stromspeicher");
    await waitFor("location.pathname === '/konfigurator/stromspeicher'", "storage route");
    await clickMain("Über den Tag verteilt");
    await clickMain("Weiter", true);
    await clickMain("Nein");
    await clickMain("Weiter", true);
    await clickMain("Ausgewogen");
    await clickMain("Ergebnis anzeigen");
    await waitFor(
      "document.querySelector('main h1')?.textContent.includes('Stromspeicher-Empfehlung')",
      "storage result",
    );
    await clickMain("Weiter zu den Kontaktdaten");
    await waitFor("document.activeElement?.id === 'configurator-first-name'", "first-name focus");
    await assertLayout(width, "PV/storage contact");
    await screenshot(`contact-${width}`);

    await clearProject();
    await navigate("/konfigurator/waermepumpe");
    await setInput("#heat-pump-heated-area", 160);
    await clickMain("Weiter", true);
    await clickMain("Ca. 90");
    await clickMain("Weiter", true);
    await clickMain("4 Personen");
    await clickMain("Weiter", true);
    await clickMain("Ca. 45");
    await clickMain("Weiter", true);
    await clickMain("JAZ 3,5");
    await clickMain("Ergebnis anzeigen");
    await waitFor(
      "document.querySelector('main h1')?.textContent.includes('Wärmepumpen-Orientierung')",
      "heat-pump result",
    );
    assert.equal(await js("document.body.innerText.includes('Detailliert berechnen')"), false);
    await clickMain("Klimaanlage");
    await waitFor(
      "document.body.innerText.includes('Weiter zur Klimaanlage')",
      "climate journey action",
    );
    await clickMain("Weiter zur Klimaanlage");
    await waitFor("location.pathname === '/konfigurator/klimaanlage'", "climate route");
    await setInput("#climate-room-count", 4);
    await clickMain("Weiter", true);
    await clickMain("Durchschnittlich");
    await clickMain("Weiter", true);
    await clickMain("Mittel");
    await clickMain("Weiter", true);
    await clickMain("Ergebnis anzeigen");
    await waitFor(
      "document.querySelector('main h1')?.textContent.includes('Klimaanlagen-Orientierung')",
      "climate result",
    );
    assert.equal(await js("document.body.innerText.includes('Detailliert berechnen')"), false);
    await assertLayout(width, "climate result");
    await screenshot(`climate-result-${width}`);
    await js("document.querySelector('main figure')?.scrollIntoView({block:'center'})");
    await pause(150);
    await screenshot(`climate-chart-${width}`);
    await clickMain("Weiter zu den Kontaktdaten");
    await waitFor(
      "document.activeElement?.id === 'configurator-first-name'",
      "heat/climate first-name focus",
    );

    await clearProject();
    await navigate("/rechner/photovoltaik-kosten");
    await clearProject();
    assert(
      (await js("document.querySelectorAll('main figure').length")) >= 2,
      "calculator charts missing",
    );
    assert(await js("document.body.innerText.includes('Projekt konfigurieren')"));
    await assertLayout(width, "PV sizing calculator");
    await screenshot(`calculator-${width}`);
    await js("document.querySelector('main figure')?.scrollIntoView({block:'center'})");
    await pause(150);
    await screenshot(`calculator-chart-${width}`);
    const calculatorHandoff = await js(
      `(() => { const links=[...document.querySelectorAll('main a[href="/konfigurator/photovoltaik"]')]; const link=links.find(item=>item.closest('aside')?.innerText.includes('Aus Orientierung wird dein Energieprojekt')); link?.click(); return link ? sessionStorage.getItem('energie-kraft:calculator-handoff:v1') : null; })()`,
    );
    assert(calculatorHandoff, "calculator CTA did not persist its handoff");
    await waitFor("location.pathname === '/konfigurator/photovoltaik'", "calculator handoff route");
    await waitFor(
      `sessionStorage.getItem('energie-kraft:configurator:state:v8') !== null`,
      "calculator handoff state",
    );
    const handoff = await js(
      `(() => { const value=sessionStorage.getItem('energie-kraft:configurator:state:v8'); return value ? JSON.parse(value) : null; })()`,
    );
    assert.equal(handoff.household.annualConsumptionKwh, 4500);
    assert.equal(handoff.roof.orientation, "south");
    console.log(`PASS Sprint 9 representative flows at ${width}px`);
  }

  assert.deepEqual(runtimeErrors, []);
  console.log(`Screenshots: ${profile}`);
} finally {
  socket?.close();
  chrome.kill();
}
