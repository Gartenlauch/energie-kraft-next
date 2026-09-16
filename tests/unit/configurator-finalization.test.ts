import { describe, expect, it } from "vitest";

import {
  DEFAULT_CONFIGURATOR_SETTINGS,
  buildConfiguratorPublicReference,
  calculateTieredCostCorridor,
  configuratorSettingsSchema,
  createNextConfiguratorSettingsVersion,
  nextConfiguratorReferenceSequence,
  resolveConfiguratorSettingsOrDefaults,
  resolveTierPrice,
} from "@/lib/configurator/settings-model";
import { normalizeAdminLeadDocument } from "@/lib/leads/normalize-admin-lead";
import { createInitialConfiguratorState } from "@/lib/configurator/state";
import { configuratorStateSchema } from "@/lib/validation/configurator/state";

describe("configurator public reference", () => {
  it("uses canonical product order and minimum five digit padding", () => {
    expect(buildConfiguratorPublicReference(["photovoltaic"], 1)).toBe("PV-00001");
    expect(buildConfiguratorPublicReference(["battery_storage"], 2)).toBe("BS-00002");
    expect(
      buildConfiguratorPublicReference(
        ["wallbox", "climate", "photovoltaic", "heat_pump", "battery_storage"],
        5,
      ),
    ).toBe("PV-BS-WP-KA-WB-00005");
    expect(buildConfiguratorPublicReference(["photovoltaic"], 100_000)).toBe("PV-100000");
  });

  it("increments monotonically without rolling over after five digits", () => {
    expect(nextConfiguratorReferenceSequence(undefined)).toBe(1);
    expect(nextConfiguratorReferenceSequence(1)).toBe(2);
    expect(nextConfiguratorReferenceSequence(99_999)).toBe(100_000);
    expect(buildConfiguratorPublicReference(["photovoltaic"], nextConfiguratorReferenceSequence(99_999)))
      .toBe("PV-100000");
  });
});

describe("approved tier pricing", () => {
  it.each([
    [4, 1_200], [6.9, 1_200], [7, 1_100], [9.9, 1_100], [10, 1_000],
    [14.9, 1_000], [15, 900], [19.9, 900], [20, 800], [29.9, 800],
    [30, 750], [50, 750],
  ])("prices %s kWp at %s €/kWp", (size, expected) => {
    expect(resolveTierPrice(size, DEFAULT_CONFIGURATOR_SETTINGS.photovoltaic.pricing)).toEqual({
      pricingMode: "modeled",
      unitPriceEuro: expected,
    });
  });

  it("requires an individual PV quote outside the modeled range", () => {
    expect(resolveTierPrice(50.1, DEFAULT_CONFIGURATOR_SETTINGS.photovoltaic.pricing).pricingMode)
      .toBe("individual_quote_required");
  });

  it.each([
    [4, 1_000], [6.9, 1_000], [7, 800], [15.9, 800], [16, 700], [21.9, 700],
    [22, 600], [32.9, 600], [33, 500], [54, 500],
  ])("prices %s kWh at %s €/kWh", (size, expected) => {
    expect(resolveTierPrice(size, DEFAULT_CONFIGURATOR_SETTINGS.batteryStorage.pricing).unitPriceEuro)
      .toBe(expected);
  });

  it("does not emit a fake zero corridor for unmodeled storage", () => {
    expect(calculateTieredCostCorridor({
      sizeMin: 54.1,
      sizeMax: 55,
      pricing: DEFAULT_CONFIGURATOR_SETTINGS.batteryStorage.pricing,
      costUncertaintyPercent: 15,
    })).toEqual({
      pricingMode: "individual_quote_required",
      estimatedTotalCostEuro: null,
      estimatedMinimumCostEuro: null,
      estimatedMaximumCostEuro: null,
    });
  });
});

describe("configurator settings validation", () => {
  it("uses typed version-zero defaults when no persisted current document exists", () => {
    expect(resolveConfiguratorSettingsOrDefaults(undefined)).toEqual(DEFAULT_CONFIGURATOR_SETTINGS);
    expect(resolveConfiguratorSettingsOrDefaults(undefined)).not.toBe(DEFAULT_CONFIGURATOR_SETTINGS);
  });
  it("accepts the code defaults", () => {
    expect(configuratorSettingsSchema.parse(DEFAULT_CONFIGURATOR_SETTINGS).version).toBe(0);
  });

  it("rejects duplicate or descending pricing thresholds", () => {
    const invalid = structuredClone(DEFAULT_CONFIGURATOR_SETTINGS);
    invalid.photovoltaic.pricing.tiers[1]!.from = 4;
    expect(configuratorSettingsSchema.safeParse(invalid).success).toBe(false);
  });

  it("creates a new immutable-version payload without mutating the active snapshot", () => {
    const current = structuredClone(DEFAULT_CONFIGURATOR_SETTINGS);
    current.version = 7;
    const next = createNextConfiguratorSettingsVersion(current, current.version);
    expect(next.version).toBe(8);
    expect(current.version).toBe(7);
  });
});

describe("admin lead compatibility", () => {
  const base = {
    type: "configurator",
    products: ["photovoltaic"],
    configurators: [{}],
    journey: { entryPoint: "photovoltaic" },
  };

  it("keeps contact leads and supported configurator schemas", () => {
    expect(normalizeAdminLeadDocument("contact", { type: "contact" })?.type).toBe("contact");
    expect(normalizeAdminLeadDocument("v3", { ...base, meta: { schemaVersion: 3 } })?.id).toBe("v3");
    expect(normalizeAdminLeadDocument("v4", { ...base, meta: { schemaVersion: 4 } })?.id).toBe("v4");
  });

  it("skips unsupported malformed configurator records without throwing", () => {
    expect(normalizeAdminLeadDocument("bad", { ...base, meta: { schemaVersion: 99 } })).toBeNull();
    expect(normalizeAdminLeadDocument("bad", { type: "configurator" })).toBeNull();
  });
});

describe("photovoltaic notes limit", () => {
  it("accepts 1,000 characters and rejects 1,001", () => {
    const state = createInitialConfiguratorState();
    expect(configuratorStateSchema.safeParse({ ...state, notes: { hasNotes: true, text: "a".repeat(1_000) } }).success).toBe(true);
    expect(configuratorStateSchema.safeParse({ ...state, notes: { hasNotes: true, text: "a".repeat(1_001) } }).success).toBe(false);
  });
});
