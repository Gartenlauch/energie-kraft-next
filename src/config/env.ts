import { z } from "zod";

const publicEnvSchema = z.object({
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

  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_USE_FIREBASE_EMULATORS: z.enum(["true", "false"]).default("false"),
});

const parsedEnv = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_ENV: process.env.NEXT_PUBLIC_SITE_ENV,
  NEXT_PUBLIC_CANONICAL_BASE_URL: process.env.NEXT_PUBLIC_CANONICAL_BASE_URL,

  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,

  NEXT_PUBLIC_USE_FIREBASE_EMULATORS:
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS,
});

if (!parsedEnv.success) {
  throw new Error(
    `Ungültige Environment-Konfiguration:\n${JSON.stringify(
      parsedEnv.error.flatten().fieldErrors,
      null,
      2,
    )}`,
  );
}

export const env = {
  ...parsedEnv.data,
  useFirebaseEmulators:
    parsedEnv.data.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true",
  isProduction: parsedEnv.data.NEXT_PUBLIC_SITE_ENV === "production",
};