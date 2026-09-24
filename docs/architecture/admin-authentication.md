# Admin authentication and authorization

## Login and session

1. `/admin/login` signs in with Firebase Authentication in the browser.
2. The Firebase Client SDK sends a fresh ID token to `POST /api/admin/session`.
3. The route enforces same origin, JSON validation, token revocation checking, recent authentication and the current live identity.
4. The Admin SDK creates the five-day `__session` cookie.
5. Protected pages use `requireStaffSession()`; Administrator-only pages/actions use `requireAdminSession()`.
6. `DELETE /api/admin/session` revokes refresh tokens and removes the cookie.

The cookie is `httpOnly`, `sameSite=strict`, path `/`, and `secure` in production. Session validation calls `verifySessionCookie(..., true)` and rechecks the current Auth account, current claims and `adminUsers/{uid}` profile; a disabled, archived or pending account fails closed.

## Canonical roles

| Claim | German role | Access |
| --- | --- | --- |
| `role: "admin"` | Administrator | Full operational and administrative access |
| `role: "staff"` | Mitarbeiter | Dashboard, Anfragen, Bewerbungen, Empfehlungen and their operational workflows |

Mitarbeiter may update statuses, access permitted application documents, download project PDFs and use allowed forwarding actions. They have no access to Benutzerverwaltung, configurator settings or FAQ administration, and cannot perform permanent deletes.

`resolveAdminRole()` in `functions/src/admin-role.ts` is the central claim resolver shared by Next.js and Functions. An explicit valid `role` takes precedence. A legacy account with no `role` but `admin: true` resolves to Administrator. Unknown/invalid roles fail closed.

`effectiveAdminRole()` compares the session/callable token with the current Auth account and profile. Stale sessions cannot retain a removed role, and a newly elevated account cannot turn an old Mitarbeiter token into an Administrator session.

## Authorization layers

- Next pages, Server Actions and Route Handlers re-authorize independently; hiding navigation is not security.
- Callable Functions use current Auth/profile checks through `requireStaffCaller()`; operations requiring Administrator use the corresponding stricter server check/action.
- Firestore direct writes to protected data remain denied; server operations use the Admin SDK and validate authorization and input.
- Access-changing user mutations revoke refresh tokens.

## Logout and role changes

Logout revokes the user's refresh tokens and expires `__session`. E-mail, role or active-state changes also revoke refresh tokens. The user must sign in again after such changes.

For user lifecycle, last-Administrator protection and avatar privacy, see [Admin backend](admin-backend.md) and [Firebase data model](firebase-data-model.md).
