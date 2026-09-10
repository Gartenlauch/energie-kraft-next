// Small local browser acceptance check; no external writes or form submissions.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const profile = await mkdtemp(join(tmpdir(), "ek-sprint83a-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9333",
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
      tabs = await (await fetch("http://127.0.0.1:9333/json")).json();
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
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text);
    return result.result.value;
  }
  await send("Page.enable");
  await send("Runtime.enable");
  const detail = "/faq/photovoltaik/wie-funktioniert-photovoltaik";
  for (const width of [1440, 390]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width === 390,
    });
    for (const route of ["/", "/photovoltaik", "/faq", "/faq/photovoltaik", detail]) {
      await send("Page.navigate", { url: `http://localhost:3020${route}` });
      for (let attempt = 0; attempt < 120; attempt++) {
        await pause(250);
        if (
          await js(
            `location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && !!document.querySelector('main')`,
          )
        )
          break;
      }
      await pause(500);
      const info = await js(
        `({title:document.querySelector('h1')?.textContent, h1:document.querySelectorAll('h1').length, overflow:document.documentElement.scrollWidth > innerWidth, crash:document.body.innerText.includes('Ein technischer Fehler'), schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent))})`,
      );
      assert.equal(info.h1, 1, `${route} H1`);
      assert(!info.overflow, `${route} overflow at ${width}`);
      assert(!info.crash, `${route} crashed`);
      assert(!info.schemas.some((schema) => schema["@type"] === "QAPage"));
      if (route === "/photovoltaik") {
        assert.equal(await js("document.querySelectorAll('#faq details').length"), 6);
        assert.equal(
          info.schemas.find((schema) => schema["@type"] === "FAQPage").mainEntity.length,
          6,
        );
      }
      if (route === "/faq/photovoltaik")
        assert.equal(await js("document.querySelectorAll('main details').length"), 7);
      if (route === detail) {
        assert.equal(
          info.schemas.find((schema) => schema["@type"] === "BreadcrumbList").itemListElement
            .length,
          4,
        );
        assert.equal(
          await js("document.querySelectorAll('aside[aria-labelledby=related-faqs] li').length"),
          5,
        );
        assert(
          await js(
            "!!document.querySelector('#short-answer') && !!document.querySelector('#long-answer')",
          ),
        );
      }
      if (route === "/faq") {
        await js(
          `(() => { const input = document.querySelector('#faq-search'); input.focus(); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Kondensat'); input.dispatchEvent(new Event('input', {bubbles:true})); })()`,
        );
        await pause(300);
        assert.equal(
          await js("document.querySelector('[role=status]').textContent"),
          "1 Fragen gefunden",
        );
        await js(
          `(() => { const input = document.querySelector('#faq-search'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'xyznothing'); input.dispatchEvent(new Event('input', {bubbles:true})); })()`,
        );
        await pause(300);
        assert.equal(
          await js("document.querySelector('[role=status]').textContent"),
          "0 Fragen gefunden",
        );
        await js(
          `(() => { const input = document.querySelector('#faq-search'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ''); input.dispatchEvent(new Event('input', {bubbles:true})); const select = document.querySelector('#faq-category'); select.value='photovoltaik'; select.dispatchEvent(new Event('change', {bubbles:true})); })()`,
        );
        await pause(300);
        assert.equal(
          await js("document.querySelector('[role=status]').textContent"),
          "7 Fragen gefunden",
        );
        assert.equal(await js("location.search"), "");
      }
      await js(
        `document.documentElement.style.scrollBehavior='auto';document.querySelector(${JSON.stringify(route === "/" ? "#energy-flow-title" : route === "/photovoltaik" ? "#faq" : "main")}).scrollIntoView({block:'start',behavior:'instant'})`,
      );
      await pause(300);
      const shot = await send("Page.captureScreenshot", { format: "png" });
      await writeFile(
        join(profile, `${route.replaceAll("/", "_") || "home"}-${width}.png`),
        Buffer.from(shot.data, "base64"),
      );
      console.log(`PASS ${width}px ${route}: ${info.title}`);
    }
  }
  assert.deepEqual(errors, []);
  const missing = await fetch("http://localhost:3020/faq/photovoltaik/does-not-exist");
  assert.equal(missing.status, 404);
  console.log(`PASS unknown detail returns 404. Screenshots: ${profile}`);
} finally {
  ws?.close();
  chrome.kill();
}
