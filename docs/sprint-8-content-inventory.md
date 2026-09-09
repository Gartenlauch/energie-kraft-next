# Sprint 8 – Content-Inventar

## Bereits im Next.js-Projekt vorhanden

- Startseite, Photovoltaik, Stromspeicher, Wärmepumpen, Klimaanlagen und Wallbox.
- Kontakt mit sicherem Contact-Lead-Workflow und zentralem `CONTACT_FORM_HREF`.
- Service-&-Wartung-Hub, PV-Referenzen-Hub und Jobs-Grundseite.
- Impressum, Datenschutz und AGB.
- Canonical-, Metadata-, Breadcrumb- und JSON-LD-Infrastruktur.
- Review-Datenmodell, leere serverseitige Adapter und UI mit Empty-State-Unterdrückung.

## Legacy-Seiten, die zu Sprintbeginn fehlten – jetzt umgesetzt

- `/energieloesungen/` als funktionsfähiger Hub (umgesetzt).
- `/energieloesungen/photovoltaik-fuer-unternehmen/` (umgesetzt).
- `/energieloesungen/gewerbespeicher/` (umgesetzt, historisch noindex; Entscheidung offen).
- `/energieloesungen/stromtarife-pv/` (umgesetzt).
- `/service-und-wartung/service-und-team/` (umgesetzt).
- `/service-und-wartung/wartung-und-reinigung/` (umgesetzt, historisch noindex; Entscheidung offen).
- `/service-und-wartung/finanzierung-und-foerderung/` (umgesetzt, historisch noindex; Entscheidung offen).
- `/ueber-uns`, `/bewerbung/` und `/kunden-werben-kunden/` (umgesetzt).
- Datengetriebene, substanzielle Ortsseiten unter `/pv-referenzen/[location]` für sieben
  qualifizierte Orte (umgesetzt).

## Legacy-Seiten, die verbessert werden müssen

- `Energielösungen` und `Service & Wartung` waren im Export faktisch Fehlerseiten.
- Service & Team enthält relevante Themen, vermischt aber Unternehmens- und Serviceintention.
- PV-Referenzen enthält echte regionale Belege, aber auch unbestätigte Summenbehauptungen.
- Jobs enthält konkrete ältere Stellenanzeigen. Ohne aktuelle Freigabe werden sie nicht als offen
  dargestellt; Themenabdeckung und Arbeitgeberkontext bleiben erhalten.
- Stromtarife enthält zeitkritische Tarif-, Vergütungs- und Produktzahlen. Sprint 8 formuliert
  evergreen und verweist auf individuelle Prüfung.
- Finanzierung & Förderung enthält zeitkritische Förder-, Steuer- und Kreditangaben aus 2025.
  Diese werden nicht übernommen.
- Wartung & Reinigung enthält konkrete Verlust- und Prüfpflichtaussagen ohne aktuelle Quelle.
  Der neue Text erklärt Leistungen und Nutzen ohne solche Garantien.
- Kunden werben Kunden enthält Prämienhöhe, Fristen und Bedingungen. Diese benötigen eine
  aktuelle geschäftliche Freigabe; bis dahin werden keine Konditionen behauptet.

## Mapping erforderlich

- Legacy-PV, -Speicher, -Wärmepumpe und -Wallbox werden auf die bereits etablierten kurzen
  Canonicals gemappt; keine doppelten Produktseiten.
- `/kontakt-photovoltaik/` wird später auf `/kontakt#kontaktformular` gemappt.
- Historische Kurz- und Vorversionen (`/service-und-team/`, `/unternehmen/`,
  `/photovoltaik/strom-speichern/` usw.) sind in `legacy-url-migration.md` einzeln erfasst.
- `/pv-angebot/` enthält ein abgelaufenes Angebot aus 2024 und wird später auf den
  PV-Konfigurator gemappt, nicht als Preislandingpage nachgebaut.

## Nicht mehr relevant

- WordPress-Monats- und Kategoriearchive, Danke-Seiten und die nicht vorhandene alte FAQ-Seite.
- Abgelaufene Preis-/Förderwerte, nicht verifizierte Installationszahlen und nicht bestätigte
  Stellenangebote.
- WordPress-/Brizy-Formulare werden weder als Content noch als Datenquelle übernommen.

## Incident-Verdacht

- Zufällige `?pid=`- und `?r=`-URLs, fremde technische Pfade und manipulierte Archive.
- Glücksspiel-/Togel-/Casino-Queries, Forex-Artikel, fremdsprachige Produktqueries und der
  im September 2026 veröffentlichte fremde Verschlüsselungs-Post.
- AI-Features-Daten sind ebenfalls kontaminiert: Japan führt dort mit 213 Impressionen und
  zahlreiche `?pid=`-Seiten erscheinen als Ziele. Der Report wird nicht als GEO-Erfolg gewertet.

## Späterer SEO-Audit

- Alle Redirects, 404/410-Entscheidungen, Canonical-Ketten und Spam-Deindexierung.
- Indexfreigabe für Gewerbespeicher, Wartung/Reinigung und Finanzierung/Förderung.
- Kampagnenstatus von `/landing/`, Reviewseite und historisches PDF.
- Finale Sitemap, Robots und Production-Crawl nach Hosting-Umschaltung.
