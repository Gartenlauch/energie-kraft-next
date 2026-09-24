# Firebase Emulator Suite

## Local services

`npm run emulators` starts the demo project `demo-energie-kraft-next` with:

| Service | Port |
| --- | ---: |
| Emulator UI | 4000 |
| Functions | 5001 |
| Firestore | 8080 |
| Authentication | 9099 |
| Storage | 9199 |

The command imports `.emulator-data` when present and exports state on exit. `npm run emulators:smoke` runs the repository smoke workflow in an isolated emulator execution.

Copy `.env.example` to `.env.local`. Local mode requires `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` plus loopback Auth/Firestore/Storage hosts. The browser SDK connects all four services; the server Admin SDK uses the emulator host variables. Environment validation rejects emulator use outside local mode and rejects local mode without emulators.

## Local Administrator

With the Auth emulator running:

```bash
npm run auth:local:set-admin -- <email>
```

The user must already exist in the Auth emulator. The script targets the loopback emulator and
sets the legacy-compatible `admin: true` claim; it must not be repurposed for production accounts.

## Password setup/reset

The Authentication Emulator does **not** deliver password-reset e-mail. When Benutzerverwaltung triggers a password setup/reset locally, the emulator prints the generated reset URL in the Auth emulator console/UI output. Open that URL manually in the browser to test the flow.

## External-service warning

Emulators isolate Firebase services, not every integration. If `functions/.secret.local` contains a valid Mailgun key, a locally emulated callable can still reach Mailgun EU and send a real message. Google Places can likewise make a real billable request when server configuration is supplied. Use absent/test credentials and approved recipients; never assume “running in emulators” means all network side effects are fake.

Local Functions secrets belong in `functions/.secret.local`. Never document or commit their values.
