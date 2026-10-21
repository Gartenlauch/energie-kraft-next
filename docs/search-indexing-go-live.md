# Indexierungsfreigabe – Sprint 12.9d

Stand: 21.10.2026. Keine Bereitstellung oder Domain-/DNS-Änderung durchgeführt.

## Ein globaler Schalter

`isSearchIndexingEnabled()` wertet ausschließlich `SEARCH_INDEXING_ENABLED` aus. Nur der exakte String `"true"` gibt öffentliche Seiten frei. Alle anderen Werte einschließlich fehlender Konfiguration setzen globale Noindex-Header und Noindex-Metadaten. Es gibt keine Host-, Forwarded-Header-, Protokoll- oder `NEXT_PUBLIC_SITE_ENV`-Prüfung für diese Entscheidung und keine Ausnahme vom globalen Header für die Bewertungsseite oder deren Bild.

Bei Freigabe entfallen die globalen Noindex-Header und -Metadaten. Individuelle Noindex-Regeln für Datenschutz, Admin einschließlich Anmeldung, Produkt-Konfiguratoren und Bewertungsaufruf bleiben erhalten. robots.txt bewirbt bei Freigabe die Produktions-Sitemap; Canonicals und Sitemap-URLs bleiben auf `https://www.energie-kraft.de`. Redirects und Tracking bleiben unverändert.

`apphosting.yaml` enthält `SEARCH_INDEXING_ENABLED="true"` für BUILD und RUNTIME. Beide müssen denselben Wert verwenden: Next.js erzeugt die Header-Regeln beim Build. Änderungen des Schalters benötigen daher einen neuen Build mit anschließendem Rollout.

## Verbindliche Voraussetzung vor dem Rollout

Der vereinfachte Code unterscheidet bewusst keine Domains. Solange andere Domains dieselbe Anwendung ausliefern, darf dieser Stand mit aktiviertem Schalter nicht produktiv veröffentlicht werden.

Vorher separat auf Plattformebene erledigen und prüfen:

- `review.energie-kraft.de` aus der produktiven Zuordnung entfernen.
- Die technische App-Hosting-Standarddomain `energie-kraft-next--energie-kraft-next.europe-west4.hosted.app` deaktivieren.
- Direkten Cloud-Run-Zugriff gesperrt halten.
- `energie-kraft.de` permanent auf `https://www.energie-kraft.de` weiterleiten; dabei Pfad und Query erhalten.
- Sicherstellen, dass keine weiteren Preview-/Alternativdomains denselben produktiven Inhalt ausliefern und HTTPS auf Plattformebene durchgesetzt wird.

Individuelle Seitensperren und diese Domainvoraussetzungen werden durch den globalen Schalter nicht ersetzt.

## Gezielte lokale Prüfung

`node scripts/search-indexing-http-qa.mjs` startet für beide Schalterstellungen echte lokale Next.js-Server in einer temporären Quellkopie. Die echten Seiten, Layouts, Metadaten und Header-/Redirect-Regeln bleiben unverändert. FAQ- und Bewertungsdatenadapter erhalten leere Testfixtures, der Settings-Datenadapter liefert die bestehenden Konfigurator-Standardwerte. Produktive Firebase-Daten werden nicht abgefragt. Die Prüfung umfasst HTTP-Header, gerenderte HTML-Metadaten, Startseite, Produktseiten, individuelle Ausschlüsse, robots.txt, Sitemap, Canonicals und bestehende Redirects. Die Ergebnisse und Serverlogs liegen im ausgegebenen temporären Verzeichnis; vorhandene Repository-Artefakte werden nicht überschrieben.

Diese lokale Prüfung ersetzt nicht die Kontrolle der später separat vorgenommenen Plattform- und Domainbereinigung.
