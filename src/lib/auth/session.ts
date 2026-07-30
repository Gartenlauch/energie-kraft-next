import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE_NAME,
} from "@/config/auth";
import { adminAuth } from "@/lib/firebase/admin";
import type { AdminSession } from "@/types/auth";

export async function getAdminSession(): Promise<
  AdminSession | null
> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(
    ADMIN_SESSION_COOKIE_NAME,
  )?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken =
      await adminAuth.verifySessionCookie(
        sessionCookie,
        true,
      );

    if (decodedToken.admin !== true) {
      return null;
    }

    return {
      uid: decodedToken.uid,
      email:
        typeof decodedToken.email === "string"
          ? decodedToken.email
          : null,
      displayName:
        typeof decodedToken.name === "string"
          ? decodedToken.name
          : null,
      issuedAt: decodedToken.iat,
      expiresAt: decodedToken.exp,
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return session;
}