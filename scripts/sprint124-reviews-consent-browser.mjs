// Extends the Sprint 11.6c Chrome/CDP acceptance pattern. No forms or business data.
// A temporary, local-only page supplies labelled synthetic reviews through the real components.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const base = process.env.CONSENT_QA_BASE || "http://localhost:3026";
assert(
  ["localhost", "127.0.0.1"].includes(new URL(base).hostname),
  "Temporary fixture is local-only",
);
const fixtureDir = resolve("src/app/(site)/qa-sprint124-reviews");
const fixture = join(fixtureDir, "page.tsx");
const output = resolve("artifacts/sprint12-4-google-reviews-consent");
const profile = await mkdtemp(join(tmpdir(), "ek-reviews-consent-"));
const route = "/qa-sprint124-reviews";
const imageUrl = "https://lh3.googleusercontent.com/a/default-user=s40-c";
let chrome,
  ws,
  fixtureCreated = false,
  fixtureDirCreated = false;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const requests = [],
  failures = [],
  errors = [],
  report = [],
  imageResponses = [];
let phase = "first visit";
try {
  // Non-recursive creation deliberately refuses an existing route/user file.
  await mkdir(fixtureDir);
  fixtureDirCreated = true;
  await writeFile(
    fixture,
    `import { CustomerReviewsSection } from "@/components/marketing/customer-reviews-section";
export const metadata = { robots: { index: false, follow: false } };
export default function QAPage() { return <main id="main-content"><p>Lokale QA: synthetische Testbewertung, kein echtes Kundenfeedback.</p><CustomerReviewsSection
  reviews={[{id:"qa-only",provider:"google",author:"QA-Testautor",authorUrl:"https://maps.google.com/",authorImageUrl:${JSON.stringify(imageUrl)},text:"Synthetischer Rezensionstext ausschließlich für die lokale Consent-Prüfung.",rating:5,publishedAt:"2026-10-01T12:00:00Z",sourceUrl:"https://maps.google.com/?q=qa-only"}]}
  summaries={[{provider:"google",averageRating:5,totalReviews:1,sourceUrl:"https://maps.google.com/",writeReviewUrl:"https://maps.google.com/?q=qa-only",attributions:[{provider:"Google Maps",providerUri:"https://maps.google.com/"}]}]}
/></main>; }`,
    { flag: "wx" },
  );
  fixtureCreated = true;
  chrome = spawn(
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
  let port;
  for (let i = 0; i < 60; i++) {
    try {
      port = Number((await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]);
      break;
    } catch {
      await pause(250);
    }
  }
  assert(port, "Chrome did not start");
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  ws = new WebSocket(tabs.find((tab) => tab.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  const requestPhases = new Map();
  ws.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request.reject(message.error);
      else request.resolve(message.result);
    }
    if (message.method === "Network.requestWillBeSent") {
      requestPhases.set(message.params.requestId, phase);
      requests.push({ phase, url: message.params.request.url });
    }
    if (message.method === "Network.loadingFailed")
      failures.push({ phase, error: message.params.errorText });
    if (message.method === "Network.responseReceived" && message.params.response.url === imageUrl)
      imageResponses.push({
        phase: requestPhases.get(message.params.requestId),
        status: message.params.response.status,
      });
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
  async function until(expression, label) {
    for (let i = 0; i < 200; i++) {
      if (await js(expression)) return;
      await pause(100);
    }
    throw Error(
      `Timeout: ${label}; ${JSON.stringify(await js("({url:location.href,text:document.body.innerText.slice(-1500)})"))}`,
    );
  }
  async function click(selector) {
    await js(`document.querySelector(${JSON.stringify(selector)}).click()`);
    await pause(100);
  }
  const placeholder =
    '!!document.querySelector("button[aria-describedby=google-reviews-consent-description]")';
  const images =
    'document.querySelectorAll("section[aria-labelledby=customer-reviews-heading] img[src^=https]").length';
  const record = () => js('JSON.parse(localStorage.getItem("ek_consent"))');
  const external = (from = 0) =>
    requests.slice(from).filter(({ url }) => {
      const host = new URL(url).hostname;
      return /(^|\.)(googleusercontent\.com|googleapis\.com|gstatic\.com|google\.com)$/.test(host);
    });
  async function blocked(label) {
    await until(placeholder, label);
    await pause(200);
    assert.equal(await js(images), 0, label);
    assert.equal(external(checkpoint).length, 0, `${label}: no new external Google requests`);
    report.push(label);
  }
  async function preferences() {
    await js(
      '[...document.querySelectorAll("footer button")].find(b=>b.textContent.includes("Cookie-Einstellungen")).click()',
    );
    await until('document.documentElement.classList.contains("show--preferences")', "preferences");
  }
  async function visible(label) {
    await until(`${images} === 1`, label);
    await js('document.getElementById("customer-reviews-heading").scrollIntoView()');
    await until('!!document.querySelector("blockquote")', label);
    assert(await js('document.querySelector("blockquote").textContent.includes("Synthetischer")'));
    assert(
      await js(
        '[...document.querySelectorAll("section[aria-labelledby=customer-reviews-heading] a")].some(a=>a.textContent.includes("QA-Testautor"))',
      ),
    );
    assert(await js('!!document.querySelector("img[alt=Google]")'));
    report.push(label);
  }
  async function navigate(path) {
    await send("Page.navigate", { url: base + path });
    await until(
      `location.pathname === ${JSON.stringify(path)} && document.readyState === "complete" && !!window.dataLayer?.length`,
      "navigation",
    );
  }
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  let checkpoint = requests.length;
  await navigate(route);
  await until('document.documentElement.classList.contains("show--consent")', "initial banner");
  await blocked("First visit: placeholder, no external Google requests");
  const html = await (await fetch(base + route)).text();
  assert(!html.includes(`<img src="${imageUrl}"`), "SSR contains no external author image element");
  assert(
    !html.includes(`rel="preload" as="image" href="${imageUrl}"`),
    "SSR contains no author preload",
  );

  phase = "accept all";
  await click('.cm__btn[data-role="all"]');
  await visible("Accept all: full review and attribution without another click");
  await until(
    `performance.getEntriesByType("resource").some(e=>e.name===${JSON.stringify(imageUrl)})`,
    "author request after consent",
  );
  assert(
    external().some(({ url }) => url === imageUrl),
    "External author request observed after consent",
  );

  phase = "revoke";
  await preferences();
  checkpoint = requests.length;
  await click('.pm__btn[data-role="necessary"]');
  await blocked("Revoke: images unmounted, no new Google requests");
  assert.deepEqual((await record()).categories, ["necessary"]);

  phase = "placeholder keyboard activation";
  // CookieConsent restores focus after its closing transition.
  await pause(400);
  await js(
    'document.querySelector("button[aria-describedby=google-reviews-consent-description]").focus()',
  );
  assert(
    await js(
      'document.activeElement.getAttribute("aria-describedby") === "google-reviews-consent-description"',
    ),
    "Activation button focused",
  );
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13,
    text: "\r",
    unmodifiedText: "\r",
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13,
  });
  await visible("Keyboard activation: only reviews enabled and full content visible");
  assert.deepEqual((await record()).categories, ["necessary", "googleReviews"]);
  assert.equal(await js("document.activeElement.id"), "customer-reviews-heading");

  phase = "reload accepted";
  await send("Page.reload");
  await until(
    'document.readyState === "complete" && !!window.dataLayer?.length',
    "reload accepted",
  );
  await visible("Reload: saved review consent restores content automatically");
  phase = "navigate accepted";
  await navigate("/impressum");
  await navigate(route);
  await visible("Navigation: saved review consent remains effective");

  phase = "reject all";
  await preferences();
  checkpoint = requests.length;
  await click('.pm__btn[data-role="necessary"]');
  await blocked("Reject all: placeholder restored");
  phase = "individual review consent";
  await preferences();
  const toggles = await js(
    '[...document.querySelectorAll("#cc-main input[type=checkbox]")].map(e=>({id:e.id,checked:e.checked,disabled:e.disabled}))',
  );
  assert.equal(toggles.length, 5);
  await js('[...document.querySelectorAll("#cc-main input[type=checkbox]")][4].click()');
  await click('.pm__btn[data-role="save"]');
  assert.deepEqual((await record()).categories, ["necessary", "googleReviews"]);
  await visible("Individual review consent: statistics and marketing stay off");

  phase = "mobile";
  await preferences();
  await click('.pm__btn[data-role="necessary"]');
  await pause(400);
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await js('document.getElementById("customer-reviews-heading").scrollIntoView()');
  assert(
    await js("document.documentElement.scrollWidth <= innerWidth"),
    "No horizontal overflow on mobile",
  );
  await js('document.querySelector("section[aria-labelledby=customer-reviews-heading] a").focus()');
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
  const button = await js(
    '(()=>{const b=document.querySelector("button[aria-describedby=google-reviews-consent-description]");const r=b.getBoundingClientRect(),s=getComputedStyle(b);return {height:r.height,width:r.width,outline:s.outlineStyle,focused:document.activeElement===b};})()',
  );
  assert(
    button.height >= 44 && button.width >= 44 && button.focused && button.outline !== "none",
    `Touch target and focus indicator: ${JSON.stringify(button)}`,
  );
  await mkdir(output, { recursive: true });
  const screenshot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(join(output, "mobile-placeholder.png"), Buffer.from(screenshot.data, "base64"));
  report.push("Mobile 390px: no overflow, keyboard focus and 44px touch target");
  phase = "reload rejected";
  checkpoint = requests.length;
  await send("Page.reload");
  await until(
    'document.readyState === "complete" && !!window.dataLayer?.length',
    "reload rejected",
  );
  await blocked("Reload after rejection: no Google requests");

  // Expiry and cross-tab invalidation use the real ConsentManager lifecycle.
  phase = "reactivation before expiry";
  await js(
    'document.querySelector("button[aria-describedby=google-reviews-consent-description]").click()',
  );
  await visible("Reactivation before expiry check");
  phase = "expiry";
  checkpoint = requests.length;
  await js(
    '(()=>{const c=JSON.parse(localStorage.getItem("ek_consent"));c.expirationTime=Date.now()-1;localStorage.setItem("ek_consent",JSON.stringify(c));window.dispatchEvent(new Event("focus"));})()',
  );
  await blocked("Expired consent: immediately blocked on manager refresh");
  assert.deepEqual(errors, [], "No browser runtime exceptions");
  const trackingRequests = requests.filter(({ url }) =>
    /google-analytics\.com|googletagmanager\.com|doubleclick\.net|googleadservices\.com/.test(url),
  );
  assert.deepEqual(trackingRequests, [], "GA4/Ads remain off");
  const result = {
    base,
    fixture: "Synthetic local review; real components and real browser network events",
    report,
    googleRequests: external(),
    imageResponses,
    trackingRequests,
    failures,
    runtimeErrors: errors,
    limitation:
      "Live Places data unavailable locally; review.energie-kraft.de was not deployed or validated with this change.",
  };
  await writeFile(join(output, "qa.json"), JSON.stringify(result, null, 2));
  console.log(
    JSON.stringify(
      { base, report, googleRequestCount: external().length, runtimeErrors: errors },
      null,
      2,
    ),
  );
} finally {
  ws?.close();
  chrome?.kill();
  if (fixtureCreated) await unlink(fixture);
  if (fixtureDirCreated) await rmdir(fixtureDir);
}
