"use client";

import {
  doc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  firebaseAuth,
  firestore,
} from "@/lib/firebase/client";

const REALTIME_COLLECTION =
  "adminRealtime";

const REALTIME_DOCUMENT =
  "leads";

export function LeadRealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    let unsubscribe:
      | Unsubscribe
      | undefined;

    let disposed = false;

    void (async () => {
      await firebaseAuth.authStateReady();

      if (disposed) {
        return;
      }

      const user =
        firebaseAuth.currentUser;

      if (!user) {
        return;
      }

      await user.getIdToken(true);

      if (disposed) {
        return;
      }

      const realtimeReference = doc(
        firestore,
        REALTIME_COLLECTION,
        REALTIME_DOCUMENT,
      );

      let initialized = false;
      let lastRevision:
        | number
        | null = null;

      unsubscribe = onSnapshot(
        realtimeReference,
        (snapshot) => {
          const data =
            snapshot.exists()
              ? snapshot.data()
              : null;

          const revision =
            typeof data?.revision ===
            "number"
              ? data.revision
              : null;

          if (!initialized) {
            initialized = true;
            lastRevision = revision;

            return;
          }

          if (
            revision === lastRevision
          ) {
            return;
          }

          lastRevision = revision;

          router.refresh();
        },
        (error) => {
          throw error;
        },
      );
    })();

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, [router]);

  return null;
}