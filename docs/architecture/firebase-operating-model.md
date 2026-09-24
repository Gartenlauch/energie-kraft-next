# Firebase operating model

## Status

The repository is emulator-first and uses one configured Firebase project alias, `energie-kraft-next`. The new application does **not** yet have a completed productive Firebase/App Hosting environment or completed WordPress cutover. Configuration files express intended deployment shape, not proof that services are provisioned or live.

- Local application data is expected only in the Emulator Suite.
- CI uses placeholder web configuration, runs tests/builds and does not read/write production data.
- Production provisioning and deployment require separate authorization and the [production-readiness runbook](../deployment.md).

## Configuration

- `.firebaserc`: default alias `energie-kraft-next`; no staging/production aliases.
- `firebase.json`: Firestore `(default)` in `europe-west4`, indexes, Rules, Storage Rules, Functions codebase, Emulator Suite and App Hosting backend `energie-kraft-next`.
- `apphosting.yaml`: Cloud Run minimum instances and Google Places runtime configuration. It is not deployment evidence.
- `.env.example`: safe local/demo values and emulator hosts.
- `functions/.secret.local`: local Functions secrets where required; never committed.

Functions use Node.js 22. The public app and Functions both use the existing Firebase/Mailgun architecture; protected business data is written by trusted server code, not public browsers.

## Commands

```bash
npm run firebase:current
npm run firebase:projects
npm run emulators
npm run emulators:smoke
npm run test:rules
npm run functions:check
```

The quality workflow contains no deployment. Do not run `firebase deploy`, create resources, switch projects or inspect production collections merely to validate local development data without explicit authorization.

## Security boundary

The Admin SDK bypasses Security Rules. Server Actions, Route Handlers and Functions must therefore enforce current identity/role, input validation and operation-specific safeguards. Client Rules are deny-by-default with only the explicit realtime/private-read exceptions documented in [Firebase Security Rules](firebase-security-rules.md).

## Environments

### Local

`NEXT_PUBLIC_SITE_ENV=local`, demo project IDs and emulator connections are mandatory. See [Firebase emulators](firebase-emulators.md).

### CI

GitHub Actions installs root/Functions dependencies, creates a non-emulator placeholder environment, and runs lint, typecheck, unit tests, Rules tests, Functions checks and the Next production build. It does not deploy.

### Future production

Production must use real service credentials/identity and no emulator host variables. Provisioning, secrets, first Administrator, IAM, Rules, indexes, App Hosting, DNS and cutover remain release work. See [Production readiness](../deployment.md).
