import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH, ADMIN_SESSION_COOKIE_NAME } from "@/config/auth";
import { adminAuth } from "@/lib/firebase/admin";
import type { AdminSession } from "@/types/auth";
import { getLiveAdminIdentity } from "./live-role";

export async function getStaffSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

    const identity = await getLiveAdminIdentity(decodedToken);
    if (!identity) return null;

    return {
      uid: decodedToken.uid,
      role: identity.role,
      photo: typeof identity.profile?.photo === "string" ? identity.profile.photo : null,
      email: typeof identity.account.email === "string" ? identity.account.email : null,
      displayName:
        typeof identity.account.displayName === "string" ? identity.account.displayName : null,
      issuedAt: decodedToken.iat,
      expiresAt: decodedToken.exp,
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await requireStaffSession();
  if (session.role !== "admin") redirect("/admin");
  return session;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await getStaffSession();
  return session?.role === "admin" ? session : null;
}

export async function requireStaffSession(): Promise<AdminSession> {
  const session = await getStaffSession();

  if (!session) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return session;
}
