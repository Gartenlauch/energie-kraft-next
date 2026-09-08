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

## Aktivierung in Sprint 8

1. Google Business Profile: Zugriff auf das tatsächliche Unternehmensprofil und die betreffende
   Location klären; den offiziellen, autorisierten serverseitigen Abruf implementieren.
2. Trustpilot: Zugriff auf das tatsächliche Business-Profil und die vorgesehenen offiziellen
   API-Endpunkte klären; serverseitigen Adapter implementieren.
3. Aktuelle Provider-Vorgaben für Attribution, Darstellung und Speicherung prüfen. Credentials
   ausschließlich serverseitig verwalten; keine Keys, Tokens oder Rohantworten im Client.
4. Provider-Daten validieren und auf die neutralen Types normalisieren. Rating und Gesamtzahl
   aus der offiziellen Summary übernehmen, niemals aus einer Teilmenge von Reviews ableiten.
5. Serverseitiges Caching mit einer zu den Provider-Vorgaben passenden Revalidierung sowie
   Timeout-/Fehlerbehandlung und Monitoring ergänzen. In Phase A gibt es noch keinen Live-Cache.
6. In `src/app/(site)/page.tsx` `getCustomerReviews()` aufrufen und die resultierende Collection
   an `CustomerReviewsSection` übergeben, vorzugsweise zwischen Referenzen und Partnern.
   Die Homepage lädt derzeit keine Reviews und zeigt keine Bewertungssection an.

Eine spätere Carousel-Darstellung verwendet ebenfalls Embla. Die aktuelle ruhige Grid-Darstellung
benötigt kein Carousel. Kein `AggregateRating`-, `Review`- oder `Rating`-Schema hinzufügen.
