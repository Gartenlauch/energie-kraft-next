# Indexierungsfreigabe für den manuellen Go-live-Rollout

Stand: 21.10.2026. Kein Deployment, keine DNS- oder Domainänderung.

`apphosting.yaml` enthält nach erfolgreicher lokaler Prüfung `SEARCH_INDEXING_ENABLED="true"` für BUILD und RUNTIME. Erst ein späterer manueller Rollout aktiviert diese Konfiguration auf dem Backend.

Indexierung setzt gleichzeitig den exakten Schalterwert `true`, `NEXT_PUBLIC_SITE_ENV=production`, den tatsächlichen Host `www.energie-kraft.de` und das HTTPS-Protokoll voraus. DNS-Hostnamen sind ohne Beachtung der Groß-/Kleinschreibung geprüft, optional ist der HTTPS-Standardport 443 erlaubt. `Forwarded` und `X-Forwarded-Host` können keinen fremden Host freigeben. HTTP sowie fehlende oder mehrdeutige Protokollwerte bleiben gesperrt. Bei TLS-Terminierung liefert die Plattform `x-forwarded-proto`; diese muss den externen Transport korrekt wiedergeben.

Review, der konkrete App-Hosting-Host, Firebase Hosting, sonstige Preview-Adressen, Apex und localhost erhalten weiterhin `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` und HTML-Noindex. Umgebungen mit `NEXT_PUBLIC_SITE_ENV=local`/`ci` oder fehlendem Wert bleiben auch bei vorgegebenem Produktionshost gesperrt.

Auf dem erlaubten Produktionshost enthalten öffentliche Seiten keine globale Noindex-Metadaten oder Noindex-Header. Seitenspezifische Sperren bleiben bestehen: Datenschutz, Admin einschließlich Anmeldung, Produkt-Konfiguratoren und Google-Bewertungsaufruf. Die Sitemap enthält diese ausgeschlossenen Seiten nicht. Die permanent umgeleitete Wartungs-Unterseite behält ebenfalls ihre ursprüngliche Metadata-Entscheidung.

robots.txt erlaubt öffentliches Crawling, damit Bots auch auf gesperrten Hosts Noindex erkennen können, und sperrt `/admin/`. Nur auf dem freigegebenen HTTPS-Host werden Produktionshost und Sitemap beworben. Canonicals und Sitemap-URLs verwenden weiterhin ausschließlich `https://www.energie-kraft.de`. Indexierungsentscheidungen verwenden keine Consent-Cookies oder Analytics-/Marketing-Freigaben.

## Durchgeführte Prüfungen

- `npm run test -- tests/unit/search-indexing.test.ts tests/unit/legacy-final-redirects.test.ts`: 60 Tests bestanden. Einschließlich tatsächlicher Next.js-Header-Matcher, Host-/Umgebungs-/Protokoll-Isolation, ausgeschlossener Metadata, Canonicals und Sitemap-XML mit einem gemockten FAQ-Katalog (43 URLs). Kein produktiver FAQ-Datenbestand abgefragt.
- `node scripts/search-indexing-http-qa.mjs`: genau ein lokaler Produktionsbuild einschließlich TypeScript erfolgreich; anschließend 22 HTTP-Prüffälle bestanden. 12 Host-/Protokollvarianten mit tatsächlichen HTML-Metadaten, Headern, Canonicals und robots.txt, drei ausgeschlossene Seiten und sieben finale 308-Redirects; zusätzlich Admin-Weiterleitung zur Anmeldung geprüft. Alle HTTP-Anfragen ohne Consent-Cookie. Nachweise: `artifacts/search-indexing-qa/http-results.json`.
- Sitemap-Generator und Next.js-XML-Serialisierung gezielt getestet; der Produktionsbuild stellt `/sitemap.xml` als dynamische Route bereit. Kein HTTP-Abruf des produktiven FAQ-Katalogs Bestandteil dieser Prüfung.
- ESLint für die geänderten TypeScript-/JavaScript-Dateien und `git diff --check` erfolgreich. Abschließend den YAML-Schalterwert `true` und Verfügbarkeit für BUILD/RUNTIME geprüft.

Alle vorhandenen Redirect-Einträge in `next.config.ts` bleiben unverändert. Der vorhandene finale Redirect-Test deckt die sieben zuletzt abgeglichenen Altpfade und Schleifenfreiheit ab. Ein separat als Sprint 12.8 bezeichneter Abgleich ist im Repository nicht dokumentiert; dieser externe Nachweis kann daher nicht als geprüft bestätigt werden.

## Vor der manuellen Domainumschaltung

Auf dem später bereitgestellten Release Host-/HTTPS-Weitergabe und die sichtbaren Antworten erneut prüfen: www über HTTPS ohne globale Noindex-Sperre, Review/Firebase weiterhin gesperrt, korrekte Canonicals sowie robots.txt und sitemap.xml. Eine falsch weitergegebene Host-/Protokollangabe schließt die Indexierung sicher, kann aber die gewünschte Freigabe verhindern. Die lokale Prüfung belegt den Code; sie ersetzt keine Abnahme der späteren Plattform-/Domainkonfiguration.
