# FAQ entry administration

**Status: Implemented.**

## Admin capability

`/admin/faqs` is Administrator-only and performs its own server authorization. It supports search, published/draft and category filters, create, edit, publication state, ordering, route placements, related FAQs and individual delete.

A FAQ stores `question`, long `answer`, optional `shortAnswer`, `slug`, `categoryId`, `isPublished`, `featured`, `sortOrder`, up to five related IDs, placements and server audit fields. Every FAQ has at least one unique placement containing `routeKey`, `sortOrder` and `showInSchema`. The referenced category is checked server-side.

## JSON transfer

The Admin tool implements deterministic JSON export and a two-step import:

1. Upload a JSON file (maximum 5 MB) and run preview/validation.
2. Review new/update/skipped counts, confirm explicitly and import.

Schema version 1 contains `categories` and `faqs`. Validation covers strict shapes, duplicate IDs/slugs, missing category/related references, duplicate placements and existing slug conflicts. Stable IDs are classified as new, update or skipped. Missing repository records are left untouched; import is a non-destructive upsert. Server audit fields are regenerated and writes are chunked below Firestore's batch limit.

Endpoints:

- `GET /api/admin/faqs/export`
- `POST /api/admin/faqs/import/preview`
- `POST /api/admin/faqs/import`

All endpoints require Administrator; mutating endpoints also require same origin. Mitarbeiter have no access.

## Data access

Repositories under `src/lib/faq` use the Admin SDK. Firestore client writes remain denied. See [Public FAQ rendering](public-faq-rendering.md) and [Firebase data model](firebase-data-model.md).
