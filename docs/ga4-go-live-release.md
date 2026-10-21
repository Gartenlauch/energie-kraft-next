# Sprint 12.9 – gemeinsamer Go-live-Release-Kandidat

Stand: 21.10.2026. Ausgangs-HEAD: `c4327425a5032ebbc2c3a8776b470c85dba4cbba`.
Kein Commit, Push, Deployment, DNS-Eingriff oder Firebase-Datenzugriff durchgeführt.

## Umsetzung

- Bestehender GA4-Webstream `G-5XEMD60ZRV`, direkte Google-Tag-Einbindung ohne GTM-Container. Basic Consent Mode v2: kein Google-Skript und keine Analytics-Übermittlung vor Statistik-Zustimmung.
- Aktivierung nur bei `NEXT_PUBLIC_SITE_ENV=production`, Browserprotokoll `https:` und exaktem Browserhost `www.energie-kraft.de`. Review, Firebase, localhost und Preview bleiben gesperrt.
- Vorhandener Consent-Manager und sein `dataLayer` werden wiederverwendet. Revision 2 verwirft alte Entscheidungen aus Revision 1; alle optionalen Kategorien werden erneut abgefragt. 180 Tage Gültigkeit unverändert.
- Nur öffentliche, kontrollierte Pfade werden erfasst. Eigene `page_view`-Events bei Zustimmung und App-Router-Navigation; keine Formulareingaben, Suchparameter, Fragmente, variablen Dokumenttitel oder Referrer. Die Seitentitel-Dimension lautet bewusst einheitlich „Energie-Kraft Süd“. Query-Navigation kann einen neuen Aufruf auslösen, ihre Werte werden nicht übertragen.
- `send_page_view=false`; eine Initialisierung je Browserdokument und Deduplizierung wiederholter Effects. Während das Tag lädt, werden keine Messereignisse vorgemerkt. Vor einer verweigerten Consent-Aktualisierung wird `ga-disable-G-5XEMD60ZRV` synchron gesetzt. Erneute Zustimmung verwendet das bereits geladene Tag. Beim Verlassen des öffentlichen Layouts wird pausiert.
- Widerruf entfernt erreichbare GA-Cookies einschließlich Legacy-Namen für Host-/Domain-Speicherung und erreichbare Pfade. Cookies anderer Hosts, nicht sichtbarer Pfade und bereits übermittelte Daten können damit nicht rückwirkend gelöscht werden. Neue Analytics-Cookies werden auf höchstens 180 Tage ohne laufende Verlängerung begrenzt.
- Ads-Consent-Signale bleiben immer `denied`; Google Signals und Werbepersonalisierung bleiben ausgeschaltet. Keine Ads-, Remarketing-, Conversion- oder zusätzlichen Interaktions-Tags. Google-Bewertungen bleiben unabhängig.
- Cookie-Dialog aktualisiert, öffentlicher vorläufiger Freigabehinweis entfernt. Datenschutzerklärung gezielt in Abschnitt 10 und beim Widerruf in Abschnitt 12 angepasst. Keine bestätigte Property-Aufbewahrungsfrist und keine ungeprüfte Transfergarantie behauptet.

## Nachweise und Grenzen

