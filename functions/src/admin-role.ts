export type AdminRole = "admin" | "staff";

/** An explicit role takes precedence over the legacy flag. Unknown roles fail closed. */
export function resolveAdminRole(claims: Record<string, unknown> | undefined): AdminRole | null {
  if (claims?.role === "admin" || claims?.role === "staff") return claims.role;
  return claims?.role === undefined && claims?.admin === true ? "admin" : null;
}

export function effectiveAdminRole(
  token: Record<string, unknown>,
  account: {
    customClaims?: Record<string, unknown>;
    disabled: boolean;
    tokensValidAfterTime?: string;
  },
  profile?: { active?: boolean; archived?: boolean; pending?: boolean },
): AdminRole | null {
  if (account.disabled || profile?.active === false || profile?.archived || profile?.pending)
    return null;
  const issued = typeof token.auth_time === "number" ? token.auth_time * 1000 : 0;
  if (account.tokensValidAfterTime && issued < Date.parse(account.tokensValidAfterTime))
    return null;
  const current = resolveAdminRole(account.customClaims);
  const claimed = resolveAdminRole(token);
  if (!current || !claimed) return null;
  // Neither stale tokens nor newly elevated accounts can elevate an old session.
  return current === "admin" && claimed === "admin" ? "admin" : "staff";
}

export function claimsForRole(claims: Record<string, unknown> | undefined, role: AdminRole) {
  const result = { ...claims, role, admin: role === "admin" };
  return result;
}
