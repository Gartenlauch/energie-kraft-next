// @vitest-environment jsdom
import { act, createElement, useEffect, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConfiguratorProvider, useConfigurator } from "@/lib/configurator/configurator-context";
import { DEFAULT_CONFIGURATOR_SETTINGS } from "@/lib/configurator/settings-model";
import { readConfiguratorState, writeConfiguratorState } from "@/lib/configurator/storage";
import { ConfiguratorSubmissionGate } from "@/components/configurator/configurator-submission-gate";
import { ConfiguratorHouseNavigation } from "@/components/configurator/configurator-house-navigation";
import { BatteryStorageEntry } from "@/components/configurator/battery-storage/battery-storage-entry";
import { HeatPumpEntry } from "@/components/configurator/heat-pump/heat-pump-entry";
import { configuratorProductList } from "@/content/configurators";
import { submitConfiguratorLead } from "@/lib/leads/submit-configurator-lead";

vi.mock("@/lib/leads/submit-configurator-lead", () => ({ submitConfiguratorLead: vi.fn() }));
vi.mock("@/config/site", () => ({ siteConfig: { canonicalBaseUrl: "https://example.test" } }));
vi.mock("next/link", () => ({ default: ({ href, onClick, children, ...props }: ComponentProps<"a">) =>
  createElement("a", { ...props, href, onClick: (event) => { event.preventDefault(); onClick?.(event); } }, children) }));

let current: ReturnType<typeof useConfigurator>;
function Probe() {
  const context = useConfigurator();
  useEffect(() => { current = context; }, [context]);
  return null;
}
let root: Root;
let container: HTMLDivElement;
async function route(product: "battery_storage" | "heat_pump") {
  await act(async () => root.render(
    createElement(ConfiguratorProvider, { settings: DEFAULT_CONFIGURATOR_SETTINGS },
      createElement(Probe, { key: "probe" }),
      createElement(ConfiguratorSubmissionGate, { key: "gate" },
        createElement(product === "battery_storage" ? BatteryStorageEntry : HeatPumpEntry),
      ),
    ),
  ));
}
async function click(label: string) {
  const element = Array.from(container.querySelectorAll<HTMLElement>("button, a"))
    .find((item) => item.textContent?.trim() === label);
  expect(element, label).toBeDefined();
  await act(async () => element!.click());
}
async function overview(extend = false) {
  await act(async () => root.render(createElement(ConfiguratorHouseNavigation, { products: configuratorProductList })));
  if (extend) await act(async () => container.querySelectorAll<HTMLInputElement>('input[name="configurator-start"]')[1]!.click());
  await act(async () => container.querySelector<HTMLAnchorElement>('a[href="/konfigurator/waermepumpe"]')!.click());
  await route("heat_pump");
}
async function complete(product: "battery_storage" | "heat_pump") {
  // Same technical inputs as the existing standalone/result fixtures; real wizard navigation follows.
  act(() => current.dispatch(product === "battery_storage" ? {
    type: "UPDATE_BATTERY_STORAGE", payload: {
      annualConsumptionKwh: 5000, pvPowerKwp: 6, consumptionPattern: "mixed", backupPreference: "none", goal: "balanced",
    },
  } : {
    type: "UPDATE_HEAT_PUMP", payload: {
      existingHeatingSystem: "gas", heatedAreaM2: 160, specificSpaceHeatingDemandKwhPerM2Year: 90,
      occupancyPersons: 4, requiredFlowTemperatureC: 50, annualPerformanceFactor: 3.5,
    },
  }));
  for (let index = 0; index < (product === "battery_storage" ? 3 : 5); index++) await click("Weiter");
  await click("Ergebnis anzeigen");
}
async function contactAndReview() {
  await click("Persönliche Projektanalyse erhalten");
  expect(container.querySelector<HTMLInputElement>("#configurator-first-name")!.value).toBe("");
  act(() => container.querySelector<HTMLInputElement>('input[name="installationAtResidence"][value="yes"]')!.click());
  for (const [id, value] of Object.entries({
    "first-name": "Test", "last-name": "Person", email: "test@example.com",
    street: "Teststraße 1", "postal-code": "89073", city: "Ulm",
  })) {
    act(() => {
      const input = container.querySelector<HTMLInputElement>(`#configurator-${id}`)!;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
  act(() => container.querySelector<HTMLInputElement>("#configurator-privacy")!.click());
  await click("Weiter zur Anfrage");
  expect(container.querySelector("#configurator-submit-heading")).not.toBeNull();
}
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: vi.fn() });
  window.sessionStorage.clear();
  vi.mocked(submitConfiguratorLead).mockReset().mockResolvedValue({ ok: true, leadId: "mock-lead", publicReference: "BS-TEST-00001", reportStatus: "generated", customerMailStatus: "accepted" });
  container = document.createElement("div"); document.body.append(container); root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount()); container.remove(); window.sessionStorage.clear(); vi.restoreAllMocks(); vi.unstubAllGlobals();
});

