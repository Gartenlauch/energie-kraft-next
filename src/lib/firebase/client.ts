import "client-only";

import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";
import {
  connectFunctionsEmulator,
  getFunctions,
} from "firebase/functions";
import {
  connectStorageEmulator,
  getStorage,
} from "firebase/storage";

import { publicEnv } from "@/config/env/public";

import {
  FIREBASE_FUNCTIONS_REGION,
  firebaseEmulators,
} from "@/config/firebase";

const firebaseConfig = {
  apiKey: publicEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: publicEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: publicEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: publicEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    publicEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: publicEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: publicEnv.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export const firebaseFunctions = getFunctions(
  firebaseApp,
  FIREBASE_FUNCTIONS_REGION,
);

declare global {
  var __energieKraftFirebaseEmulatorsConnected:
    | boolean
    | undefined;
}

if (
  typeof window !== "undefined" &&
  publicEnv.useFirebaseEmulators &&
  !globalThis.__energieKraftFirebaseEmulatorsConnected
) {
  const { host, ports } = firebaseEmulators;

  connectAuthEmulator(
    firebaseAuth,
    `http://${host}:${ports.auth}`,
    {
      disableWarnings: true,
    },
  );

  connectFirestoreEmulator(
    firestore,
    host,
    ports.firestore,
  );

  connectStorageEmulator(
    firebaseStorage,
    host,
    ports.storage,
  );

  connectFunctionsEmulator(
    firebaseFunctions,
    host,
    ports.functions,
  );

  globalThis.__energieKraftFirebaseEmulatorsConnected = true;
}