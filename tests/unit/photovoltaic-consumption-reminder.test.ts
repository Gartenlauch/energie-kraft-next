// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EnergySolutionsStep } from "@/components/configurator/photovoltaic/energy-solutions-step";
import { PhotovoltaicWizard } from "@/components/configurator/photovoltaic/photovoltaic-wizard";
import { ConfiguratorProvider } from "@/lib/configurator/configurator-context";
import { createInitialConfiguratorState, normalizeConfiguratorState } from "@/lib/configurator/state";
import { readConfiguratorState, writeConfiguratorState } from "@/lib/configurator/storage";
import type { ConfiguratorInterests, ConfiguratorState } from "@/types/configurator";

vi.mock("@/lib/leads/submit-configurator-lead", () => ({ submitConfiguratorLead: vi.fn() }));
vi.mock("@/config/site", () => ({ siteConfig: { canonicalBaseUrl: "https://example.test" } }));
vi.mock("@/components/configurator/photovoltaic/photovoltaic-result", () => ({ PhotovoltaicResult: () => null }));

const interests: ConfiguratorInterests = {
  photovoltaic: true, batteryStorage: true, heatPump: false, climate: false, wallbox: false,
};

describe("PV additional-consumption reminder", () => {
  it.each([
    [{}, null],
    [{ heatPump: true }, "Wärmepumpe"],
    [{ climate: true }, "Klimaanlage"],
    [{ wallbox: true }, "Wallbox"],
    [{ heatPump: true, climate: true }, "Wärmepumpe und Klimaanlage"],
    [{ heatPump: true, wallbox: true }, "Wärmepumpe und Wallbox"],
    [{ climate: true, wallbox: true }, "Klimaanlage und Wallbox"],
    [{ heatPump: true, climate: true, wallbox: true }, "Wärmepumpe, Klimaanlage und Wallbox"],
  ] satisfies Array<[Partial<ConfiguratorInterests>, string | null]>)(
    "uses the current selection %j", (selected, label) => {
      const html = renderToStaticMarkup(createElement(EnergySolutionsStep, {
        interests: { ...interests, ...selected },
        onToggle: vi.fn(), onAdjustConsumption: vi.fn(), onAcknowledgeConsumption: vi.fn(),
      }));
      if (label === null) {
        expect(html).not.toContain("Haben Sie den zusätzlichen Stromverbrauch");
      } else {
        expect(html).toContain(`Haben Sie den zusätzlichen Stromverbrauch für Ihre ${label} bereits in Schritt 9 berücksichtigt?`);
        expect(html).toContain('aria-live="polite"');
      }
    },
  );
});

