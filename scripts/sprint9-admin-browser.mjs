// Local emulator-only Admin visual check. Optionally saves one settings version in the emulator.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const baseUrl = process.env.SPRINT9_BROWSER_BASE_URL ?? "http://127.0.0.1:3020";
const email = process.env.SPRINT9_ADMIN_EMAIL;
const password = process.env.SPRINT9_ADMIN_PASSWORD;
assert(baseUrl.startsWith("http://127.0.0.1:"), "Use a local app server");
assert(email && password, "Local emulator Admin credentials are required");

const signIn = await fetch(
  "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=local",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  },
);
assert(signIn.ok, "Local Auth emulator sign-in failed");
const { idToken } = await signIn.json();
const session = await fetch(`${baseUrl}/api/admin/session`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: baseUrl },
  body: JSON.stringify({ idToken }),
});
if (!session.ok) {
  const response = await session.json().catch(() => ({}));
  throw new Error(`Local Admin session creation failed (${session.status}): ${response.error ?? "unknown"}`);
}
const cookie = session.headers.get("set-cookie")?.split(";", 1)[0];
assert(cookie, "Admin session cookie missing");
const separator = cookie.indexOf("=");
const name = cookie.slice(0, separator);
const value = cookie.slice(separator + 1);

const profile = await mkdtemp(join(tmpdir(), "ek-sprint9-admin-browser-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9342",
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
      targets = await (await fetch("http://127.0.0.1:9342/json")).json();
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
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request.reject(message.error);
    else request.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  async function js(expression) {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }
  async function navigate(route, heading) {
    await send("Page.navigate", { url: `${baseUrl}${route}` });
    for (let attempt = 0; attempt < 120; attempt += 1) {
      if (await js(`location.pathname === ${JSON.stringify(route)} && document.querySelector('main h1')?.textContent.trim() === ${JSON.stringify(heading)}`)) return;
      await pause(100);
    }
    throw new Error(`Admin page did not load: ${route}`);
  }
  async function screenshot(name) {
    const result = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(join(profile, `${name}.png`), Buffer.from(result.data, "base64"));
  }

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  assert((await send("Network.setCookie", { url: baseUrl, name, value })).success);

  for (const width of [1440, 390]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width === 390 ? 844 : 1000,
      deviceScaleFactor: 1,
      mobile: width === 390,
    });
    await navigate("/admin/einstellungen/konfiguratoren", "Konfiguratoren");
    const settings = await js("({sections:[...document.querySelectorAll('main h2')].map(node=>node.textContent.trim()),fields:document.querySelectorAll('main input[type=number]').length,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,viewport:window.innerWidth})");
    assert.equal(settings.sections.length, 6);
    assert(settings.fields > 20);
    assert.equal(settings.overflow, false);
    assert.equal(settings.viewport, width);
    await screenshot(`admin-settings-${width}`);
    await js("[...document.querySelectorAll('main h2')].find(node=>node.textContent.includes('Photovoltaik'))?.scrollIntoView({behavior:'instant'})");
    await pause(150);
    await screenshot(`admin-pricing-${width}`);
    if (width === 1440 && process.env.SPRINT9_TEST_SETTINGS_SAVE === "1") {
      assert.equal(await js("(() => { const button=document.querySelector('main form button[type=submit]'); button?.click(); return !!button; })()"), true);
      for (let attempt = 0; attempt < 120; attempt += 1) {
        if (await js("location.pathname === '/admin/einstellungen/konfiguratoren' && new URLSearchParams(location.search).get('status') === 'success'")) break;
        await pause(100);
      }
      assert.equal(await js("new URLSearchParams(location.search).get('status')"), "success");
      await screenshot("admin-saved-1440");
    }

    await navigate("/admin/anfragen", "Anfragen");
    assert.equal(await js("document.documentElement.scrollWidth>document.documentElement.clientWidth"), false);
    if (process.env.SPRINT9_EXPECT_LEAD_FIXTURES === "1") {
      assert.equal(await js("document.querySelectorAll('main article').length"), 2);
      assert.equal(await js("document.body.innerText.includes('WB-00001')"), true);
      assert.equal(await js("document.body.innerText.includes('sprint9-unsupported-qa')"), false);
    }
    await screenshot(`admin-leads-${width}`);
    console.log(`PASS local Admin at ${width}px`);
  }
  console.log(`Screenshots: ${profile}`);
} finally {
  socket?.close();
  chrome.kill();
}
