# Referenzbilder: freigegebener Import

Die versionierte Quelle für Importentscheidungen ist
`scripts/reference-import-manifest.json`. Die Website liest weiterhin ausschließlich
`src/generated/reference-projects.generated.ts` über den bestehenden Content-Adapter.
Lokale Phase-A/B-Artefakte sind keine Laufzeitabhängigkeit.

## Ein neues Bild aufnehmen

1. Original unverändert unter `design-input/reference-originals/` bereitstellen.
2. Aufnahme und mögliche Dubletten visuell prüfen. Andere Perspektiven derselben
   Anlage sind zulässig, Zuschnitt-/Auflösungsvarianten derselben Aufnahme zählen einmal.
3. Expliziten Manifest-Eintrag ergänzen: Quellpfad relativ zum Originalverzeichnis,
   SHA-256, tatsächlicher Ort, Zielgruppe, kWp, Kundentyp mit Nachweisstatus,
   Daten-/Kundenfreigabe, stabile Projekt-ID und öffentlicher Bildpfad.
   `customerType: null` / `customerTypeStatus: "unknown"` veröffentlicht keinen Kundentyp.
   `capacityStatus: "filename-unverified"` kennzeichnet nicht fachlich bestätigte Dateinamenwerte.
   `assignmentStatus: "user-approved-phase-b"` bezeichnet den ausdrücklich freigegebenen
   Zuordnungsstand dieser Migration. Künftige Änderungen an diesem Stand erfordern
   ebenfalls eine fachlich freigegebene Zuordnung und Dublettenprüfung.
4. Gruppen-Titelbild über `coverProjectId` auswählen. Aufnahmeort, Gruppe, ID und
   Assetpfad sind unabhängig. Bestehende IDs und Bildpfade bei Umgruppierungen beibehalten.
5. `npm run images:references -- --check` prüft ohne Schreibzugriff auf Ausgaben.
   Exit 1 mit `createdImages`/`manifestChanged` bedeutet, dass Ausgaben noch zu erzeugen sind.
   Anschließend `npm run images:references` ausführen und Änderung prüfen.
6. Ein Wiederholungslauf muss `createdImages: []` und `manifestChanged: false` liefern.

Der Parser unterstützt Leistungsangaben vor und nach dem Ort und erkennt nur
explizites Privat/Gewerbe. Individuelle Korrekturen (Anring → Ainring), Ansichtsziffern
und übergeordnete Gruppierungen gehören ins Manifest. Der Import rät keine Orte aus
Ordnernamen. `neue-referenzen` ist ein Quell-Sammelordner, keine veröffentlichte Gruppe.

## Schutzmechanismen

- Sämtliche lokalen Rasterquellen müssen zugeordnet sein, auch ausgeschlossene Dubletten.
  Nicht zugeordnete oder fehlende Quellen stoppen den Lauf. `Thumbs.db` ist kein Bild.
- Geänderte Original-Hashes, doppelte IDs/Bildpfade, ungeprüfte exakte Dubletten,
  ungültige Titelbilder, fehlende Freigaben und unsichere Pfade stoppen den Lauf.
- Eine Dublette hat keine neue ID/Bilddatei, sondern `duplicateOf` und eine begründete Prüfung.
- Die bestehenden 82 Bilder besitzen SHA-256-Erhaltungslocks und werden nie neu enkodiert.
  Neue Bilder: WebP Q84, maximal 2400 × 2400, EXIF-Rotation, kein Upscaling.
- Auch bereits erzeugte neue Dateien werden nicht überschrieben. Ein erneuter Lauf
  vergleicht die deterministische Enkodierung byteweise. Bei abweichenden Dateien
  oder geänderter Sharp-Version wird eine Kollision gemeldet; kein stiller Bildersatz.
- Alle Quellen und Kollisionen werden vor dem Schreiben geprüft. Neue Assets werden
  exklusiv angelegt, der generierte Datensatz erst danach atomar ersetzt. Bei einem
  Dateisystemfehler können unreferenzierte neue Assets verbleiben; der nächste Lauf
  kann identische Assets wiederverwenden. Die Pipeline löscht keine Bilder.
- Ein Lauf darf keine bereits generierte Projekt-ID/Bildreferenz oder Gruppen-URL
  entfernen. Gewollte spätere Entfernungen oder Bildersetzungen brauchen eine eigene
  geprüfte Migration statt einer Lockerung dieser Schutzmechanismen.

Für die Phase-B-Migration sind der ursprüngliche 82er-Bestand und seine Datei-Hashes
unter `artifacts/referenzen-neustrukturierung/phase-b/bestand-vorher.json` dokumentiert.
Die 12 bisherigen URLs bleiben erhalten. Die Produktions-Sitemap und statischen
Parameter leiten sämtliche 17 Gruppen weiterhin aus derselben zentralen Laufzeitdatei ab.
