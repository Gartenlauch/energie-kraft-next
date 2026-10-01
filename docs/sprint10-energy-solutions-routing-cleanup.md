# Sprint 10 – Energielösungen: Routing-Cleanup

Stand: 01.10.2026. Reines Informationsarchitektur-/Routing-Refactoring.

## Architektur und Redirect-Matrix

Die Startseite übernimmt bereits die Funktion des Energie-Hubs. Die redundante
Landingpage entfällt; die drei eigenständigen Angebote bleiben als Top-Level-Seiten
erhalten. „Energielösungen“ bleibt ausschließlich eine Navigationsgruppe.

| Alte URL | Finales Ziel | Status |
| --- | --- | --- |
| `/energieloesungen` | `/` | permanent, 308 |
| `/energieloesungen/photovoltaik-fuer-unternehmen` | `/photovoltaik-fuer-unternehmen` | permanent, 308 |
| `/energieloesungen/gewerbespeicher` | `/gewerbespeicher` | permanent, 308 |
| `/energieloesungen/stromtarife-pv` | `/stromtarife-pv` | permanent, 308 |

Alle bisherigen Redirects in `next.config.ts` wurden geprüft: Keiner hatte eines
der entfernten Ziele als Destination. Die vorhandenen legitimen Legacy-Redirects
für Photovoltaik, Speicher, Wallbox und Wärmepumpe bleiben unverändert. Kein
Catch-All, keine Migration von unbekannten oder kompromittierten URLs.

Unverändert: `/photovoltaik`, `/stromspeicher`, `/waermepumpen`, `/klimaanlagen`,
`/wallbox` sowie Service-, Referenz-, Unternehmens- und Kontaktrouten.

## Dateien und Inhaltsschutz

Gelöscht: `src/app/(site)/energieloesungen/page.tsx` und das danach leere Verzeichnis.

Verschoben, jeweils einschließlich aller lokalen Dateien:

- `energieloesungen/photovoltaik-fuer-unternehmen/page.tsx` → `photovoltaik-fuer-unternehmen/page.tsx`
- `energieloesungen/gewerbespeicher/page.tsx` → `gewerbespeicher/page.tsx`
- `energieloesungen/gewerbespeicher/gewerbespeicher-sections.tsx` → `gewerbespeicher/gewerbespeicher-sections.tsx`
- `energieloesungen/stromtarife-pv/page.tsx` → `stromtarife-pv/page.tsx`

Alle Pfade sind relativ zu `src/app/(site)/`. Vergleich mit HEAD bestätigt identische
Inhalte der vier verschobenen Dateien. `git mv` war wegen des schreibgeschützten
Git-Index nicht möglich; stattdessen wurden die Dateien im Arbeitsverzeichnis
verschoben. Nichts gestagt, committed, gepusht oder deployed.

Geändert: `next.config.ts`, `src/config/routes.ts`, Header, Footer,
`src/content/sprint8-pages.ts`, `src/content/pages/gewerbespeicher.ts`,
`src/content/pages/photovoltaik.ts` und `src/app/(site)/ueber-uns/page.tsx`.
Bestehende Unit-Tests und fünf Browser-Prüfskripte verwenden die neuen Ziele.
Neue Tests: `tests/unit/energy-routing.test.ts` und
`scripts/sprint10-energy-routing-browser.mjs`.

Der Hub-Contentblock und sein Breadcrumb-Helper sind entfernt. Produkttexte,
Meta-Titles, Descriptions, H1, Bilder, Designs, FAQ-Zuordnungen und
Sitemap-Prioritäten der erhaltenen Seiten bleiben unverändert.

## SEO, Sitemap und Navigation

Die drei Canonicals entsprechen den finalen Top-Level-URLs. WebPage-JSON-LD und
Breadcrumb-JSON-LD verwenden dieselben zentralen SEO-Daten. Breadcrumbs zeigen
Startseite → aktuelle Seite, ohne künstliche Zwischenebene.

Die Produktions-Sitemap wird im Unit-Test durch die tatsächliche Sitemap-Funktion
generiert, mit isoliertem FAQ-Repository-Mock. Alle acht geforderten Energie-URLs
sind enthalten; keine Redirect-Quelle ist enthalten. Der bestehende Schutz für
lokale/pre-launch Sitemaps bleibt unverändert.

Desktop und Mobile verwenden weiterhin die gemeinsame Energy-Linkliste.
„Energielösungen“ bleibt ein Button ohne eigenes Linkziel. Die Aktivmarkierung
folgt den tatsächlichen Zielrouten; die Sonderbehandlung für den Hub entfällt.
Footer-Gruppenname und Linkumfang bleiben erhalten. Homepage-Links aktualisieren
sich über `PUBLIC_ROUTES`; der Homepage-Inhalt wurde nicht bearbeitet.
Der bisherige Hub-Link auf „Über uns“ zeigt direkt auf die Startseite.

