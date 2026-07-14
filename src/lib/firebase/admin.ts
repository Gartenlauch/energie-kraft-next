import "server-only";

import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { env } from "@/config/env";

const adminApp =
  getApps()[0] ??
  initializeApp(
    env.NEXT_PUBLIC_SITE_ENV === "local"
      ? {
          projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        }
      : undefined,
  );

export const adminAuth = getAuth(adminApp);
export const adminFirestore = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);