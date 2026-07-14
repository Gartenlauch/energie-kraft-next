import "server-only";

import { z } from "zod";

import { publicEnv } from "./public";

const emulatorHostSchema = z
  .string()
  .regex(
    /^[^:/\s]+:\d+$/,
    "Der Emulator-Host muss im Format host:port ohne http:// angegeben werden.",
  );

const emulatorHostKeys = [
  "FIRESTORE_EMULATOR_HOST",
  "FIREBASE_AUTH_EMULATOR_HOST",
  "FIREBASE_STORAGE_EMULATOR_HOST",
] as const;

const serverEnvSchema = z
  .object({
    FIRESTORE_EMULATOR_HOST: emulatorHostSchema.optional(),
    FIREBASE_AUTH_EMULATOR_HOST: emulatorHostSchema.optional(),
    FIREBASE_STORAGE_EMULATOR_HOST: emulatorHostSchema.optional(),
  })
  .superRefine((value, context) => {
    for (const key of emulatorHostKeys) {
      const host = value[key];

      if (publicEnv.isLocal && !host) {
        context.addIssue({
          code: "custom",
          path: [key],
          message: `${key} ist in der lokalen Umgebung erforderlich.`,
        });
      }

      if (!publicEnv.isLocal && host) {
        context.addIssue({
          code: "custom",
          path: [key],
          message: `${key} darf außerhalb der lokalen Umgebung nicht gesetzt sein.`,
        });
      }
    }
  });

const parsedServerEnv = serverEnvSchema.safeParse({
  FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST,
  FIREBASE_AUTH_EMULATOR_HOST:
    process.env.FIREBASE_AUTH_EMULATOR_HOST,
  FIREBASE_STORAGE_EMULATOR_HOST:
    process.env.FIREBASE_STORAGE_EMULATOR_HOST,
});

if (!parsedServerEnv.success) {
  throw new Error(
    `Ungültige serverseitige Environment-Konfiguration:\n${JSON.stringify(
      parsedServerEnv.error.flatten().fieldErrors,
      null,
      2,
    )}`,
  );
}

export const serverEnv = {
  ...parsedServerEnv.data,
  public: publicEnv,
} as const;