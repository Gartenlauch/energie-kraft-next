// Targeted local-only browser regression. No real submissions or external emails.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
const profile = await mkdtemp(join(tmpdir(), "ek-sprint82-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9332",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
try {
  let tabs;
  for (let n = 0; n < 60; n++) {
    try {
      tabs = await (await fetch("http://127.0.0.1:9332/json")).json();
      break;
    } catch {
      await pause(250);
    }
  }
  ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  const errors = [];
  let submissions = 0;
  ws.addEventListener("message", async ({ data }) => {
    const m = JSON.parse(data);
    if (m.id) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      if (m.error) p.reject(m.error);
      else p.resolve(m.result);
    }
    if (m.method === "Runtime.exceptionThrown")
      errors.push(
        m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text,
      );
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") {
      const message = m.params.args.map((a) => a.description ?? a.value ?? "").join(" ");
      if (message.includes("currentTarget") || message.includes("reading 'checked'"))
        errors.push(message);
    }
    if (m.method === "Fetch.requestPaused") {
      const { requestId, request } = m.params;
      if (request.url.includes("submitReferral")) {
        if (request.method !== "OPTIONS") submissions++;
        await send("Fetch.fulfillRequest", {
          requestId,
          responseCode: 200,
          responseHeaders: [
            { name: "Content-Type", value: "application/json" },
            { name: "Access-Control-Allow-Origin", value: "http://localhost:3020" },
            { name: "Access-Control-Allow-Headers", value: "*" },
          ],
          body: Buffer.from(
            JSON.stringify({
              result: { ok: true, referralId: "browser-regression-only", mailStatus: "accepted" },
            }),
          ).toString("base64"),
        });
      } else await send("Fetch.continueRequest", { requestId });
    }
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async function js(expression) {
    const r = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.text);
    return r.result.value;
  }
  async function visit(route, width) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Page.navigate", { url: `http://localhost:3020${route}` });
    for (let n = 0; n < 120; n++) {
      await pause(250);
      if (
        await js(
          `location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && !!document.querySelector('main')`,
        )
      )
        break;
    }
    await pause(800);
  }
  async function fill(selector, value) {
    await js(
      `(() => {const e=document.querySelector(${JSON.stringify(selector)}); if(!e) throw Error('Missing '+${JSON.stringify(selector)}); Object.getOwnPropertyDescriptor(e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)}); e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));})()`,
    );
  }
  async function clickText(text) {
    await js(
      `Array.from(document.querySelectorAll('button')).find(e=>e.textContent.includes(${JSON.stringify(text)})).click()`,
    );
    await pause(250);
  }
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*submitReferral*" }] });
  if (process.argv.includes("--upload-only")) {
    for (const width of [1440, 390]) {
      await visit("/bewerbung", width);
      await js(
        `(() => { const transfer=new DataTransfer(); transfer.items.add(new File(['%PDF-1.7\\n%%EOF'],'Lebenslauf.pdf',{type:'application/pdf'})); const input=document.querySelector('input[type=file]');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true})); })()`,
      );
      await pause(250);
      assert(
        await js(
          `document.querySelector('#application-documents-status').textContent.includes('1 von 5')`,
        ),
      );
      assert(await js(`!!document.querySelector('button[aria-label="Lebenslauf.pdf entfernen"]')`));
      await js(`document.querySelector('button[aria-label="Lebenslauf.pdf entfernen"]').click()`);
      await pause(250);
      assert(
        await js(
          `document.querySelector('#application-documents-status').textContent.includes('0 von 5')`,
        ),
      );
      await js(
        `(() => {const transfer=new DataTransfer();transfer.items.add(new File(['unsupported'],'test.exe',{type:'application/octet-stream'}));const input=document.querySelector('input[type=file]');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`,
      );
      await pause(250);
      assert(
        await js(
          `document.querySelector('input[type=file]').getAttribute('aria-invalid')==='true' && document.querySelector('#application-documents-error').textContent.includes('Erlaubt')`,
        ),
      );
      await clickText("Auswahl verwerfen");
      await js(
        `document.documentElement.style.scrollBehavior='auto';document.querySelector('input[type=file]').closest('fieldset').scrollIntoView({block:'start',behavior:'instant'});document.querySelector('input[type=file]').focus({preventScroll:true})`,
      );
      assert(await js(`document.activeElement===document.querySelector('input[type=file]')`));
      await pause(800);
      const shot = await send("Page.captureScreenshot", { format: "png" });
      await writeFile(join(profile, `upload-${width}.png`), Buffer.from(shot.data, "base64"));
      console.log(
        `PASS upload selection, removal, type error and focus at ${width}px (no upload/email)`,
      );
    }
    console.log(`Screenshots: ${profile}`);
  } else {
    await visit("/kunden-werben-kunden", 1440);
    for (const [key, value] of Object.entries({
      salutation: "frau",
      firstName: "Browser",
      lastName: "Regression",
      email: "browser@example.invalid",
    }))
      await fill(`#referrer-${key}`, value);
    await clickText("Nächste Seite");
    for (const [key, value] of Object.entries({
      salutation: "herr",
      firstName: "Test",
      lastName: "Kontakt",
      email: "kontakt@example.invalid",
      phone: "08654123456",
      street: "Teststraße 1",
      postalCode: "83404",
      city: "Ainring",
    }))
      await fill(`#referred-${key}`, value);
    await clickText("Nächste Seite");
    assert(
      await js(
        `!!document.querySelector('#referrer-summary-title') && !!document.querySelector('#referred-summary-title')`,
      ),
    );
    for (let n = 0; n < 3; n++) {
      await js(`document.querySelector('form input[type=checkbox]').click()`);
      await pause(200);
      if (errors.length) break;
    }
    if (process.argv.includes("--reproduce")) {
      console.log(JSON.stringify({ reproduced: errors.length > 0, errors }));
      assert(errors.length > 0);
    } else {
      assert.deepEqual(errors, []);
      await clickText("Empfehlung absenden");
      await pause(1200);
      assert.equal(submissions, 1);
      console.log("PASS KWK 1 → 2 → 3, summaries, consent on/off/on, mocked submission (no email)");
      for (const width of [1440, 390])
        for (const route of ["/kunden-werben-kunden", "/bewerbung", "/jobs", "/", "/ueber-uns"]) {
          await visit(route, width);
          const info = await js(
            `({title:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,crash:document.body.innerText.includes('Ein technischer Fehler'),lowerCTA:document.body.innerText.includes('Lassen Sie uns die passende Lösung'),upload:!!document.querySelector('input[type=file]'),team:[...(document.querySelector('#company-team-title')?.closest('section').querySelectorAll('figure > div') ?? [])].map(e=>Math.round(e.getBoundingClientRect().width))})`,
          );
          assert(!info.overflow, `${route} overflow at ${width}`);
          assert(!info.crash, `${route} crashed`);
          if (route === "/") assert(!info.lowerCTA);
          if (route === "/bewerbung") assert(info.upload);
          console.log(JSON.stringify({ route, width, ...info }));
          const selector =
            route === "/ueber-uns"
              ? "#company-team-title"
              : route === "/jobs"
                ? "#stellen"
                : route === "/bewerbung"
                  ? "input[type=file]"
                  : "main";
          await js(
            `document.documentElement.style.scrollBehavior='auto'; document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:'start',behavior:'instant'})`,
          );
          await pause(800);
          const shot = await send("Page.captureScreenshot", { format: "png" });
          await writeFile(
            join(profile, `${route.replaceAll("/", "_") || "home"}-${width}.png`),
            Buffer.from(shot.data, "base64"),
          );
        }
      assert.deepEqual(errors, []);
      console.log(`Screenshots: ${profile}`);
    }
  }
} finally {
  ws?.close();
  chrome.kill();
}