describe("PV reminder wizard interaction and persistence", () => {
  let root: Root;
  let container: HTMLDivElement;
  let initial: ConfiguratorState;
  const renderWizard = () => root.render(createElement(ConfiguratorProvider,
    { settings: initial.settings }, createElement(PhotovoltaicWizard),
  ));
  const click = (label: string) => {
    const button = Array.from(container.querySelectorAll("button"))
      .find((item) => item.textContent?.trim() === label || item.firstElementChild?.textContent === label);
    expect(button, label).toBeDefined();
    act(() => button!.click());
  };
  const saved = () => readConfiguratorState(window.sessionStorage)!;
  const input = () => container.querySelector<HTMLInputElement>("#future-increase-percent")!;
  const enterIncrease = (value: string) => {
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input(), value);
      input().dispatchEvent(new Event("input", { bubbles: true }));
    });
  };
  const summary = (label: string) => Array.from(container.querySelectorAll("dt"))
    .find((item) => item.textContent?.trim() === label)?.nextElementSibling?.textContent?.trim();

  beforeEach(async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    window.sessionStorage.clear();
    initial = normalizeConfiguratorState({
      ...createInitialConfiguratorState(), activeConfigurator: "photovoltaic",
      household: { persons: 3, annualConsumptionKwh: 4000, futureIncreasePercent: 30 },
      building: { ownership: "owner", type: "detached_house" },
      roof: { pitch: 30, material: "roof_tile", orientation: "south", renovationPeriod: "after_1990" },
      interests: { ...interests, heatPump: true, climate: true, wallbox: true },
      notes: { hasNotes: true, text: "Eingaben erhalten" },
    });
    expect(writeConfiguratorState(window.sessionStorage, initial)).toBe(true);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => renderWizard());
    for (let step = 0; step < 9; step += 1) click("Weiter");
    expect(container.querySelector("#photovoltaic-energy-solutions-heading")).not.toBeNull();
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("allows deleting every digit after a preset and calculates with zero until re-entry", () => {
    click("Verbrauch anpassen");
    click("Deutliche Erhöhung");
    expect(input().value).toBe("25");
    expect(summary("Zusätzlicher Verbrauch")).toBe("1.000 kWh");
    input().focus();
    enterIncrease("2");
    expect(input().value).toBe("2");
    expect(summary("Zusätzlicher Verbrauch")).toBe("80 kWh");
    enterIncrease("");
    expect(input().value).toBe("");
    expect(document.activeElement).toBe(input());
    expect(summary("Zusätzlicher Verbrauch")).toBe("0 kWh");
    expect(summary("Künftig berücksichtigt")).toBe("4.000 kWh");
    expect(input().getAttribute("aria-invalid")).toBe("false");
    expect(container.querySelectorAll('button[aria-pressed="true"]')).toHaveLength(0);
    expect(saved().household.futureIncreasePercent).toBe(0);
    enterIncrease("37");
    expect(input().value).toBe("37");
    expect(summary("Zusätzlicher Verbrauch")).toBe("1.480 kWh");
    expect(saved().household.projectedConsumptionKwh).toBe(5480);
    click("Weiter");
    click("Verbrauch anpassen");
    expect(input().value).toBe("37");
  });

  it("retains raw input, validation, and all presets including zero after clearing", () => {
    click("Verbrauch anpassen");
    enterIncrease("037");
    expect(input().value).toBe("037");
    expect(saved().household.futureIncreasePercent).toBe(37);
    enterIncrease("201");
    expect(input().value).toBe("201");
    expect(input().getAttribute("aria-invalid")).toBe("true");
    const next = Array.from(container.querySelectorAll("button"))
      .find((button) => button.textContent?.trim() === "Weiter");
    expect(next?.disabled).toBe(true);
    enterIncrease("");
    for (const [title, value] of [
      ["Keine Erhöhung", 0], ["Leichte Erhöhung", 10],
      ["Deutliche Erhöhung", 25], ["Starke Erhöhung", 50],
    ] as const) {
      click(title);
      expect(input().value).toBe(String(value));
      expect(input().getAttribute("aria-invalid")).toBe("false");
      expect(container.querySelectorAll('button[aria-pressed="true"]')).toHaveLength(1);
      expect(saved().household.futureIncreasePercent).toBe(value);
      enterIncrease("");
      expect(input().value).toBe("");
      expect(saved().household.projectedConsumptionKwh).toBe(4000);
    }
  });

  it("returns to step 9 and preserves every input and selected solution", () => {
    const before = saved();
    click("Verbrauch anpassen");
    expect(container.querySelector("#photovoltaic-future-consumption-heading")).not.toBeNull();
    expect(container.querySelector<HTMLInputElement>("#future-increase-percent")!.value).toBe("30");
    expect(saved()).toEqual(before);
    click("Starke Erhöhung");
    click("Weiter");
    expect(container.querySelector("#photovoltaic-energy-solutions-heading")).not.toBeNull();
    expect(saved().household).toEqual({ ...before.household, futureIncreasePercent: 50, projectedConsumptionKwh: 6000 });
    for (const key of ["building", "roof", "interests", "notes", "heatPump", "climate", "wallbox", "batteryStorage"] as const) {
      expect(saved()[key]).toEqual(before[key]);
    }
    expect(container.querySelectorAll('button[aria-pressed="true"]')).toHaveLength(4);
    expect(saved().interests).toEqual(initial.interests);
  });

  it("acknowledges persistently, stays closed on rerender, and warns for a newly selected consumer", () => {
    click("Klimaanlage");
    click("Bereits berücksichtigt");
    expect(container.querySelector("aside")).toBeNull();
    expect(saved().acknowledgedConsumptionSolutions).toEqual(["heatPump", "wallbox"]);
    expect(saved().household).toEqual(initial.household);
    act(() => renderWizard());
    expect(container.querySelector("aside")).toBeNull();
    click("Zurück");
    click("Weiter");
    expect(container.querySelector("aside")).toBeNull();
    click("Klimaanlage");
    expect(container.querySelector("aside")?.textContent).toContain("Wärmepumpe, Klimaanlage und Wallbox");
    click("Bereits berücksichtigt");
    expect(saved().acknowledgedConsumptionSolutions).toEqual(["heatPump", "climate", "wallbox"]);
  });
});
