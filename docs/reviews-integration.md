# Kundenbewertungen – Vorbereitung für Sprint 8

Phase A enthält eine wiederverwendbare Server-Komponente unter
`src/components/marketing/customer-reviews-section.tsx`. Sie rendert eine offene, responsive
Bewertungsübersicht mit Provider-Summaries, Sternen, Autor, Datum, Text und optionalem Quelllink.
Leere Daten rendern keine Section. Es gibt keine produktiven Fixtures und keine Review-JSON-LD.
Es wurden keine verifizierten Bewertungsdaten in den geprüften Projektinhalten gefunden.

## Datenmodell und Adapter

`src/lib/reviews/types.ts` definiert `ReviewProvider`, `CustomerReview`, `ReviewSummary`,
`ReviewCollection` sowie das `ReviewAdapter`-Interface. Provider-Responses bleiben außerhalb
der UI. Die Google- und Trustpilot-Adapter sind mit `server-only` geschützt und liefern derzeit
den expliziten Zustand `not-configured`; sie führen keine API-Anfragen aus.

`getCustomerReviews()` im Server-Modul `src/lib/reviews/index.ts` sammelt die verfügbaren
Provider-Daten. Ein fehlender Provider liefert keine erfundenen Ersatzwerte. Die Komponente
verwendet lesbare Provider-Namen; offizielle Logo-Assets können nach Freigabe ergänzt werden.

## Sprint-8-Status und spätere Aktivierung

In der dokumentierten Beispiel-/Konfigurationsoberfläche sind keine eindeutig zugeordneten
Google-Business-Profile- oder Trustpilot-Credentials definiert. Deshalb bleibt der vorhandene
`not-configured`-Zustand aktiv: Es gibt keine API-Requests, keine öffentliche Review-Section,
keine Ersatzbewertungen und kein Review-/`AggregateRating`-JSON-LD.

1. Google Business Profile: Zugriff auf das tatsächliche Unternehmensprofil und die betreffende
   Location klären; den offiziellen, autorisierten serverseitigen Abruf implementieren.
2. Trustpilot: Zugriff auf das tatsächliche Business-Profil und die vorgesehenen offiziellen
   API-Endpunkte klären; serverseitigen Adapter implementieren.
3. Aktuelle Provider-Vorgaben für Attribution, Darstellung und Speicherung prüfen. Credentials
   ausschließlich serverseitig verwalten; keine Keys, Tokens oder Rohantworten im Client.
4. Provider-Daten validieren und auf die neutralen Types normalisieren. Rating und Gesamtzahl
   aus der offiziellen Summary übernehmen, niemals aus einer Teilmenge von Reviews ableiten.
5. Serverseitiges Caching mit ungefähr 12–24 Stunden Revalidierung, passend zu den
   Provider-Vorgaben, sowie Timeout-/Fehlerbehandlung und Monitoring ergänzen. Ein Provider darf
   einzeln ausfallen; `Promise.allSettled` hält den zweiten Provider verfügbar. Solange keine
   Live-Anbindung existiert, ist kein Cache aktiv und es entstehen keine Requests pro Pageview.
6. In `src/app/(site)/page.tsx` `getCustomerReviews()` aufrufen und die resultierende Collection
   an `CustomerReviewsSection` übergeben, vorzugsweise zwischen Referenzen und Partnern.
   Die Homepage lädt derzeit keine Reviews und zeigt keine Bewertungssection an.

Eine spätere Carousel-Darstellung verwendet ebenfalls Embla. Die aktuelle ruhige Grid-Darstellung
benötigt kein Carousel. Kein `AggregateRating`-, `Review`- oder `Rating`-Schema hinzufügen.
