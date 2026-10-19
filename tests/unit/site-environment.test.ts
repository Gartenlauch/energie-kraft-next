import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FIREBASE_EMULATOR_PROJECT_ID, FIREBASE_PRODUCTION_PROJECT_ID } from "@/config/firebase";

vi.mock("server-only", () => ({}));
vi.mock("next/font/local", () => ({ default: () => ({ variable: "test-font" }) }));

const publicFixture = {
  NEXT_PUBLIC_SITE_ENV: "local",
  NEXT_PUBLIC_CANONICAL_BASE_URL: "http://localhost:3000/",
  NEXT_PUBLIC_FIREBASE_API_KEY: "test-api-key",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "localhost",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: FIREBASE_EMULATOR_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "test-bucket",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "test-sender",
  NEXT_PUBLIC_FIREBASE_APP_ID: "test-app",
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "",
  NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "true",
};

function setPublicEnv(overrides: Partial<typeof publicFixture> = {}) {
  for (const [key, value] of Object.entries({ ...publicFixture, ...overrides })) {
    vi.stubEnv(key, value);
  }
}

beforeEach(() => {
  vi.resetModules();
  setPublicEnv();
  for (const key of [
    "FIRESTORE_EMULATOR_HOST",
    "FIREBASE_AUTH_EMULATOR_HOST",
    "FIREBASE_STORAGE_EMULATOR_HOST",
  ]) {
    vi.stubEnv(key, undefined);
  }
});

afterEach(() => vi.unstubAllEnvs());

describe("Site identity and validated environment boundary", () => {
  it("loads public identity without requiring or exposing environment values", async () => {
    for (const key of Object.keys(publicFixture)) vi.stubEnv(key, undefined);
    const { siteIdentity } = await import("@/config/site-identity");
    expect(siteIdentity.name).toBe("Energie-Kraft Süd");
    expect(siteIdentity.contact.phoneHref).toBe("tel:+498654771610");
    expect(siteIdentity.contact.phoneDisplay).toBe("+49 (0) 8654 77161-0");
    expect(siteIdentity).not.toHaveProperty("canonicalBaseUrl");
    await expect(import("@/config/site")).rejects.toThrow(
      "Ungültige öffentliche Environment-Konfiguration",
    );
  });

  it.each([
    ["local", FIREBASE_EMULATOR_PROJECT_ID, "true", "http://localhost:3000/"],
    ["ci", "test-ci-project", "false", "https://review.example.org/"],
    ["production", FIREBASE_PRODUCTION_PROJECT_ID, "false", "https://www.energie-kraft.de/"],
  ])(
    "preserves %s validation, flags and canonical normalization",
    async (env, project, emulators, url) => {
      setPublicEnv({
        NEXT_PUBLIC_SITE_ENV: env,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: project,
        NEXT_PUBLIC_USE_FIREBASE_EMULATORS: emulators,
        NEXT_PUBLIC_CANONICAL_BASE_URL: url,
      });
      const { publicEnv } = await import("@/config/env/public");
      const { siteConfig } = await import("@/config/site");
      const { siteIdentity } = await import("@/config/site-identity");
      expect(publicEnv.isLocal).toBe(env === "local");
      expect(publicEnv.isCi).toBe(env === "ci");
      expect(publicEnv.isProduction).toBe(env === "production");
      expect(publicEnv.useFirebaseEmulators).toBe(emulators === "true");
      expect(publicEnv.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID).toBeUndefined();
      expect(siteConfig).toEqual({ ...siteIdentity, canonicalBaseUrl: url.replace(/\/$/, "") });
      await expect(import("@/app/layout")).resolves.toHaveProperty("default");
    },
  );

  it.each([
    { NEXT_PUBLIC_SITE_ENV: "invalid" },
    { NEXT_PUBLIC_CANONICAL_BASE_URL: "invalid" },
    { NEXT_PUBLIC_FIREBASE_API_KEY: "" },
    { NEXT_PUBLIC_FIREBASE_PROJECT_ID: FIREBASE_PRODUCTION_PROJECT_ID },
    { NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "false" },
    {
      NEXT_PUBLIC_SITE_ENV: "ci",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: FIREBASE_EMULATOR_PROJECT_ID,
      NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "false",
    },
    {
      NEXT_PUBLIC_SITE_ENV: "ci",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: FIREBASE_PRODUCTION_PROJECT_ID,
      NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "false",
    },
    { NEXT_PUBLIC_SITE_ENV: "ci", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "test-ci-project" },
    {
      NEXT_PUBLIC_SITE_ENV: "production",
      NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "false",
      NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de",
    },
    {
      NEXT_PUBLIC_SITE_ENV: "production",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: FIREBASE_PRODUCTION_PROJECT_ID,
      NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "false",
    },
  ])("retains the existing public configuration error for %j", async (overrides) => {
    setPublicEnv(overrides);
    await expect(import("@/config/site")).rejects.toThrow(
      "Ungültige öffentliche Environment-Konfiguration",
    );
    await expect(import("@/app/layout")).rejects.toThrow(
      "Ungültige öffentliche Environment-Konfiguration",
    );
  });

  it("still requires server emulator hosts locally", async () => {
    await expect(import("@/config/env/server")).rejects.toThrow(
      "Ungültige serverseitige Environment-Konfiguration",
    );
  });

  it("still accepts the configured local server emulator hosts", async () => {
    vi.stubEnv("FIRESTORE_EMULATOR_HOST", "127.0.0.1:8080");
    vi.stubEnv("FIREBASE_AUTH_EMULATOR_HOST", "127.0.0.1:9099");
    vi.stubEnv("FIREBASE_STORAGE_EMULATOR_HOST", "127.0.0.1:9199");
    const { serverEnv } = await import("@/config/env/server");
    expect(serverEnv.public.isLocal).toBe(true);
  });

  it("still rejects server emulator hosts outside local development", async () => {
    setPublicEnv({
      NEXT_PUBLIC_SITE_ENV: "ci",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "test-ci-project",
      NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "false",
    });
    vi.stubEnv("FIRESTORE_EMULATOR_HOST", "127.0.0.1:8080");
    await expect(import("@/config/env/server")).rejects.toThrow(
      "Ungültige serverseitige Environment-Konfiguration",
    );
  });
});
