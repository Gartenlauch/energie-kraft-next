import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { HttpsError, type CallableRequest } from "firebase-functions/v2/https";
import { effectiveAdminRole, resolveAdminRole } from "./admin-role.js";

export function checkStaffClaim(request: CallableRequest<unknown>) {
  if (!request.auth || !resolveAdminRole(request.auth.token))
    throw new HttpsError("permission-denied", "Aktiver Mitarbeiterzugang erforderlich.");
  return request.auth;
}

type CallerIdentity = {
  account: { disabled: boolean; customClaims?: Record<string, unknown>; tokensValidAfterTime?: string; email?: string };
  profile?: { active?: boolean; pending?: boolean; archived?: boolean };
};
async function readCallerIdentity(uid: string): Promise<CallerIdentity> {
  const [account, profile] = await Promise.all([
    getAuth().getUser(uid), getFirestore().collection("adminUsers").doc(uid).get(),
  ]);
  return { account, profile: profile.data() };
}

export async function requireStaffCaller(
  request: CallableRequest<unknown>,
  readIdentity: (uid: string) => Promise<CallerIdentity> = readCallerIdentity,
) {
  const caller = checkStaffClaim(request);
  try {
    const { account, profile } = await readIdentity(caller.uid);
    if (!effectiveAdminRole(caller.token, account, profile)) throw new Error("denied");
    return { uid: caller.uid, email: account.email ?? null };
  } catch {
    throw new HttpsError("permission-denied", "Zugang nicht mehr gültig. Bitte erneut anmelden.");
  }
}
