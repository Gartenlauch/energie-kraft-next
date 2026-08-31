$env:FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099"
$env:GCLOUD_PROJECT = "demo-energie-kraft-next"
$env:ADMIN_EMAIL = "as@fair-it.net"

Push-Location .\functions

@'
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

initializeApp({
  projectId: process.env.GCLOUD_PROJECT,
});

async function main() {
  const auth = getAuth();

  const user = await auth.getUserByEmail(
    process.env.ADMIN_EMAIL,
  );

  await auth.setCustomUserClaims(
    user.uid,
    {
      ...(user.customClaims ?? {}),
      admin: true,
    },
  );

  const updatedUser =
    await auth.getUser(user.uid);

  console.log("Admin-Rechte gesetzt:");
  console.log("UID:", updatedUser.uid);
  console.log("E-Mail:", updatedUser.email);
  console.log(
    "Claims:",
    updatedUser.customClaims,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
'@ | node

Pop-Location