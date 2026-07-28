export const FIREBASE_PRODUCTION_PROJECT_ID =
  "energie-kraft-next";

export const FIREBASE_EMULATOR_PROJECT_ID =
  "demo-energie-kraft-next";

export const FIREBASE_FUNCTIONS_REGION = "europe-west4";

export const firebaseEmulators = {
  host: "127.0.0.1",
  ports: {
    ui: 4000,
    hub: 4400,
    functions: 5001,
    firestore: 8080,
    auth: 9099,
    storage: 9199,
  },
} as const;