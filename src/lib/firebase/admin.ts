import "server-only";

import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { serverEnv } from "@/config/env/server";

const adminApp =
  getApps()[0] ??
  initializeApp(
    serverEnv.public.isLocal
      ? {
          projectId:
            serverEnv.public.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket:
            serverEnv.public.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        }
      : undefined,
  );

export const adminAuth = getAuth(adminApp);
export const adminFirestore = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);