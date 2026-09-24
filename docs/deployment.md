# Production readiness and deployment

## Current status

**Not yet deployed as the completed new production platform.** The repository contains Firebase/App Hosting configuration, but this does not prove that the required productive services, data, IAM, secrets, domain routing or release have been completed. The legacy WordPress website remains the live-site baseline until an explicitly authorized cutover.

Local development uses `demo-energie-kraft-next` and the Firebase Emulator Suite. Do not infer production readiness from successful emulator tests or from `.firebaserc` containing `energie-kraft-next`.

## Release prerequisites

Before any production deployment, explicitly verify and record:

1. **Firebase project and regions:** correct project selected; Firestore location `europe-west4`; Functions region consistent with `src/config/firebase.ts`.
2. **Authentication:** enabled sign-in method, authorized domains, reset-email template/sender, initial Administrator and last-Administrator recovery procedure.
3. **Firestore and Storage:** databases/buckets provisioned, indexes applied, Rules reviewed and tested, required server identities granted least privilege.
4. **Functions:** build passes; callable endpoints use current role checks; runtime secrets exist; no local emulator host variables leak into production.
5. **App Hosting:** backend exists, runtime identity and secrets are configured, runtime environment uses production values, and no deployment is inferred from `apphosting.yaml` alone.
6. **Mailgun EU:** domain, sending key, recipients, templates and privacy/legal approval verified. Provider acceptance is not delivery confirmation.
7. **Google Places:** server-side API key restriction, Place ID, profile URL, quota/cost controls and attribution reviewed.
8. **Content and facts:** legal text, jobs, referral conditions, reference facts, team/media rights and time-sensitive claims approved.
9. **SEO cutover:** redirects, canonicals, sitemap, robots, historical incident URLs and WordPress decommissioning reviewed against current routes.
10. **Operations:** backups/export, monitoring, incident ownership, rollback and support contacts documented.

## Secrets and environment

- `.env.local` is for local application configuration and must not be committed.
- `functions/.secret.local` supplies local Functions secrets where needed and must not be committed.
- Firebase/Cloud secrets must be provisioned explicitly for production; documentation must contain names and purpose only, never values.
- `apphosting.yaml` currently references `GOOGLE_PLACES_API_KEY` as a runtime secret and contains non-secret Place/profile configuration. This is configuration intent, not deployment evidence.

## Verification gate

Run the repository quality gate before an authorized release:

```bash
npm ci
npm ci --prefix functions
npm run check:all
```

Then perform an environment-specific smoke test for public pages, Auth/session creation, both roles, protected Admin routes, submissions, private document/avatar access, PDF generation, forwarding and reset-email behavior. Real external mail must use an expressly approved test recipient and configuration.

## Deployment and cutover

No deployment command is part of the normal quality workflow. A release must name the exact Firebase project and exact targets. Production actions—Firebase provisioning, Rules/Functions/App Hosting deployment, DNS changes and WordPress cutover—require separate authorization and a recorded rollback plan.

After cutover, verify HTTP status/canonicals for all migration routes, production `robots.txt` and `sitemap.xml`, authentication, submissions and operational monitoring. Keep the legacy migration evidence; do not redirect compromised/incident URLs to the homepage.
