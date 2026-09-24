# Firebase data model

All protected business writes are server-authoritative. Firestore Timestamps are used for server audit fields unless a field is explicitly an ISO string or number.

## Customer-generated business data

### `leads/{leadId}`

Stores contact and configurator Anfragen. Common fields include `type`, workflow `status`, contact/project data, `createdAt` and `updatedAt`. Configurator leads additionally persist the public reference, settings/settings version, selected products, journey, normalized answers/results, economics, consent and schema metadata. Current configurator writes use schema version 4; Admin normalization supports the implemented older lead variants.

`leads/{leadId}/activities/{activityId}` stores status, PDF and forwarding events with type, timestamp, actor UID/e-mail, message and limited metadata.

### `applications/{submissionId}`

Private application PII, job snapshot, status, consent, document metadata, upload/idempotency state, mail state and audit timestamps. Private files use Storage paths `applications/{applicationId}/{documentId}`. Deletion coordinates Firestore and tracked Storage objects.

### `referrals/{submissionId}`

Private referrer/referred-customer PII, campaign snapshot, consent, status, mail state, metadata and timestamps. `referrals/{id}/activities/{activityId}` currently contains forwarding events; status updates do not currently append an activity record.

Public forms call validated Functions; browsers do not write these collections directly.

## FAQ content

### `faqCategories/{slug}`

The immutable document ID equals the category slug. Fields: `name`, `slug`, `sortOrder`, `isActive` and create/update audit fields.

### `faqs/{faqId}`

Fields include question, short/long answer data, immutable `slug`, `categoryId`, `isPublished`, route placements, related FAQ IDs, optional product link and create/update audit fields. Placements contain `routeKey`, `sortOrder` and `showInSchema`.

Firestore is the runtime FAQ source. Public reads and Admin CRUD/import/export are server-side through the Admin SDK.

## Configurator model and idempotency

- `configuratorSettings/current`: current schema/version/settings plus update audit.
- `configuratorSettingsVersions/{version}`: immutable numbered settings snapshot.
- `configuratorSubmissions/{submissionId}`: payload fingerprint, lead/public-reference mapping and processing/mail/report state for retry safety.
- `systemCounters/configuratorLead`: atomic `lastValue` used for public project references.

Version 0 is represented by code defaults rather than a required snapshot document.

## Admin identity and operations

### `adminUsers/{uid}`

Server-controlled profile fields:

- `uid`, `firstName`, `lastName`, `displayName`, `email`, `phone` and `jobTitle`
- canonical `role` (`admin` or `staff`), `active`, `pending` and `archived`
- private avatar path `photo` or `null`
- `createdAt` / `createdByUid` and `updatedAt` / `updatedByUid`
- archived profiles may contain `deletedAt` / `deletedByUid`

Last login is read from Firebase Auth metadata and is not a persisted profile field. Legacy Auth users without a profile remain compatible when their claims resolve to Administrator.

### `adminLocks/userManagement`

A server-only lock serializes privileged Auth/profile mutations. It contains the lock owner and creation timestamp while an operation is active; it is not a user-facing record.

### `adminRealtime/{leads|applications|referrals}`

Small revision/timestamp signals let active internal clients refresh lists. They contain no business payload.

## Access classification

| Data | Public browser | Internal client SDK | Trusted server |
| --- | --- | --- | --- |
| Leads/applications/referrals and activities | No direct access | Narrow Rules exceptions only where documented | Create/read/update/delete by authorized workflow |
| FAQ/settings | No direct Firestore access | No direct write | Public rendering or Administrator management |
| Admin profiles/locks | No | No | Administrator/user-management flow |
| Realtime signals | No anonymous access | Active staff read | Server write |
| Application files/avatars | No direct Storage access | Served only by authorized routes | Validated Admin SDK access |

See [Security Rules](firebase-security-rules.md) and [Admin backend](admin-backend.md).
