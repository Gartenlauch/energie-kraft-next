# Sprint 8.1 – Go-Live Guards

Vor einem Produktions-Go-Live zwingend erneut bestätigen:

- **MUST_VERIFY_BEFORE_GO_LIVE – Firebase-Infrastruktur:** Die Projektabfrage für
  `energie-kraft-next` lieferte am 09.09.2026 keine bereitgestellte Firestore-Datenbank. Zielprojekt,
  Standard-Edition, Region, Rules, Functions und `MAILGUN_SENDING_KEY` vor einem separaten Deploy
  prüfen beziehungsweise kontrolliert bereitstellen. In Sprint 8.1 wurde nichts provisioniert.
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
