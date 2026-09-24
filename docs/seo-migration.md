# SEO and migration implementation

## Current implementation

- Canonicals use the configured Energie-Kraft base URL through `buildMetadata()`.
- Public pages provide route-specific metadata; selected service/about pages also emit WebPage, Service/AboutPage, Organization/LocalBusiness and breadcrumb JSON-LD.
- Visible, placement-enabled FAQs may emit FAQPage JSON-LD. FAQ detail content does not use QAPage.
- Search indexing is controlled independently by the server/build flag `SEARCH_INDEXING_ENABLED`, which is fail-safe: only the exact value `true` enables indexing. While disabled, `robots.ts` allows public crawling so crawlers can observe the global `noindex` directives, continues to disallow `/admin/`, and does not advertise a sitemap or host. When enabled, it publishes the production sitemap and host.
- `sitemap.ts` returns no URLs outside production. In production it combines configured public routes, current reference-location routes and Firestore-backed FAQ routes.
- `next.config.ts` contains the redirects that are currently implemented. Historical matrices contain additional proposed redirects and must not be read as active configuration.

## Current route families

| Area | Current routes |
| --- | --- |
| Core products | `/`, `/photovoltaik`, `/stromspeicher`, `/wallbox`, `/klimaanlagen`, `/waermepumpen` |
| Energy content | `/energieloesungen`, `/energieloesungen/photovoltaik-fuer-unternehmen`, `/energieloesungen/gewerbespeicher`, `/energieloesungen/stromtarife-pv` |
| Service/company | `/service-und-wartung`, its `service-und-team`, `wartung-und-reinigung` and `finanzierung-und-foerderung` children; `/ueber-uns` |
| Conversion | `/kontakt`, `/jobs`, `/bewerbung`, `/kunden-werben-kunden` |
| References | `/referenzen`, `/referenzen/[location]` |
| Calculators | `/rechner/photovoltaik`, `/rechner/photovoltaik-kosten`, `/rechner/klimaanlage-kosten`, `/rechner/waermepumpe-kosten`, `/rechner/wallbox-kosten` |
| Configurator | `/konfigurator` plus product routes for `photovoltaik`, `stromspeicher`, `klimaanlage`, `waermepumpe` and `wallbox` |
| FAQ | `/faq`, `/faq/[category]`, `/faq/[category]/[slug]` |
| Legal | `/impressum`, `/datenschutz`, `/agb` |

Several pages intentionally use `noIndex`, including legal/privacy or unfinished business-content surfaces and product configurator wizard pages. Index decisions must be checked from current metadata, not inferred from an old spreadsheet.

## Historical evidence

- [Legacy URL migration](legacy-url-migration.md) preserves the curated Sprint-8 evidence and incident separation.
- [Sprint 3 migration matrix](seo/migration-matrix.md) and `02_energie-kraft_relaunch_migrationsmatrix_v2.xlsx` are historical planning snapshots.
- [Sprint 8 SEO baseline](sprint-8-seo-baseline.md) is a historical analytics/content baseline, not current performance reporting.

The legacy WordPress compromise/incident URLs are evidence for 404/410 and index cleanup decisions, not content opportunities. Never mass-redirect them to the homepage.

## Remaining cutover work

The new production platform and WordPress cutover are not complete. Before go-live, reconcile every legacy URL against current `next.config.ts`, current routes and the live WordPress response; validate redirect chains, canonicals, robots, sitemap and legal/business approvals. See [Production readiness](deployment.md).
