# Documentation index

This index separates current system documentation from historical sprint and migration records. Source code, configuration, Rules and tests remain the authority when a historical document differs.

## Architecture

- [Admin backend](architecture/admin-backend.md) – shell, dashboard, lists, activities, forwarding and user management
- [Admin authentication](architecture/admin-authentication.md) – session cookies, roles and authorization
- [Configurator](architecture/configurator.md) – journey, versioned settings, calculations, submissions and PDFs
- [Firebase data model](architecture/firebase-data-model.md) – current collections and ownership boundaries
- [Public FAQ rendering](architecture/public-faq-rendering.md)
- [FAQ entry administration](architecture/faq-entry-admin.md)
- [FAQ category administration](architecture/faq-category-admin.md)

## Firebase and operations

- [Firebase operating model](architecture/firebase-operating-model.md)
- [Firebase Emulator Suite](architecture/firebase-emulators.md)
- [Firebase Security Rules](architecture/firebase-security-rules.md)
- [Production readiness and deployment](deployment.md)
- [Admin follow-up QA](admin-follow-up-qa.md) – implementation record and outstanding manual QA

## SEO, migration and reviews

- [Current SEO implementation](seo-migration.md)
- [Legacy URL migration](legacy-url-migration.md) – historical evidence and unresolved cutover decisions
- [Sprint 3 SEO migration matrix](seo/migration-matrix.md) – historical
- [Google reviews integration](reviews-integration.md)
- `02_energie-kraft_relaunch_migrationsmatrix_v2.xlsx` – historical planning workbook; see its status in [Legacy URL migration](legacy-url-migration.md)

## Design and content

- [Design system](design-system.md)
- [Content rules](content-rules.md)
- [Sprint 8 team/assets record](sprint-8-team-assets.md) – historical with current-status note
- [Reference-data follow-up](sprint-8-reference-data-todo.md)
- [Placeholder/media follow-up](sprint-8-placeholder-assets.md)

## Historical sprint documentation

These files preserve the state and decisions of their sprint. They are not current architecture specifications.

- [Sprint 1 setup](sprint/sprint-01-setup.md)
- [Sprint 7 image assets](sprint-7-image-assets.md)
- [Sprint 8.1 go-live guards](sprint-8-1-go-live-guards.md)
- [Sprint 8.3A content and FAQ](sprint-8-3a-content-faq.md)
- [Sprint 8 content inventory](sprint-8-content-inventory.md)
- [Sprint 8 image assets](sprint-8-image-assets.md)
- [Sprint 8 SEO baseline](sprint-8-seo-baseline.md)

## Status vocabulary

- **Implemented:** present in the current repository.
- **Historical:** accurate as a record of an earlier sprint, but not canonical for current behavior.
- **Partially implemented:** only the explicitly named parts exist.
- **Not yet deployed:** repository support may exist, but production provisioning/cutover is not complete.
- **Needs business verification:** code or assets exist, but factual approval is still required before go-live.
