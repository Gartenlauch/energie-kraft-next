import "server-only";
import { adminAuth, adminFirestore } from "@/lib/firebase/admin";
import { effectiveAdminRole } from "../../../functions/src/admin-role.ts";

export async function getLiveAdminIdentity(token: { uid: string } & Record<string, unknown>) {
  const [account, snapshot] = await Promise.all([
    adminAuth.getUser(token.uid),
    adminFirestore.collection("adminUsers").doc(token.uid).get(),
  ]);
  const profile = snapshot.data();
  const role = effectiveAdminRole(token, account, profile);
  return role ? { role, account, profile } : null;
}
