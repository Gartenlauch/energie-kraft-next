# Sprint 8.1 – Go-Live Guards

Vor einem Produktions-Go-Live zwingend erneut bestätigen:

- **Firebase-Kontext:** Die relevanten Collections existieren derzeit ausschließlich in der
  lokalen Emulator Suite. Daraus wird kein fehlender Produktionsbestand abgeleitet. Produktion,
  Provisionierung und Deploys sind nicht Teil von Sprint 8.2.
- **Bewerbungsunterlagen (Sprint 8.2):** Bestehende Callable `submitApplication` → serverseitige
  Prüfung → Firestore-Reservierung aller zufälligen Dateipfade → privater Storage → Mails ohne
  Anhänge. PDF, DOC, DOCX, JPG/JPEG, PNG; maximal 5 Dateien, je 10.000.000 Bytes, zusammen
  20.000.000 Bytes (mit Base64 unter dem 32-MB-Requestlimit der Gen-2-Function). Extension, MIME,
  tatsächliche Bytezahl und Dateisignatur/Word-Paket werden geprüft; das ist kein Virenscanner.
  Downloads ausschließlich nach Admin-Session-Prüfung als Attachment, ohne öffentliche URLs.
  Admin-Löschen entfernt zuerst alle Storage-Objekte; bei Fehler bleibt der Datensatz für einen
  erneuten Löschversuch erhalten. Unterbrochene Uploads behalten alle Pfade und eine dreiminütige
  Sperre gegen paralleles Hochladen/Löschen; Wiederholung mit identischen Daten/Dateien möglich.
  Verwaiste Reservierungen können im Admin nach Ablauf der Sperre vollständig gelöscht werden.
- **Lokale Storage-Konfiguration:** Vor Uploads die konfigurierte Emulator Suite starten.
  Next.js und Functions müssen denselben Bucket `demo-energie-kraft-next.appspot.com` verwenden
  (`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` bzw. Functions-Emulator `FIREBASE_CONFIG.storageBucket`),
  Storage-Host `127.0.0.1:9199`. Keine Rules-Öffnung und keine neuen Produktionsressourcen nötig.
  Die gemeinsame reine Upload-Policy liegt in `functions/src/shared`; deshalb schließt das
  App-Hosting-Quellpaket diesen Quellcode ein, aber keine Functions-Abhängigkeiten/Builds/Secrets.
- **MUST_VERIFY_BEFORE_GO_LIVE – Referenzen:** kWp und Speicherstatus aller 32 Projekte; danach
  projektweise `dataStatus` auf `verified` setzen.
- **MUST_VERIFY_BEFORE_GO_LIVE – Team:** Rollen, Schreibweisen, Bildrechte und Namensnennung der
  neun verwendeten Portraits; zwei fehlende/unklare Zuordnungen ersetzen.
- **BUSINESS_RECONFIRM_BEFORE_GO_LIVE – Kunden werben Kunden:** 250-Euro-Prämie, Gültigkeit ab
  01.03.2025, Neukunden-/Vorerfassungs-/Jahresfrist-/Ein-Projekt-/10.000-Euro-netto-Bedingungen
  sowie freiwillige Beendigungsmöglichkeit.
- **BUSINESS_RECONFIRM_BEFORE_GO_LIVE – Jobs:** Die drei veröffentlichten Angebote und sämtliche
  Benefits, insbesondere langfristige Festanstellung, Wochenendregelung, Jobrad/Firmenfahrzeug,
  Zuschüsse und zwei Firmenfeiern pro Jahr.

Keine dieser Prüfungen darf aus historischen Formularsubmissions, privaten Kontaktdaten oder
versteckten Builder-/EXIF-Metadaten abgeleitet werden.
