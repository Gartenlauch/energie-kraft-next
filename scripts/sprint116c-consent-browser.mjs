// Small local browser acceptance check; no external writes or form submissions.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const profile = await mkdtemp(join(tmpdir(), "ek-consent-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9336",
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
      tabs = await (await fetch("http://127.0.0.1:9336/json")).json();
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
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  await send("Page.enable");
  await send("Runtime.enable");

  const requests = [];
  ws.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === "Network.requestWillBeSent") requests.push(message.params.request.url);
  });
  await send("Network.enable");
  const base = process.env.CONSENT_QA_BASE || "http://localhost:3026";
  const report = [];
  async function until(expression, label) {
    for (let attempt = 0; attempt < 300; attempt++) {
      if (await js(expression)) return;
      await pause(100);
    }
    throw Error(
      "Timeout: " +
        label +
        " " +
        JSON.stringify(
          await js(
            '({url:location.href,cc:!!document.querySelector("#cc-main"),classes:document.documentElement.className,text:document.body.innerText.slice(-1200)})',
          ),
        ) +
        JSON.stringify(errors),
    );
  }
  async function click(selector) {
    await js(`document.querySelector(${JSON.stringify(selector)}).click()`);
    await pause(150);
  }
  async function record() {
    return js('JSON.parse(localStorage.getItem("ek_consent"))');
  }
  async function preferences() {
    await js(
      `(()=>{ const button = [...document.querySelectorAll("footer button")].find(b => b.textContent.includes("Cookie-Einstellungen")); button.focus(); button.click(); })()`,
    );
    await until(
      'document.documentElement?.classList.contains("show--preferences")',
      "footer preferences",
    );
  }
  async function reload() {
    await send("Page.reload");
    await until(
      'document.readyState === "complete" && !!window.dataLayer?.length',
      "reload",
    );
    await pause(250);
  }
  await send("Page.navigate", { url: base + "/impressum" });
  await until('document.documentElement?.classList.contains("show--consent")', "first visit");
  assert.equal(await record(), null);
  await until('document.activeElement.closest("#cc-main") !== null', "initial focus");
  const styles = await js(`["all", "necessary"].map(role => {
    const el = document.querySelector('.cm__btn[data-role="' + role + '"]');
    const s = getComputedStyle(el);
    return {bg:s.backgroundColor, color:s.color, height:el.getBoundingClientRect().height};
  })`);
  assert.deepEqual(styles[0], styles[1], "equal acceptance/rejection prominence");
  assert(styles[0].height >= 44);
  for (let i = 0; i < 12; i++) {
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
    assert(await js('document.activeElement.closest("#cc-main") !== null'), "focus trap");
  }
  report.push("First visit, focus trap, equal-weight controls");
  await click('.cm__btn[data-role="necessary"]');
  assert.deepEqual((await record()).categories, ["necessary"]);
  await reload();
  assert(!(await js('document.documentElement?.classList.contains("show--consent")')));
  report.push("Rejection persists across reload");

  await preferences();
  await click('.pm__btn[data-role="all"]');
  assert.equal((await record()).categories.length, 5);
  const firstTimestamp = (await record()).consentTimestamp;
  report.push("Footer settings and full acceptance");

  await preferences();
  const toggles = await js(
    '[...document.querySelectorAll("#cc-main input[type=checkbox]")].map(e => ({id:e.id, checked:e.checked, disabled:e.disabled, label:!!e.labels?.length}))',
  );
  assert.equal(toggles.length, 5);
  assert(
    toggles.every((t) => t.label),
    "accessible toggle labels",
  );
  assert(toggles[0].disabled && toggles[0].checked, "necessary always enabled");
  // Keep statistics only; all other optional categories are independent.
  await js('[...document.querySelectorAll("#cc-main input[type=checkbox]")].slice(2).forEach(input => input.click())');
  await click('.pm__btn[data-role="save"]');
  assert.deepEqual((await record()).categories, ["necessary", "analytics"]);
  assert.equal((await record()).consentTimestamp, firstTimestamp);
  assert((await record()).lastConsentTimestamp >= firstTimestamp);
  report.push("Individual categories, timestamps, mandatory category");

  await preferences();
  await click('.pm__btn[data-role="necessary"]');
  assert.deepEqual((await record()).categories, ["necessary"]);
  await preferences();
  await click('.pm__btn[data-role="all"]');
  assert.equal((await record()).categories.length, 5);
  report.push("Revocation and renewed acceptance");

  // A real second tab on the same origin causes a native storage event.
  const second = await send("Target.createTarget", { url: base + "/impressum" });
  const secondTabs = await (await fetch("http://127.0.0.1:9336/json")).json();
  const secondWs = new WebSocket(
    secondTabs.find((t) => t.id === second.targetId).webSocketDebuggerUrl,
  );
  await new Promise((resolve) => secondWs.addEventListener("open", resolve, { once: true }));
  async function secondEval(expression) {
    return new Promise((resolve, reject) => {
      const requestId = ++id;
      const listener = ({ data }) => {
        const message = JSON.parse(data);
        if (message.id !== requestId) return;
        secondWs.removeEventListener("message", listener);
        if (message.result?.exceptionDetails || message.error)
          reject(Error(JSON.stringify(message)));
        else resolve(message.result.result.value);
      };
      secondWs.addEventListener("message", listener);
      secondWs.send(
        JSON.stringify({
          id: requestId,
          method: "Runtime.evaluate",
          params: { expression, returnByValue: true },
        }),
      );
    });
  }
  for (let i = 0; i < 100; i++) {
    if (await secondEval('!!window.dataLayer?.length')) break;
    await pause(100);
  }
  await secondEval('localStorage.removeItem("ek_consent")');
  await until(
    'document.documentElement?.classList.contains("show--consent")',
    "cross-tab invalidation",
  );
  secondWs.close();
  await send("Target.closeTarget", { targetId: second.targetId });
  report.push("Native cross-tab storage change resets dialog");

  await click('.cm__btn[data-role="all"]');
  await js(
    'const c=JSON.parse(localStorage.getItem("ek_consent")); c.expirationTime=Date.now()-1; localStorage.setItem("ek_consent",JSON.stringify(c))',
  );
  await reload();
  await until('document.documentElement?.classList.contains("show--consent")', "expired consent");
  assert.equal(await record(), null);
  await click('.cm__btn[data-role="all"]');
  await js('localStorage.setItem("ek_consent","{invalid")');
  await reload();
  await until('document.documentElement?.classList.contains("show--consent")', "invalid consent");
  assert.equal(await record(), null);
  report.push("Expired and malformed records fail closed");

  await click('.cm__btn[data-role="necessary"]');
  await preferences();
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
  });
  await pause(350);
  assert(
    await js('document.activeElement.textContent.includes("Cookie-Einstellungen")'),
    "focus restored to footer",
  );
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await preferences();
  assert(await js("document.documentElement.scrollWidth <= innerWidth"), "mobile overflow");
  report.push("Escape, focus restoration, mobile width");

  const signals = await js("Array.from(window.dataLayer || [], entry => Array.from(entry))");
  assert(signals.length > 0);
  assert(
    signals.every(
      (entry) =>
        entry[0] === "consent" && Object.values(entry[2]).every((value) => value === "denied"),
    ),
  );
  const trackingRequests = requests.filter((url) =>
    /google-analytics\.com|googletagmanager\.com|googleadservices\.com|doubleclick\.net|googlesyndication\.com|google\.com\/(pagead|ccm)/i.test(
      url,
    ),
  );
  assert.deepEqual(trackingRequests, []);
  assert.deepEqual(errors, []);
  report.push(
    "All effective signals denied, no tracking requests on tested local host, no runtime exceptions",
  );
  const output = join(process.cwd(), "artifacts/sprint11-6c-consent");
  await mkdir(output, { recursive: true });
  await writeFile(
    join(output, "qa.json"),
    JSON.stringify({ base, report, trackingRequests, runtimeErrors: errors }, null, 2),
  );
  console.log(JSON.stringify({ base, report }, null, 2));
} finally {
  ws?.close();
  chrome.kill();
}