import { z } from "zod";

const FIREBASE_PROJECT_ID = "energie-kraft-next";
const PRODUCTION_CANONICAL_BASE_URL = "https://www.energie-kraft.de";

const optionalNonEmptyString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const publicEnvSchema = z
  .object({
    NEXT_PUBLIC_SITE_ENV: z.enum(["local", "ci", "production"]),

    NEXT_PUBLIC_CANONICAL_BASE_URL: z
      .string()
      .url()
      .transform((url) => url.replace(/\/$/, "")),

    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),

    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: optionalNonEmptyString,

    NEXT_PUBLIC_USE_FIREBASE_EMULATORS: z.enum(["true", "false"]),
  })
  .superRefine((value, context) => {
    const useFirebaseEmulators =
      value.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

    if (value.NEXT_PUBLIC_SITE_ENV === "local" && !useFirebaseEmulators) {
      context.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_USE_FIREBASE_EMULATORS"],
        message:
          "In der lokalen Umgebung müssen die Firebase-Emulatoren aktiviert sein.",
      });
    }

    if (value.NEXT_PUBLIC_SITE_ENV !== "local" && useFirebaseEmulators) {
      context.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_USE_FIREBASE_EMULATORS"],
        message:
          "Firebase-Emulatoren dürfen nur in der lokalen Umgebung aktiviert sein.",
      });
    }

    if (
      value.NEXT_PUBLIC_SITE_ENV !== "ci" &&
      value.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== FIREBASE_PROJECT_ID
    ) {
      context.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
        message: `Für lokale Entwicklung und Produktion muss die Projekt-ID "${FIREBASE_PROJECT_ID}" verwendet werden.`,
      });
    }

    if (
      value.NEXT_PUBLIC_SITE_ENV === "ci" &&
      value.NEXT_PUBLIC_FIREBASE_PROJECT_ID === FIREBASE_PROJECT_ID
    ) {
      context.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
        message:
          "Die CI-Umgebung darf nicht mit der produktiven Firebase-Projekt-ID konfiguriert werden.",
      });
    }

    if (
      value.NEXT_PUBLIC_SITE_ENV === "production" &&
      value.NEXT_PUBLIC_CANONICAL_BASE_URL !== PRODUCTION_CANONICAL_BASE_URL
    ) {
      context.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_CANONICAL_BASE_URL"],
        message: `In Produktion muss die Canonical-Basis-URL "${PRODUCTION_CANONICAL_BASE_URL}" verwendet werden.`,
      });
    }
  });

const parsedPublicEnv = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_ENV: process.env.NEXT_PUBLIC_SITE_ENV,
  NEXT_PUBLIC_CANONICAL_BASE_URL:
    process.env.NEXT_PUBLIC_CANONICAL_BASE_URL,

  NEXT_PUBLIC_FIREBASE_API_KEY:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,

  NEXT_PUBLIC_USE_FIREBASE_EMULATORS:
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS,
});

if (!parsedPublicEnv.success) {
  throw new Error(
    `Ungültige öffentliche Environment-Konfiguration:\n${JSON.stringify(
      parsedPublicEnv.error.flatten().fieldErrors,
      null,
      2,
    )}`,
  );
}

export const publicEnv = {
  ...parsedPublicEnv.data,

  useFirebaseEmulators:
    parsedPublicEnv.data.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true",

  isLocal: parsedPublicEnv.data.NEXT_PUBLIC_SITE_ENV === "local",
  isCi: parsedPublicEnv.data.NEXT_PUBLIC_SITE_ENV === "ci",
  isProduction:
    parsedPublicEnv.data.NEXT_PUBLIC_SITE_ENV === "production",
} as const;