## Alt-URL-Suche und Klassifizierung

Repository-weite Suche mit `rg --hidden` nach alten URLs, Route-Zugriff und den
entfernten Content-/Breadcrumb-Bezeichnern. Ausgenommen: `.git`, `node_modules`,
`.next`, `artifacts`, `design-input`, `migration-input`, `.source-assets`.
Rohquellen und vorhandene QA-Artefakte wurden nicht verändert.

Verbleibende Treffer sind ausschließlich:

- `next.config.ts`: acht explizite legitime Redirect-Quellen.
- `tests/unit/energy-routing.test.ts`: Mappings und negative Sicherheitsprüfungen.
- Vorhandene Photovoltaik-, Stromspeicher- und Wärmepumpen-Unit-Tests:
  unveränderte Legacy-Redirect-Quellen.
- Neues Routing-Browserskript: alte Redirect-Quellen, unbekannte URL als 404-Test
  sowie negative Prüfungen gegen alte Links und strukturierte Daten.
- Bestehende Photovoltaik-/Stromspeicher-Browserskripte: Legacy-Redirect-Tests.
- Historische Migrationstabellen, SEO-Baseline und Validierungsberichte:
  ausdrücklich als historischer Stand gekennzeichnet, mit Verweis auf dieses Dokument.
- Dieses Dokument: Migrationsmapping und Dateihistorie.

Keine Treffer in aktiven Anwendungsquellen unter `src/`.

## Verifikation

- 74 Unit-Testdateien / 515 Tests bestanden.
- Functions-Lint und Functions-Build bestanden.
- 30 lokale Firestore-/Storage-Regeltests bestanden.
- Vollständiges `npm run check:all`: bestanden, einschließlich Produktionsbuild.
- Browser-/HTTP-QA: bestanden, Chrome headless gegen den lokalen Produktionsbuild
  auf Port 3020, bei 1440 × 900 und 390 × 900 Pixeln.
- `git diff --check`: bestanden. Git-Status, Diff-Statistik und Dateiliste geprüft.
- Neues Browser-Prüfskript zusätzlich separat mit ESLint geprüft: bestanden.

Alle zwölf geforderten Regression-Routen antworten mit 200 und zeigen H1 und
Canonical. Kein horizontaler Overflow, keine Browser-Ausnahmen, keine fehlerhaften
Browser-Netzwerkanfragen. Auf jeder Route wurden Desktop-/Mobilmenü geöffnet,
alle acht Energieziele und die aktive Gruppe geprüft. Footer-Ziele, beide
Homepage-CTAs und die gegenseitige Verlinkung der Gewerbeseiten sind korrekt.
Die drei neuen Seiten liefern korrekte Canonicals, WebPage-JSON-LD und zweistufige
Breadcrumb-Listen ohne alte URL.

Alle vier Redirects wurden jeweils ohne Zusatz, mit `?utm_source=test` und mit
Endslash geprüft. Ohne Slash: 308 → 200, Query bleibt erhalten. Mit Slash:
308 zur normalisierten alten URL → 308 zum finalen Ziel → 200. Dieser zusätzliche
Normalisierungsschritt stammt von Next.js bei `trailingSlash: false`; keine
fachliche Redirect-Kette und keine Schleife. Ein unbekannter Unterpfad liefert 404.

Der erste Lauf traf veraltete `.next/dev/types` mit alten Routen; nur diese
generierten Dateien wurden entfernt. Der zweite Lauf scheiterte am Sandbox-
Prozessstart von Vitest (`EPERM`). Der vollständige Lauf außerhalb der Sandbox
wurde automatisch freigegeben. Keine Produktionsressourcen verwendet.

Der erste Browserversuch nach `check:all` traf den bereits beendeten Test-Emulator;
die Startseite antwortete deshalb mit 500. Der vollständige erfolgreiche Browserlauf
verwendete anschließend einen temporären Demo-Firestore-Emulator ohne Datenimport.
FAQ-Datensätze wurden nicht verändert; die bestehenden FAQ-Zuordnungen sind durch
Quellvergleich und Tests erhalten. Dies ist eine Routing-/Navigationsabnahme,
keine erneute fachliche FAQ-Inhaltsabnahme. Der Demo-Emulator wurde danach beendet.

## Offene Punkte

Keine offenen Punkte für dieses Routing-Paket. Vorhandene `artifacts/`,
`.source-assets/` und lokale Quelldaten bleiben unberührt. Alle Änderungen sind
unstaged; Git zeigt die Verschiebungen derzeit als Löschungen plus neue Dateien.