- Gezielte Unit-Tests: `npm run test -- tests/unit/consent.test.ts tests/unit/analytics.test.ts`: **49 Tests bestanden**, einschließlich echter React-Strict-Mode-Montage, verzögertem Tag-Laden, Host-/Umgebungsgrenzen und Widerruf vor dem Consent-Update.
- `npm run typecheck`, Repository-ESLint sowie abschließendes ESLint für alle neuen/geänderten GA4-Dateien und `git diff --check`: bestanden.
- Genau ein neuer Produktionsbuild mit den nicht geheimen Werten aus `apphosting.yaml`, erfolgreich einschließlich TypeScript und Suspense-/App-Router-Einbindung.
- `node scripts/ga4-browser-qa.mjs`: Produktionsbuild und gezielte Headless-Chrome-/HTTP-Prüfung. Für Wiederholung gegen denselben unveränderten Build: `node scripts/ga4-browser-qa.mjs --skip-build`.
- 15 Browser-/HTTP-Fälle erfolgreich: Erstbesuch, notwendige Dienste, Zustimmung/initialer Aufruf, URL-Datensparsamkeit, echter Next.js-Linkwechsel, Widerruf/Cookie-Löschung, erneute Zustimmung/eine Initialisierung, alte Revision, unabhängige Bewertungsfreigabe, Review, App Hosting, Firebase Hosting (beide Domainfamilien), localhost und gerenderter Datenschutztext.
- Dabei wurden HTTPS-Produktiv-/Review-/Firebase-Origins ausschließlich lokal im Browser simuliert. Die Anwendung und ihr Consent-Dialog laufen aus dem echten Produktionsbuild; das Google-Tag wird durch ein kontrolliertes Testdouble ersetzt, dessen Beacons ebenfalls abgefangen werden. Alle externen Anfragen der getesteten Tabs sind blockiert. Das belegt App-Integration und Befehlsfolge, keine echte Google-Verarbeitung, Empfangsbestätigung oder Property-Konfiguration.
- Lokaler maschinenlesbarer Nachweis: `artifacts/ga4-qa/results.json`. Dieser generierte Nachweis und Browser-/npm-Zwischendateien gehören nicht in den Release-Commit.

## Indexierung und Weiterleitungen

Die sieben zuvor geänderten versionierten Indexierungsdateien bleiben unverändert erhalten. `SEARCH_INDEXING_ENABLED="true"` bleibt für BUILD und RUNTIME gesetzt. Request-Host-/Protokollgrenzen, seitenspezifisches Noindex, Canonicals, Sitemap-Generator und alle 27 vorhandenen permanenten Redirect-Regeln werden durch GA4 nicht verändert. Consent ist keine Eingangsgröße der Indexierung.

Die vorhandenen Nachweise mit 60 Unit- und 22 HTTP-Fällen wurden nicht unnötig wiederholt: siehe [Indexierungsfreigabe](search-indexing-go-live.md). Hinter App Hosting muss gesondert geprüft werden, ob `x-forwarded-proto` den ursprünglichen externen Transport zuverlässig wiedergibt. Eine belastbare HTTP-Erkennung auf der Plattform wird durch die lokale Simulation nicht nachgewiesen.

## Vor dem manuellen Rollout noch bestätigen

1. Im bestehenden GA4-Webstream **Enhanced Measurement / Optimierte Analysen vollständig ausschalten**, einschließlich automatischer History-Seitenaufrufe, Formular-, Such-, Scroll- und Klickereignisse. `send_page_view=false` allein verhindert Googles zusätzliche History-Messung nicht. Keine zusätzlichen verbundenen Google-Tag-Ziele, Ads-Tags oder automatischen Event-Regeln aktivieren. Dies wurde im Konto nicht geprüft oder geändert.
2. GA4-Datenaufbewahrung: **Zielwert 14 Monate**, tatsächlicher Wert noch unbestätigt. Auch die Option zur Rücksetzung der Aufbewahrung bei neuer Aktivität kontrollieren. Die öffentliche Erklärung benennt deshalb die maßgebliche Property-Einstellung statt eines erfundenen bestätigten Zahlenwerts.
3. Für das vorhandene Konto die geltenden Auftragsverarbeitungsbedingungen, Vertragspartei und konkret anwendbaren Garantien internationaler Übermittlungen intern bestätigen. Googles veröffentlichte Bedingungen sind belegt; ihre kontospezifische Annahme und konkrete Anwendung wurden nicht geprüft.
4. Nach manuellem Rollout bei gültigem SSL auf `https://www.energie-kraft.de` mit dem echten Google-Tag im Netzwerk prüfen: vor Zustimmung keine Google-Tag-/Analytics-Anfrage, nach Zustimmung genau ein `page_view`, pro Next.js-Wechsel genau ein weiteres, nach Widerruf keine weiteren Events/Cookies. Keine URL-Parameter/Formulardaten in Nutzlasten. Nach erneuter Zustimmung keine doppelte Initialisierung. Keine zusätzlichen Ziele oder automatisch erfassten Formular-/Such-/Interaktionsereignisse. Tag-Blocker als mögliche lokale Ursache unterscheiden.
5. Auf Review und dem tatsächlichen Firebase-App-Hosting-Host selbst nach „Alle akzeptieren“ keine GA4-Anfragen. Produktivhost/HTTPS-Weitergabe, Header-/HTML-Noindex auf Nichtproduktivhosts, Canonicals, robots.txt und sitemap.xml sowie seitenspezifische Sperren abnehmen.

