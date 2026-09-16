import { beforeEach, describe, expect, it, vi } from "vitest";

const fakeStore = vi.hoisted(() => ({
  documents: new Map<string, Record<string, unknown>>(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/firebase/admin", () => {
  type Reference = { path: string };
  const snapshot = (reference: Reference) => {
    const value = fakeStore.documents.get(reference.path);
    return { exists: value !== undefined, data: () => value };
  };

  return {
    adminFirestore: {
      collection: (name: string) => ({
        doc: (id: string) => {
          const reference = { path: `${name}/${id}` };
          return { ...reference, get: async () => snapshot(reference) };
        },
      }),
      runTransaction: async <T>(callback: (transaction: {
        get: (reference: Reference) => Promise<ReturnType<typeof snapshot>>;
        create: (reference: Reference, value: Record<string, unknown>) => void;
        set: (reference: Reference, value: Record<string, unknown>) => void;
      }) => Promise<T>): Promise<T> => {
        const writes: Array<() => void> = [];
        const result = await callback({
          get: async (reference) => snapshot(reference),
          create: (reference, value) => {
            if (fakeStore.documents.has(reference.path)) throw new Error("Version already exists");
            writes.push(() => fakeStore.documents.set(reference.path, value));
          },
          set: (reference, value) => writes.push(() => fakeStore.documents.set(reference.path, value)),
        });
        writes.forEach((write) => write());
        return result;
      },
    },
  };
});

import { DEFAULT_CONFIGURATOR_SETTINGS } from "@/lib/configurator/settings-model";
import {
  getConfiguratorSettingsVersion,
  getCurrentConfiguratorSettings,
  saveConfiguratorSettings,
} from "@/lib/configurator/settings-repository";

describe("configurator settings repository", () => {
  beforeEach(() => fakeStore.documents.clear());

  it("uses code defaults when the current document is absent", async () => {
    expect(await getCurrentConfiguratorSettings()).toEqual(DEFAULT_CONFIGURATOR_SETTINGS);
    expect((await getConfiguratorSettingsVersion(0))?.version).toBe(0);
  });

  it("saves a current version and preserves each immutable version snapshot", async () => {
    const first = await saveConfiguratorSettings(DEFAULT_CONFIGURATOR_SETTINGS, "admin-1");
    expect(first.version).toBe(1);
    expect(await getConfiguratorSettingsVersion(1)).toEqual(first);

    const changed = structuredClone(first);
    changed.economics.gridElectricityPriceEuroPerKwh = 0.4;
    const second = await saveConfiguratorSettings(changed, "admin-1");

    expect(second.version).toBe(2);
    expect((await getCurrentConfiguratorSettings()).economics.gridElectricityPriceEuroPerKwh).toBe(0.4);
    expect((await getConfiguratorSettingsVersion(1))?.economics.gridElectricityPriceEuroPerKwh)
      .toBe(DEFAULT_CONFIGURATOR_SETTINGS.economics.gridElectricityPriceEuroPerKwh);
    expect(fakeStore.documents.has("configuratorSettingsVersions/2")).toBe(true);
  });

  it("rejects invalid tiers without writing current or version documents", async () => {
    const invalid = structuredClone(DEFAULT_CONFIGURATOR_SETTINGS);
    invalid.batteryStorage.pricing.tiers[1]!.from = 4;

    await expect(saveConfiguratorSettings(invalid, "admin-1")).rejects.toThrow();
    expect(fakeStore.documents.size).toBe(0);
  });

  it("rejects a stale admin edit before it can overwrite a newer version", async () => {
    await saveConfiguratorSettings(DEFAULT_CONFIGURATOR_SETTINGS, "admin-1");

    await expect(saveConfiguratorSettings(DEFAULT_CONFIGURATOR_SETTINGS, "admin-2"))
      .rejects.toThrow("zwischenzeitlich geändert");
    expect((await getCurrentConfiguratorSettings()).version).toBe(1);
    expect(fakeStore.documents.has("configuratorSettingsVersions/2")).toBe(false);
  });
});
