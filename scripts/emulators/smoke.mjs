import {
  deleteApp,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {
  FieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const projectId = "demo-energie-kraft-next";
const region = "europe-west4";
const host = "127.0.0.1";
const storageBucket = `${projectId}.appspot.com`;

process.env.GCLOUD_PROJECT = projectId;
process.env.FIREBASE_AUTH_EMULATOR_HOST =
  `${host}:9099`;
process.env.FIRESTORE_EMULATOR_HOST =
  `${host}:8080`;
process.env.FIREBASE_STORAGE_EMULATOR_HOST =
  `${host}:9199`;

const app = initializeApp(
  {
    projectId,
    storageBucket,
  },
  "s2-03-emulator-smoke",
);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

const uid = "s2-03-smoke-user";
const email = "s2-03-smoke@example.test";

const documentReference = firestore
  .collection("emulatorSmoke")
  .doc("s2-03");

const file = storage
  .bucket()
  .file("emulator-smoke/s2-03.txt");

try {
  await Promise.allSettled([
    auth.deleteUser(uid),
    documentReference.delete(),
    file.delete(),
  ]);

  const user = await auth.createUser({
    uid,
    email,
    password: "Emulator-Only-123!",
  });

  if (user.email !== email) {
    throw new Error(
      "Authentication-Emulator lieferte unerwartete Daten.",
    );
  }

  console.log("✓ Authentication Emulator");

  await documentReference.set({
    status: "ok",
    createdAt: FieldValue.serverTimestamp(),
  });

  const documentSnapshot =
    await documentReference.get();

  if (documentSnapshot.get("status") !== "ok") {
    throw new Error(
      "Firestore-Emulator lieferte unerwartete Daten.",
    );
  }

  console.log("✓ Firestore Emulator");

  await file.save("ok", {
    contentType: "text/plain",
  });

  const [fileExists] = await file.exists();

  if (!fileExists) {
    throw new Error(
      "Storage-Emulator hat die Testdatei nicht gespeichert.",
    );
  }

  console.log("✓ Storage Emulator");

  const healthUrl =
    `http://${host}:5001/` +
    `${projectId}/${region}/health`;

  const healthResponse = await fetch(healthUrl);

  if (!healthResponse.ok) {
    throw new Error(
      `Functions-Emulator antwortete mit ` +
      `${healthResponse.status}.`,
    );
  }

  console.log("✓ Functions Emulator");
  console.log("✓ Emulator-Smoke-Test erfolgreich");
} finally {
  await Promise.allSettled([
    auth.deleteUser(uid),
    documentReference.delete(),
    file.delete(),
  ]);

  await deleteApp(app);
}