## Exaktes Manifest für den gemeinsamen Release-Commit

Nur die folgenden 20 Dateien gehören zum vorbereiteten gemeinsamen Release. Keine pauschale Staging-Anweisung; alle übrigen bereits vorhandenen Änderungen und Artefakte bleiben außerhalb.

Bereits vorbereitete Indexierungsdateien (einschließlich vorhandener Nachweise):

```text
apphosting.yaml
docs/deployment.md
docs/search-indexing-go-live.md
next.config.ts
scripts/search-indexing-http-qa.mjs
src/app/layout.tsx
src/app/robots.ts
src/config/search-indexing.ts
tests/unit/search-indexing.test.ts
```

GA4-/Consent-Dateien:

```text
src/app/(site)/layout.tsx
src/components/consent/consent-manager.tsx
src/components/consent/google-analytics.tsx
src/lib/consent/analytics.ts
src/lib/consent/client.ts
src/lib/consent/policy.ts
```

Datenschutztext:

```text
src/app/(site)/datenschutz/page.tsx
```

Neue beziehungsweise angepasste Tests und Release-Dokumentation:

```text
docs/ga4-go-live-release.md
scripts/ga4-browser-qa.mjs
tests/unit/analytics.test.ts
tests/unit/consent.test.ts
```

Nicht Bestandteil: sämtliche `artifacts/`-Verzeichnisse, `docs/gl-aenderungen-2026-10-15.md`, `firebase-export-1792508776887SMzA2p/`, `public/images/photovoltaic/pv-monitoring-dashboard.png`, `design-input/` und `migration-input/`. Vorhandene fremde Artefakte wurden nicht verändert.

Abschlussstatus: 13 geänderte versionierte Dateien und sieben neue Release-Dateien aus dem obigen Manifest; alle Änderungen sind ungestaged. HEAD bleibt `c432742`. Die übrigen unversionierten Dateien/Verzeichnisse bleiben separat und ungestaged.

## Verifizierte Anbieterquellen

Am 21.10.2026 anhand offizieller Primärquellen geprüft:

- [Basic und Advanced Consent Mode](https://developers.google.com/tag-platform/security/concepts/consent-mode)
- [Manuelle Seitenaufrufe und zusätzliche History-Messung](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Google-Tag-Abschaltung und Datenschutzparameter](https://developers.google.com/tag-platform/security/guides/privacy)
- [GA4-Datenaufbewahrung und aggregierte Berichte](https://support.google.com/analytics/answer/7667196?hl=de)
- [IP-Verarbeitung bei Zugriffen aus EU, Schweiz und UK](https://support.google.com/analytics/answer/12017362?hl=de)
- [Google-Analytics-Vertragspartei](https://marketingplatform.google.com/about/analytics/terms/de/)
- [Anbieteranschrift](https://www.google.ie/intl/de/contact/impressum.html)
- [Datenverarbeitungsbedingungen und internationale Übermittlungen](https://business.safety.google/adsprocessorterms/)
- [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html)
