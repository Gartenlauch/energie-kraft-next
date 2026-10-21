// Targeted extension of the existing Headless Chrome/CDP checks; no form submissions.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const base = process.env.CONSENT_QA_BASE || "http://localhost:3026";
assert(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
const output = resolve("artifacts/sprint12-5-release");
const profile = await mkdtemp(join(tmpdir(), "ek-release-banner-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ws;
try {
  let port;
  for (let i = 0; i < 60; i++) {
    try {
      port = Number((await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]);
      break;
    } catch {
      await pause(200);
    }
  }
  assert(port, "Chrome did not start");
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  ws = new WebSocket(tabs.find((tab) => tab.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
  let id = 0;
  const pending = new Map(),
    errors = [],
    requests = [],
    measurements = [];
  ws.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const item = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) item.reject(message.error);
      else item.resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown")
      errors.push(message.params.exceptionDetails.text);
    if (message.method === "Network.requestWillBeSent") requests.push(message.params.request.url);
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
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function until(expression, label) {
    for (let i = 0; i < 150; i++) {
      if (await js(expression)) return;
      await pause(100);
    }
    throw Error(`Timeout: ${label}`);
  }
  async function key(key, code, windowsVirtualKeyCode) {
    await send("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode });
  }
  async function click(selector) {
    await js(`document.querySelector(${JSON.stringify(selector)}).click()`);
    await pause(100);
  }
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: base + "/impressum" });
  await until('document.documentElement?.classList.contains("show--consent")', "banner");
  await pause(400);
  await mkdir(output, { recursive: true });
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
    [320, 640],
    [1440, 280],
    [320, 240],
  ]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 640,
    });
    await pause(100);
    const measured = await js(`(()=>{
      const rect = e => {const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right};};
      const cm=document.querySelector('.cm'),body=cm.querySelector('.cm__body');
      const buttons=[...cm.querySelectorAll('.cm__btn')].map(e=>({label:e.textContent,rect:rect(e),bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color}));
      return {width:innerWidth,height:innerHeight,cm:rect(cm),body:rect(body),scrollWidth:document.documentElement.scrollWidth,cmScrollWidth:cm.scrollWidth,cmClientWidth:cm.clientWidth,background:getComputedStyle(cm).backgroundColor,buttons};
    })()`);
    assert(Math.abs(measured.cm.bottom - height) <= 1, "Banner anchored at bottom");
    assert(measured.cm.x <= 1 && Math.abs(measured.cm.right - width) <= 1, "Full width");
    assert(
      Math.abs(measured.body.x + measured.body.width / 2 - width / 2) <= 1,
      "Centered content",
    );
    assert(measured.body.width <= 1281, "Content maximum width");
    assert(
      measured.scrollWidth <= width && measured.cmScrollWidth <= measured.cmClientWidth + 1,
      "No horizontal overflow",
    );
    assert.equal(measured.background, "rgb(9, 20, 51)");
    assert.deepEqual(
      measured.buttons.map(({ label }) => label),
      ["Alle akzeptieren", "Nur notwendige", "Einstellungen"],
    );
    assert.equal(
      measured.buttons[0].bg,
      measured.buttons[1].bg,
      "Equal acceptance/rejection styling",
    );
    assert.equal(measured.buttons[0].color, measured.buttons[1].color);
    if (height > 500) {
      for (const button of measured.buttons)
        assert(
          button.rect.y >= 0 && button.rect.bottom <= height && button.rect.height >= 44,
          "Controls visible and touchable",
        );
      if (width === 1440)
        assert(
          measured.buttons.every(({ rect }) => Math.abs(rect.y - measured.buttons[0].rect.y) < 1),
          "Horizontal desktop buttons",
        );
      else
        assert(
          measured.buttons[1].rect.y >= measured.buttons[0].rect.bottom,
          "Stacked mobile buttons",
        );
    }
    // Tabbing also verifies that the scrollable banner exposes controls at very low heights.
    await js('document.querySelector(".cm__title").focus()');
    for (let i = 0; i < 8; i++) {
      await key("Tab", "Tab", 9);
      const focus = await js(
        '(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),s=getComputedStyle(e);return {inside:!!e.closest(".cm"),y:r.y,bottom:r.bottom,outline:s.outlineStyle};})()',
      );
      assert(focus.inside, "Focus stays in banner");
      assert(focus.y >= 0 && focus.bottom <= height + 1, "Focused control visible at low height");
      assert(focus.outline !== "none", "Visible keyboard focus");
    }
    await js('document.querySelector(".cm").scrollTop=0');
    const screenshot = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(
      join(output, `banner-${width}x${height}.png`),
      Buffer.from(screenshot.data, "base64"),
    );
    measurements.push(measured);
  }
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await click('.cm__btn[data-role="show"]');
  await until('document.documentElement.classList.contains("show--preferences")', "preferences");
  assert.equal(
    await js('getComputedStyle(document.querySelector(".pm")).backgroundColor'),
    "rgb(255, 255, 254)",
    "Preferences keep their original design",
  );
  assert.equal(await js('document.querySelectorAll("#cc-main input[type=checkbox]").length'), 5);
  await click('.pm__btn[data-role="necessary"]');
  assert.deepEqual(await js('JSON.parse(localStorage.getItem("ek_consent")).categories'), [
    "necessary",
  ]);
  await pause(400);
  await js(
    '[...document.querySelectorAll("footer button")].find(e=>e.textContent.includes("Cookie-Einstellungen")).click()',
  );
  await until(
    'document.documentElement.classList.contains("show--preferences")',
    "footer preferences",
  );
  await js('[...document.querySelectorAll("#cc-main input[type=checkbox]")][4].click()');
  await click('.pm__btn[data-role="save"]');
  assert.deepEqual(await js('JSON.parse(localStorage.getItem("ek_consent")).categories'), [
    "necessary",
    "googleReviews",
  ]);
  await pause(400);
  await js(
    '[...document.querySelectorAll("footer button")].find(e=>e.textContent.includes("Cookie-Einstellungen")).click()',
  );
  await until('document.documentElement.classList.contains("show--preferences")', "revocation");
  await click('.pm__btn[data-role="necessary"]');
  assert.deepEqual(await js('JSON.parse(localStorage.getItem("ek_consent")).categories'), [
    "necessary",
  ]);
  const trackingRequests = requests.filter((url) =>
    /google-analytics\.com|googletagmanager\.com|doubleclick\.net|googleadservices\.com/.test(url),
  );
  assert.deepEqual(trackingRequests, []);
  assert.deepEqual(errors, []);
  const result = {
    base,
    measurements,
    checks: [
      "Bottom/full width/centered content",
      "Equal acceptance and rejection",
      "1440/390/320px plus low-height keyboard reachability",
      "Preferences design unchanged, five categories",
      "Footer, reviews-only selection, revocation",
      "No tracking requests or runtime errors",
    ],
    trackingRequests,
    runtimeErrors: errors,
  };
  await writeFile(join(output, "banner-qa.json"), JSON.stringify(result, null, 2));
  console.log(
    JSON.stringify(
      {
        checks: result.checks,
        viewports: measurements.map(({ width, height }) => ({ width, height })),
      },
      null,
      2,
    ),
  );
} finally {
  ws?.close();
  chrome.kill();
}
