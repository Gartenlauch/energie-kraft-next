# Energie-Kraft Süd – SEO-Migrationsmatrix

Stand: Sprint 3

Diese Datei dokumentiert die Migration der bestehenden WordPress-URLs
auf die neue Next.js-Webseite.

## Statuswerte

- `redirect-ready` – eindeutiges neues Ziel vorhanden
- `target-required` – Altseite besitzt relevante Inhalte, neue Zielseite fehlt noch
- `keep` – Route soll in neuer Architektur erhalten bleiben
- `review` – fachliche oder SEO-Entscheidung noch erforderlich
- `new` – neue Seite ohne direkte Legacy-URL

---

## Hauptseiten

| Legacy URL | Neue URL | Status | Maßnahme |
| --- | --- | --- | --- |
| `/` | `/` | keep | Startseite inhaltlich migrieren und optimieren |
| `/energieloesungen/photovoltaik-kaufen/` | `/photovoltaik` | redirect-ready | permanenter Redirect |
| `/energieloesungen/batteriespeicher-photovoltaik/` | `/stromspeicher` | redirect-ready | permanenter Redirect |
| `/energieloesungen/wallbox-kaufen/` | `/wallbox` | redirect-ready | permanenter Redirect |
| `/energieloesungen/waermepumpe-mit-pv/` | `/waermepumpen` | redirect-ready | permanenter Redirect; Legacy-Aussagen fachlich prüfen |
| – | `/klimaanlagen` | new | neue Leistung, Content neu erstellen |
| `/kontakt-photovoltaik/` | `/kontakt` | redirect-ready | permanenter Redirect |

---

## Noch nicht migrierte relevante Seiten

| Legacy URL | Status | Anmerkung |
| --- | --- | --- |
| `/energieloesungen/` | review | bisheriger Leistungs-Hub |
| `/energieloesungen/photovoltaik-fuer-unternehmen/` | target-required | eigenständige B2B-Suchintention erhalten |
| `/energieloesungen/gewerbespeicher/` | target-required | eigenständige B2B-Suchintention erhalten |
| `/energieloesungen/stromtarife-pv/` | review | prüfen, ob weiterhin geschäftlich relevant |
| `/service-und-wartung/` | review | Hub-Seite prüfen |
| `/service-und-wartung/service-und-team/` | target-required | Unternehmens-/Team-Inhalte erhalten |
| `/pv-referenzen/` | target-required | starke Vertrauens- und lokale SEO-Inhalte erhalten |
| `/jobs/` | target-required | eigene Route erforderlich |
| `/impressum/` | keep | rechtliche Seite erforderlich |
| `/datenschutzerklaerung/` | keep | rechtliche Seite erforderlich |
| `/agb/` | keep | geschäftliche/rechtliche Seite erhalten |

---

## Fachliche Migrationshinweise

### Photovoltaik

Legacy-Inhalte enthalten unter anderem:

- individuelle Anlagenplanung
- Eigenverbrauch und Unabhängigkeit
- PV-Module
- Wechselrichter
- Montagesysteme
- Monitoring
- Stromspeicher
- Installation
- Service und Wartung
- Unterstützung bei Formalitäten

Diese Themen sollen als Grundlage der neuen Photovoltaik-Seite dienen,
aber redaktionell und strukturell neu aufgebaut werden.

### Stromspeicher

Legacy-Inhalte enthalten unter anderem:

- Eigenverbrauch
- Energieautarkie
- Ersatz-/Notstrom
- Ladeleistung
- intelligente Steuerung
- Speicher für Privat und Gewerbe
- Zusammenspiel PV, Speicher, Wärmepumpe und E-Mobilität

Hersteller- und Produktinformationen dürfen fachlich verwendet werden,
sollen jedoch von generischen Nutzenargumenten getrennt bleiben.

### Wallbox

Legacy-Inhalte enthalten unter anderem:

- PV-Überschussladen
- Ladeleistung
- App-Steuerung
- Lastmanagement
- bidirektionales Laden
- Integration mit PV und Stromspeicher

Produkt-/Herstellerdetails sind nicht zwingend Bestandteil des
generischen Einstiegsbereichs.

### Wärmepumpen

ACHTUNG:

Die bisherige WordPress-Seite beschreibt Energie-Kraft Süd primär als
Dienstleister für die Integration vorhandener Wärmepumpen in eine
PV-Anlage und enthält die Aussage, dass Energie-Kraft Süd selbst keine
Wärmepumpen verkauft.

Diese Aussage darf nicht automatisch in die neue Seite übernommen werden.

Vor finaler Veröffentlichung muss der aktuelle Leistungsumfang
fachlich mit dem Unternehmen abgestimmt beziehungsweise anhand der
aktuellen Geschäftsentscheidung umgesetzt werden.

### Klimaanlagen

Keine direkte relevante Legacy-Leistungsseite identifiziert.

Die Seite wird als neue Leistung aufgebaut und benötigt daher
eigenständige Keyword-, Content- und regionale SEO-Konzeption.

---

## Redirect-Regeln

Nur URLs mit eindeutig äquivalentem neuen Ziel werden frühzeitig als
Redirect definiert.

Keine pauschalen Redirects von eigenständigen Altseiten auf die
Startseite oder eine thematisch nur teilweise passende Seite.

Damit sollen bestehende Rankings, Backlinks und Suchintentionen beim
Relaunch möglichst sauber übertragen werden.

---

## Vor Go-live noch erforderlich

- vollständigen Legacy-URL-Bestand erfassen
- bestehende Google-indexierte URLs prüfen
- Search-Console-Daten berücksichtigen
- externe Backlink-Ziele berücksichtigen
- endgültige Ziel-URL pro Legacy-URL bestimmen
- Redirect-Liste vervollständigen
- Canonicals prüfen
- Sitemap prüfen
- interne Links prüfen
- 404-/410-Kandidaten bestimmen
- Redirect-Ketten ausschließen
- Redirect-Loops ausschließen