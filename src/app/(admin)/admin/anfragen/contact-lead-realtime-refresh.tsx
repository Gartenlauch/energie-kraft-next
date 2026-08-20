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

const REALTIME_COLLECTION = "adminRealtime";
const REALTIME_DOCUMENT = "leads";

export function ContactLeadRealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    let unsubscribe:
      | Unsubscribe
      | undefined;

    let disposed = false;

    void (async () => {
      /*
       * Besonders nach F5 oder in einem zweiten Tab kann
       * Firebase Auth einen kurzen Moment benötigen, bis
       * der persistierte Benutzer wiederhergestellt wurde.
       */
      await firebaseAuth.authStateReady();

      if (disposed) {
        return;
      }

      const user = firebaseAuth.currentUser;

      if (!user) {
        return;
      }

      /*
       * Token bewusst aktualisieren, damit ein eventuell
       * neu gesetzter Admin-Custom-Claim sicher enthalten ist.
       */
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
      let lastRevision: number | null = null;

      unsubscribe = onSnapshot(
        realtimeReference,
        (snapshot) => {
          const data = snapshot.exists()
            ? snapshot.data()
            : null;

          const revision =
            typeof data?.revision === "number"
              ? data.revision
              : null;

          /*
           * Der erste Snapshot ist nur der aktuelle
           * Ausgangsstand und soll keinen Refresh auslösen.
           */
          if (!initialized) {
            initialized = true;
            lastRevision = revision;

            return;
          }

          if (revision === lastRevision) {
            return;
          }

          lastRevision = revision;

          router.refresh();
        },
        (error) => {
          /*
           * Absichtlich als Runtime-Fehler sichtbar machen.
           * Ohne Error-Callback beendet Firestore den Listener
           * bei Berechtigungsfehlern und wir sehen im UI nichts.
           */
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