describe("configurator project restart", () => {
  it.each(["Neue Konfiguration starten", "Zur Konfigurator-Übersicht"])(
    "starts a clean heat-pump request after storage submission via %s", async (back) => {
      await route("battery_storage"); await complete("battery_storage"); await contactAndReview();
      await click("Energieprojekt absenden");
      const first = vi.mocked(submitConfiguratorLead).mock.calls[0]![0];
      expect(first.products).toEqual(["battery_storage"]);
      await click(back);
      expect(readConfiguratorState(window.sessionStorage)).toBeNull();
      await overview();
      expect(current.state.journey.entryPoint).toBe("heat_pump");
      expect(current.state.batteryStorage).toEqual({});
      expect(current.state.interests.batteryStorage).toBe(false);
      await complete("heat_pump"); await contactAndReview();
      expect(container.textContent).toContain("Wärmepumpen");
      expect(container.textContent).not.toContain("Stromspeicher-Empfehlung");
      expect(current.state.journey.selectedProducts).toEqual(["heat_pump"]);
      expect(current.state.submission.id).not.toBe(first.submissionId);
      await click("Energieprojekt absenden");
      const next = vi.mocked(submitConfiguratorLead).mock.calls[1]![0];
      expect(next.products).toEqual(["heat_pump"]);
      expect(next.configurators.map((item) => item.type)).toEqual(next.products);
    },
  );
  it.each([false, true])("handles an abandoned request with extend=%s without hydration overwriting the route", async (extend) => {
    await route("battery_storage"); await complete("battery_storage"); await contactAndReview();
    const previousId = current.state.submission.id;
    await overview(extend);
    expect(current.state.activeConfigurator).toBe("heat_pump");
    expect(current.state.journey.entryPoint).toBe(extend ? "battery_storage" : "heat_pump");
    expect(Boolean(current.state.results.batteryStorage)).toBe(extend);
    expect(current.state.submission.id).toBe(extend ? previousId : undefined);
    await complete("heat_pump"); await contactAndReview();
    expect(container.textContent?.includes("Stromspeicher-Empfehlung")).toBe(extend);
    await click("Energieprojekt absenden");
    const input = vi.mocked(submitConfiguratorLead).mock.calls[0]![0];
    expect(input.products).toEqual(extend ? ["battery_storage", "heat_pump"] : ["heat_pump"]);
    expect(input.configurators.map((item) => item.type)).toEqual(input.products);
  });
  it("does not restore a previously submitted project on a fresh product entry", async () => {
    await route("battery_storage"); await complete("battery_storage"); await contactAndReview();
    await click("Energieprojekt absenden");
    const submitted = current.state;
    await act(async () => root.render(null));
    writeConfiguratorState(window.sessionStorage, submitted);
    await route("heat_pump");
    expect(current.state.activeConfigurator).toBe("heat_pump");
    expect(current.state.results).toEqual({});
    expect(current.state.submission).toEqual({ status: "idle" });
  });
});
