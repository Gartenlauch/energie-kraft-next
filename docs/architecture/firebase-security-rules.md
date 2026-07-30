# Firebase Security Rules

## Status

Firestore und Firebase Storage verwenden aktuell eine vollständig
geschlossene Deny-by-default-Konfiguration.

## Firestore

Regeldatei:

`firestore.rules`

Aktuelles Verhalten:

- keine anonymen Lesezugriffe,
- keine anonymen Schreibzugriffe,
- keine Clientzugriffe authentifizierter Benutzer,
- keine Clientzugriffe mit einem Admin-Claim,
- keine Zugriffe auf unbekannte Collections.

Administrative Zugriffe erfolgen später ausschließlich serverseitig
über das Firebase Admin SDK.

Das Admin SDK umgeht Firestore Security Rules. Deshalb müssen
serverseitige Operationen zusätzlich geschützt werden durch:

- verifizierte Session-Cookies,
- Admin-Rollenprüfung,
- serverseitige Zod-Validierung,
- kontrollierte Route Handler oder Server Actions.

## Firebase Storage

Regeldatei:

`storage.rules`

Aktuelles Verhalten:

- keine anonymen Uploads,
- keine authentifizierten Uploads,
- keine Uploads mit Admin-Claim über das Client SDK,
- kein Lesen von Dateien oder Metadaten,
- kein Löschen von Dateien über das Client SDK.

Upload-Regeln werden erst geöffnet, wenn ein konkreter fachlicher
Anwendungsfall umgesetzt und getestet wird.

## Automatisierte Tests

Testdatei:

`tests/rules/firebase-security.rules.test.ts`

Testkonfiguration:

`vitest.rules.config.mjs`

Lokaler Test:

```bash
npm run test:rules