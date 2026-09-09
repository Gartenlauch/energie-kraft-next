import fs from "node:fs";
import path from "node:path";

const port = process.argv[2] ?? "9228";
const mode = process.argv[3] ?? "desktop";
const outputName =
  process.argv[4] ??
  (mode === "mobile"
    ? "mobile-navigation-open.png"
    : mode === "desktop"
      ? "mega-menu-open.png"
      : "mobile-page.png");
const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
const page = targets.find((target) => target.type === "page");

if (!page) throw new Error("No Chrome page target found.");

const socket = new globalThis.WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});

function command(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await command("Runtime.enable");
if (mode.startsWith("mobile")) {
  await command("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await new Promise((resolve) => setTimeout(resolve, 300));
}
const evaluation = await command("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const button =
      ${JSON.stringify(mode)} === "mobile"
        ? document.querySelector('button[aria-controls="mobile-navigation"]')
        : ${JSON.stringify(mode)} === "desktop"
          ? [...document.querySelectorAll("button")].find((item) =>
              item.textContent.includes("Energielösungen"),
            )
          : null;
    button?.click();
    const viewportWidth = document.documentElement.clientWidth;
    const overflowElements = [...document.querySelectorAll("body *")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: typeof element.className === "string" ? element.className : "",
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          text: element.textContent.trim().slice(0, 60),
        };
      })
      .filter((element) => element.right > viewportWidth + 1 || element.left < -1)
      .slice(0, 12);
    return {
      innerWidth,
      clientWidth: viewportWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      menuButtonFound: Boolean(button),
      overflowElements,
    };
  })()`,
});

await new Promise((resolve) => setTimeout(resolve, 300));

const menuState = await command("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const selector =
      ${JSON.stringify(mode)} === "mobile"
        ? "#mobile-energy-links"
        : ${JSON.stringify(mode)} === "desktop"
          ? "#energy-mega-menu"
          : null;
    const menu = selector ? document.querySelector(selector) : null;
    const links = menu ? [...menu.querySelectorAll("a")].map((link) => link.textContent.trim()) : [];
    return {
      exists: Boolean(menu),
      visible: Boolean(menu && menu.getBoundingClientRect().height > 0),
      linkCount: links.length,
      links,
    };
  })()`,
});

const screenshot = await command("Page.captureScreenshot", { format: "png" });
const outputPath = path.join(process.env.TEMP, "energie-kraft-sprint8-audit", outputName);
fs.writeFileSync(outputPath, Buffer.from(screenshot.data, "base64"));

console.log(
  JSON.stringify(
    {
      layout: evaluation.result.value,
      menu: menuState.result.value,
      screenshot: outputPath,
    },
    null,
    2,
  ),
);

socket.close();
