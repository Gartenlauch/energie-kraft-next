# Sprint 12.4 – Google-Bewertungen und Consent

Stand: 20. Oktober 2026. Lokale Implementierung; keine Veröffentlichung oder rechtliche Freigabe.

## Änderungen

- `src/components/marketing/customer-reviews-section.tsx`: vollständige Bewertungsdarstellung nur nach gültiger Freigabe. Ohne Freigabe markenkonformer Platzhalter mit verständlicher Erklärung und dem Button „Google-Bewertungen aktivieren“. Ein Klick erteilt ausschließlich die zusätzliche Bewertungen-Freigabe und erhält vorherige Entscheidungen. Nach Tastaturaktivierung wandert der Fokus zur Überschrift. Anbieterfehler/leere Daten behalten das bisherige Verhalten ohne Bewertungsabschnitt.
- `src/lib/consent/client.ts`: abonnierbare bestehende Consent-Ereignisse. Die Komponente liest die vorhandene validierte Entscheidung mit `useSyncExternalStore`; der Server rendert immer gesperrt. Kein zusätzlicher Consent-Speicher. Ablauf, Änderungen anderer Tabs und Widerruf werden vom bestehenden Manager signalisiert.
- `src/components/consent/consent-manager.tsx`: veralteten Konflikthinweis durch die Beschreibung der tatsächlich angeschlossenen Sperre ersetzt. Kategorien, Gültigkeitsdauer und Tracking-Schalter unverändert.
- `src/app/(site)/datenschutz/page.tsx`: Abschnitt 8 beschreibt Freischaltung, externe Übertragung und Widerruf. Nur die unmittelbar überholten Konfliktverweise im Entwurfshinweis und Abschnitt 9 mitkorrigiert. Allgemeiner Entwurfsstatus und Noindex bleiben erhalten.
- `tests/unit/google-reviews-consent.test.ts`: gezielte Komponententests mit echtem Consent-Manager und bestehendem Vitest/jsdom-Muster.
- `scripts/sprint124-reviews-consent-browser.mjs`: bestehendes Headless-Chrome/CDP-Muster für die gezielte Netzwerkkontrolle übernommen. Eine vorübergehende lokale Testseite verwendet echte Anwendungskomponenten mit ausdrücklich synthetischer Rezension; sie wird im `finally` entfernt. Das Skript verweigert externe Zielhosts und überschreibt keine vorhandene Route.

Places-Adapter, vollständiges Rezensionenlayout, Autorenbilder/-links, Bewertungstexte, Google-Attribution und Quellenlinks bleiben erhalten. Kein Proxy, kein Bildspeicher, keine zusätzliche Abhängigkeit. GA4/Ads bleiben unverändert deaktiviert.

## Verhalten

| Entscheidung | Anzeige / externe Browserabrufe des Moduls |
| --- | --- |
| Erstbesuch, Ablehnung, ungültige oder abgelaufene Entscheidung | Platzhalter; keine externen Google-Bild-/Ressourcenabrufe |
| „Alle akzeptieren“ | Rezensionen einschließlich Autorenbildern ohne weiteren Klick |
| Nur „Google-Bewertungen“ oder Aktivierungsbutton | Rezensionen sichtbar; keine zusätzliche Statistik-/Marketingfreigabe |
| Widerruf | Rezensionen/Bildelemente unmittelbar entfernt; keine neuen externen Abrufe des Moduls |
| Navigation oder Neuladen | Vorhandene gültige Entscheidung automatisch berücksichtigt; SSR bleibt bis zur Prüfung gesperrt |

## Prüfergebnisse

- **39 Tests in drei Dateien bestanden:** neue Komponententests sowie `google-reviews-section.test.ts` und `consent.test.ts`. Erfasst sind insbesondere SSR ohne Bild-/Preload-Elemente, Gesamt-/Einzelfreigabe, Erhalt anderer Kategorien, Widerruf, Remount, native Storage-Ereignisse über den realen Manager, fehlerhafte/abgelaufene Auswahl und Attribution.
- **Echter Headless-Chrome-Netzwerktest lokal bestanden:** Erstbesuch, Gesamtfreigabe, Ablehnung, Einzelfreigabe über Einstellungen und Aktivierungsbutton, Widerruf, Navigation, Reload nach Freigabe/Ablehnung und abgelaufene Auswahl bei Manager-Aktualisierung. Keine Google-Requests in gesperrten Prüfphasen; Google-Bildrequest nach erlaubter Freigabe mit HTTP 200. Keine GA4-/Ads-Requests und keine JavaScript-Laufzeitausnahmen.
- **Barrierefreiheit/Mobil:** echte Enter-Aktivierung, anschließender Überschriftenfokus, Tab-Fokus mit sichtbarer Kontur, Touch-Ziel mindestens 44 px, kein horizontaler Überlauf bei 390 px. Mobilen Screenshot geprüft.
- Gezieltes ESLint für geänderte Komponenten, Consent-Helfer, neue Testdatei, Browser-Skript und Datenschutzseite: bestanden. `npm run typecheck` (`next typegen && tsc --noEmit`): bestanden. `git diff --check` für die betroffenen vorhandenen Anwendungsdateien: bestanden; lediglich Git-Hinweise zur LF/CRLF-Konvertierung. Kein Build und keine vollständige Testsuite.

Nachweise: `artifacts/sprint12-4-google-reviews-consent/qa.json` und `mobile-placeholder.png`.

## Grenzen und offene Freigabe

Der lokale Places-Abruf lieferte während der Prüfung keine Bewertungen. Der Netzwerktest nutzt daher eine klar gekennzeichnete synthetische Rezension mit einer generischen Google-Testbildadresse und dem echten Consent-/Rezensionencode. Er belegt den Browserabruf und seine Sperre, nicht die Verfügbarkeit der produktiven Places-Konfiguration oder jedes tatsächlichen Autorenbildes. `review.energie-kraft.de` wurde nicht mit dieser Änderung bereitgestellt oder als aktualisierte Fassung geprüft.

Schon vor Widerruf gestartete Übertragungen lassen sich nicht rückgängig machen; der Widerruf verhindert neue Abrufe. Anbieter-/Vertrags-/Drittlandangaben und die allgemeine Datenschutzfreigabe bleiben offen. Kein Geschäftsvorgang abgesendet, keine produktiven Daten verändert, kein Commit/Push/Deployment. Bestehende fremde Änderungen und Artefakte unverändert.
