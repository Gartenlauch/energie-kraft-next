import "server-only";
import { cache } from "react";
import { requireStaffSession } from "@/lib/auth/session";
import { adminFirestore } from "@/lib/firebase/admin";
import { managedUserIdSchema } from "./user-model";

export const getActorProfile = cache(async (uid: string) => {
  await requireStaffSession();
  if (!managedUserIdSchema.safeParse(uid).success) return null;
  const snapshot = await adminFirestore.collection("adminUsers").doc(uid).get();
  const profile = snapshot.data();
  return profile
    ? {
        displayName: typeof profile.displayName === "string" ? profile.displayName : null,
        photo: typeof profile.photo === "string" ? profile.photo : null,
      }
    : null;
});
