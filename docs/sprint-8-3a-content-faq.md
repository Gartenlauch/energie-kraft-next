# Sprint 8.3A – Content und FAQ

## Redaktionelle Entscheidungen

- Grundlage: öffentliche, fachlich plausible PV-, Batteriespeicher-, Wallbox- und Service-Texte des lokalen WordPress-Exports sowie `sprint-8-seo-baseline.md`. Keine Formulardaten oder SQL-Personendaten verwendet.
- Homepage: PV/Speicher bleiben zuerst. Das Legacy-Prinzip „mittags speichern, abends nutzen“ ersetzt den wiederholenden Vorteilsblock durch eine qualitative Energiefluss-Grafik. Keine Ertragszahlen, Autarkie- oder Ersatzstromgarantie.
- Photovoltaik: vorhandene Planung, Komponenten, Monitoring und regionale Referenzlinks behalten; Gleich-/Wechselstrom und kWp/kWh erklärt.
- Stromspeicher: zeitversetzte Nutzung aus Legacy mit vorhandener bedarfsgerechter Auslegung verbunden; Kapazität/Leistung erklärt und pauschale Ladepriorität korrigiert.
- Wärmepumpe: vorhandene Auslegungsinhalte behalten; saisonale Grenze der PV-Kombination konkretisiert.
- Klima: Split-/Multisplit-Erklärungen behalten; Dachgeschoss/Schlafzimmer als konkreten Planungskontext ergänzt.
- Wallbox: legitime Suchintention und Überschussladen erhalten; Standzeiten und Schnittstellen konkretisiert. Keine ungeprüften Modell-, Preis- oder bidirektionalen Ladeversprechen übernommen.
- Energielösungen/Gewerbe-PV: Fluss von Erzeugung zu Verbrauch und Bedeutung von Schichten, Wochenenden und Lastprofil konkretisiert.
- Service: nützliche Angaben für eine Störungsanfrage ergänzt.
- Jobs, Über uns und PV-Referenzen: bestehende Inhalte und regionale Struktur behalten; bereits übernommene öffentliche Jobinhalte nicht erneut ersetzt. Keine neuen Stellen, Teamidentitäten, Referenzkennwerte oder Unternehmenszahlen erfunden.
- Legacy-Fehlerseiten („verlaufen“) für Energielösungen und Service nicht übernommen. Veraltete Produktdaten, Garantien und Förderangaben ausgeschlossen.

## FAQ-System

Firestore `faqs` und `faqCategories` bleiben die einzige Laufzeitquelle. Der bestehende autorisierte Admin-Schreibweg bleibt erhalten; keine Rules- oder Functions-Änderung.

- `/faq`: globale Volltextsuche im geladenen öffentlichen Katalog, Kategorienfilter, Kategorie-Links und redaktionell ausgewählte Fragen. Suchzustand bleibt lokal; keine Query-/Filter-URLs.
- `/faq/[category]`: vollständiger veröffentlichter Bestand einer aktiven Kategorie. Leere Kategorien erhalten `noindex` und kommen nicht in die Sitemap.
- `/faq/[category]/[slug]`: Breadcrumb einschließlich JSON-LD, H1, Kurzantwort, ausführliche Antwort, bis zu fünf verwandte Fragen und Produktlink. Kein QAPage-Schema.
- Unveröffentlichte Einträge, inaktive und fehlende Kategorien werden auch aus Suche, verwandten Fragen und Sitemap ausgeschlossen. Audit-Daten bleiben serverseitig.
- Landingpages: maximal sechs Einträge nach bestehender Placement-Sortierung; dieselbe Auswahl wird im FAQ-JSON-LD verwendet. Kategorie-CTA und Detail-Links führen weiter.
- Neue optionale Felder: `slug`, `shortAnswer`, `relatedFaqIds`, `featured`, `sortOrder`. `answer` bleibt die Langantwort; `isPublished`, `categoryId` und `placements` bleiben erhalten.
- Neue Admin-Einträge erhalten einen lesbaren Slug mit eindeutiger Dokument-ID. Slug bleibt beim Bearbeiten stabil. Alte Dokumente ohne Slug verwenden ihre stabile Dokument-ID; keine Datenmigration erforderlich. Ein Wechsel der Kategorie ändert den Kategoriepfad und sollte nach Veröffentlichung redaktionell vermieden werden.
- Admin ergänzt nur Kurzantwort, verwandte IDs, Katalogsortierung und Hervorhebung. IDs sind bereits in der Eintragsübersicht sichtbar. Kategorien werden weiterhin im bestehenden Kategorien-Admin gepflegt.
- Verwandte Fragen: explizite veröffentlichte IDs zuerst, danach ergänzende Fragen derselben Kategorie; keine Selbstverweise oder Duplikate.

## Lokaler repräsentativer Bestand

27 Einträge: Photovoltaik 7, Stromspeicher 5, Wärmepumpe 5, Klimaanlage 5, Wallbox 5. Jede Kategorie hat eine hervorgehobene Frage. Die sieben PV-Fragen prüfen die Begrenzung auf sechs Landingpage-Einträge. Service erhält vorerst keine eigene Kategorie.

Import bei laufendem lokalem Firestore-Emulator:

```powershell
$env:FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'
node scripts/emulators/seed-faq-sprint83a.mjs
```

Das Skript akzeptiert nur Loopback-Hosts und das feste Demo-Projekt. Es legt ausschließlich fehlende Dokumente an, erhält bestehende redaktionelle Änderungen und kann wiederholt ausgeführt werden. Die Importdaten unter `scripts/emulators/` werden nicht von der Website importiert; es gibt keinen statischen Content-Fallback. Emulator-Daten sind ohne Export flüchtig.

## Sprint 8.3B

Den großen FAQ-Bestand redaktionell ausbauen, Kurzantworten für gegebenenfalls vorhandene Alt-Einträge pflegen, Placements und verwandte Fragen kuratieren. Produktbezogene Daten und zeitabhängige Aussagen vor Veröffentlichung aktuell verifizieren. Produktive Übernahme ist ein separater, ausdrücklich zu beauftragender Schritt. Medien-/Layoutrevision bleibt Sprint 8.4.
