# Energie-Kraft Süd – Next.js Relaunch

Production-oriented relaunch of the Energie-Kraft Süd website. The repository contains the public Next.js application, calculators and the multi-product configurator, an authenticated Admin area, Firebase Functions, Security Rules, and the supporting test infrastructure.

> **Deployment status:** The new application is developed and tested locally against the Firebase Emulator Suite. A complete productive Firebase/App Hosting environment and the WordPress cutover have **not** yet been completed. See [Production readiness](docs/deployment.md).

## Stack

- Next.js 16 App Router, React 19, TypeScript and Tailwind CSS 4
- Firebase Authentication, Firestore, Storage, Functions and App Hosting configuration
- Zod validation, Vitest and Firebase Rules Unit Testing
- Mailgun EU for server-side transactional mail
- PDFKit for configurator project PDFs

Node.js 22 is required (`.nvmrc` and `package.json`).

## Local setup

```bash
npm ci
npm ci --prefix functions
Copy-Item .env.example .env.local
npm run emulators
```

In a second terminal:

```bash
npm run dev
```

The website is available at `http://localhost:3000`; the Emulator UI uses `http://127.0.0.1:4000`.

The local environment must use the demo project `demo-energie-kraft-next`. Browser and server Firebase SDKs are wired to the local Auth, Firestore, Functions and Storage emulators through `.env.local`. Local Functions secrets, when required, belong in `functions/.secret.local`; never commit secret values.

Promote an existing Auth-emulator user to the legacy-compatible Administrator claim only while
the Auth emulator is running:

```bash
npm run auth:local:set-admin -- <email>
```

See [Firebase emulators](docs/architecture/firebase-emulators.md) for persistence, password-reset testing and external-service caveats.

## Main application areas

- Public marketing, service, company, legal and reference routes under `src/app/(site)`
- Calculators under `/rechner/*`
- Shared energy-project configurator under `/konfigurator` with product flows for Photovoltaik, Stromspeicher, Wärmepumpe, Klimaanlage and Wallbox
- Firestore-backed public FAQ catalog and authenticated FAQ administration, including JSON preview/import/export
- Protected Admin at `/admin` for Dashboard, Anfragen, Bewerbungen and Empfehlungen
- Administrator-only FAQ management, configurator settings and Benutzerverwaltung

The canonical role model is `role: "admin"` (Administrator) and `role: "staff"` (Mitarbeiter). A legacy claim containing only `admin: true` remains compatible and resolves to Administrator. Details: [Admin authentication](docs/architecture/admin-authentication.md).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` / `npm run start` | Build and run the production bundle locally |
| `npm run lint` | Lint the repository |
| `npm run typecheck` | Generate Next types and run TypeScript |
| `npm run test` | Run unit tests |
| `npm run functions:check` | Lint and compile Firebase Functions |
| `npm run test:rules` | Run Firestore and Storage Rules tests in emulators |
| `npm run check:all` | Run lint, typecheck, unit tests, Functions checks, Rules tests and build |
| `npm run emulators` | Start Auth, Firestore, Functions and Storage emulators with import/export |
| `npm run emulators:smoke` | Run the emulator smoke workflow |
| `npm run images:references` | Regenerate optimized reference assets/data from approved inputs |

## Repository structure

```text
src/app/                 App Router pages, Route Handlers and Server Actions
src/components/          Public, configurator and Admin UI
src/lib/                 Domain logic, repositories, validation and integrations
src/content/             Curated public content
src/types/               Shared application types
functions/src/           Callable Functions, mail, PDF and server-authoritative modeling
tests/                   Unit and Firebase Security Rules tests
docs/                    Current architecture plus preserved historical sprint records
```

## Documentation

Start with the [documentation index](docs/README.md). Key current documents:

- [Admin backend](docs/architecture/admin-backend.md)
- [Configurator architecture](docs/architecture/configurator.md)
- [Firebase data model](docs/architecture/firebase-data-model.md)
- [Firebase security](docs/architecture/firebase-security-rules.md)
- [Design system](docs/design-system.md)
- [Production readiness](docs/deployment.md)

Historical sprint and migration files are retained as records; their status notes point to the current canonical documentation.
