"use client";

import { doc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { firebaseAuth, firestore } from "@/lib/firebase/client";

export function SubmissionRealtimeRefresh({ documentId }: { documentId: "applications" | "referrals" }) {
  const router = useRouter();
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;
    let disposed = false;
    void (async () => {
      await firebaseAuth.authStateReady();
      const user = firebaseAuth.currentUser;
      if (disposed || !user) return;
      await user.getIdToken(true);
      if (disposed) return;
      let initialized = false;
      let revision: number | null = null;
      unsubscribe = onSnapshot(doc(firestore, "adminRealtime", documentId), (snapshot) => {
        const next = snapshot.exists() && typeof snapshot.data().revision === "number"
          ? snapshot.data().revision as number
          : null;
        if (!initialized) {
          initialized = true;
          revision = next;
          return;
        }
        if (next !== revision) {
          revision = next;
          router.refresh();
        }
      });
    })();
    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, [documentId, router]);
  return null;
}
