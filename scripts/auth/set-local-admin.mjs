const PROJECT_ID =
  "demo-energie-kraft-next";

const AUTH_EMULATOR_HOST =
  "127.0.0.1:9099";

const email = process.argv[2]?.trim();

if (!email || !email.includes("@")) {
  console.error(
    "Verwendung: npm run auth:local:set-admin -- admin@example.test",
  );
  process.exit(1);
}

process.env.FIREBASE_AUTH_EMULATOR_HOST =
  AUTH_EMULATOR_HOST;

const {
  deleteApp,
  initializeApp,
} = await import("firebase-admin/app");

const { getAuth } = await import(
  "firebase-admin/auth"
);

const app = initializeApp(
  {
    projectId: PROJECT_ID,
  },
  "energie-kraft-local-admin-script",
);

try {
  const auth = getAuth(app);

  const user =
    await auth.getUserByEmail(email);

  await auth.setCustomUserClaims(
    user.uid,
    {
      ...(user.customClaims ?? {}),
      admin: true,
    },
  );

  console.log(
    `Admin-Claim gesetzt: ${user.email} (${user.uid})`,
  );
} catch (error) {
  console.error(
    "Der lokale Admin-Claim konnte nicht gesetzt werden.",
  );
  console.error(error);
  process.exitCode = 1;
} finally {
  await deleteApp(app);
}