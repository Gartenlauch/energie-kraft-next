import "server-only";
import { publicEnv } from "@/config/env/public";
import { firebaseEmulators } from "@/config/firebase";
import { adminAuth, adminFirestore } from "@/lib/firebase/admin";
import { createUserManagement } from "./user-management";

export const userManagement = createUserManagement({
  auth: adminAuth,
  db: adminFirestore,
  async sendPasswordEmail(email) {
    // Same Firebase password setup/reset flow as the client SDK, invoked only after admin authorization.
    const base = publicEnv.isLocal
      ? `http://${firebaseEmulators.host}:${firebaseEmulators.ports.auth}/identitytoolkit.googleapis.com`
      : "https://identitytoolkit.googleapis.com";
    const response = await fetch(
      `${base}/v1/accounts:sendOobCode?key=${encodeURIComponent(publicEnv.NEXT_PUBLIC_FIREBASE_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Firebase-Locale": "de" },
        body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (!response.ok) throw new Error("Firebase hat die Passwort-Mail nicht angenommen.");
  },
});
