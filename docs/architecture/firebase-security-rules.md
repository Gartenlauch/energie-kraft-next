# Firebase Security Rules

## Firestore

`firestore.rules` is deny-by-default. Public/customer submissions and all protected writes go through server code; there are no direct browser writes to leads, applications, referrals, FAQs, settings, profiles or activities.

Explicit client reads:

- `adminRealtime/{leads|applications|referrals}`: active Administrator or Mitarbeiter
- `applications/{id}` and `referrals/{id}`: active Administrator only

All writes to those paths are denied. `adminUsers/{uid}` and `adminLocks/{id}` are completely server-only. Leads, activities, FAQs, configurator settings, counters, idempotency records and unknown paths fall through to deny-all.

Role evaluation accepts canonical `role: "admin" | "staff"`; legacy `admin: true` is Administrator only when no explicit role exists. Profile state is also checked: inactive, archived or pending profiles are denied. The rules' narrow reads complement, but do not replace, server authorization.

Operational Admin pages commonly read business records server-side with the Admin SDK, so a client Rules denial does not mean the feature is unavailable.

## Storage

`storage.rules` denies every client read and write. Application documents and Admin avatars are handled by authenticated server routes/Admin SDK.

Private avatars are stored as `adminUsers/{uid}/avatar.webp`. There is no public Storage download token; upload is Administrator-only and download requires an active internal session.

## Server-side controls

Because the Admin SDK bypasses Rules, server operations enforce:

- verified session/callable identity and live role/profile state;
- Administrator-only gates for FAQ, settings, users and destructive actions;
- Zod/domain validation and same-origin checks where applicable;
- file type/size/content validation;
- self/last-Administrator and idempotency/transaction protections.

## Tests

`npm run test:rules` starts Firestore and Storage emulators and runs `vitest.rules.config.mjs`, including role/profile and deny-by-default cases. `npm run check:all` includes the Rules suite. Test counts are intentionally not hardcoded here.
