# Sprint 10 – Photovoltaik: Assets

Stand: 29.09.2026. Alle fünf lokalen WordPress-Dateien wurden anhand einer Kontaktübersicht visuell geprüft. Originale bleiben unverändert. Keine Internetbilder, KI-Bilder oder Website-Screenshots als Produktbilder.

## Vollständige lokale Bildinventur

Quelle: vom Auftraggeber bereitgestellter Ordner `.source-assets/wordpress-photovoltaik/`. Keine erfundenen Hersteller-URLs.

| Original                                | Tatsächliches Format | Abmessungen |  Bytes | Sichtbares Motiv                                                     | Entscheidung                                                                                          |
| --------------------------------------- | -------------------- | ----------- | -----: | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `Ainring_Header.jpg`                    | jpeg                 | 2100 × 1212 | 445810 | PV-Dach und Berglandschaft bei Ainring                               | Regionale Referenzen; optimiertes WebP                                                                |
| `Foto_Eigenheim_Steuerung_4-scaled.jpg` | jpeg                 | 2560 × 1493 | 101538 | Diagramm zu Erzeugung und Verbrauch                                  | Nicht verwendet: isolierte Grafik ohne ausreichend geklärten Kontext; keine Leistungswerte übernehmen |
| `Montagesystem_Ansicht.webp`            | webp                 | 1679 × 1256 | 153354 | Technische Darstellung von Modulen, Unterkonstruktion und Schneefang | Montagesysteme; unverändertes Original-WebP                                                           |
| `PV-kaufen_Sicherheit-geht-vor.jpg`     | jpeg                 | 1400 × 933  |  89902 | Zwei Monteure mit Schutzausrüstung auf einem PV-Dach                 | Nicht verwendet: vorhandenes Montage-Hero bleibt, keine unnötige Motivwiederholung                    |
| `PV-kaufen_Wechselrichter.jpg`          | jpeg                 | 1200 × 800  |  84478 | Person neben älteren Wechselrichter-/Elektrokomponenten              | Nicht verwendet: keine Aussage zu aktuellen Modellen oder zur Identität der Person                    |

## Verwendete Auslieferungsdateien

| Datei unter `public/`                                             | Abmessungen |  Bytes | Herkunft / Zuordnung                              |
| ----------------------------------------------------------------- | ----------- | -----: | ------------------------------------------------- |
| `images/photovoltaic/photovoltaic-feature-desktop.webp`           | 1600 × 1200 | 199246 | Vorhandenes Repo-Asset; bestehendes Hero Desktop  |
| `images/photovoltaic/photovoltaic-feature-mobile.webp`            | 1200 × 1500 | 152232 | Vorhandenes Repo-Asset; bestehendes Hero Mobile   |
| `images/battery-storage/residential-storage-feature-desktop.webp` | 1600 × 1200 | 279176 | Vorhandenes Repo-Asset; PV-Eigenverbrauch Desktop |
| `images/battery-storage/residential-storage-feature-mobile.webp`  | 1200 × 1500 | 214628 | Vorhandenes Repo-Asset; PV-Eigenverbrauch Mobile  |
| `images/photovoltaic/siko-montagesystem-schneefang.webp`          | 1679 × 1256 | 153354 | Montagesystem_Ansicht.webp; byteidentische Kopie  |
| `images/photovoltaic/ainring-pv-region.webp`                      | 1800 × 1039 | 295920 | Ainring_Header.jpg; regionale Referenzen          |

## Fit, Crop und Alt-Texte

- Hero: bestehende responsive Motive, `cover`, hohe Ladepriorität. Alt: „Fachgerechte Montage einer Photovoltaikanlage auf einem Hausdach“.
- Sigenergy: bestehende enger geschnittene Wohnhausszene (`residential-storage-feature-*`) statt des weiten Hero-Crops. Das Gerät, der sichtbare Sigenergy-Schriftzug und die Gehäuseform wurden visuell geprüft; es ist ein Speichergerät, keine EV-Ladestation. Keine genaue Modellbezeichnung, Leistungsdaten oder Aussage als eigenes Referenzprojekt. Alt: „Sigenergy-Batteriespeicher an einem Wohnhaus“. `cover` mit passenden vorhandenen Desktop-/Mobile-Varianten, lazy. Die ursprüngliche `pageVisuals.stromspeicher`-Konfiguration bleibt unverändert.
- SIKO: ein gemeinsames Asset, kein neuer Crop, kein Hochskalieren der Datei und keine erneute verlustbehaftete Kompression. `next/image` mit `unoptimized` liefert exakt das bereits komprimierte WebP; natürliche Seitenverhältnisse und `object-contain`. Die technische Darstellung (kein Vor-Ort-Foto) wird vollständig auf ruhiger Fläche mit Bildunterschrift gezeigt. SIKO-/Schneefang-Zuordnung laut Auftraggeber, ohne Modell-, Norm- oder Lastklassenaussagen. Alt: „SIKO-Montagesystem mit Schneefang an einer Photovoltaikanlage“. Caption: „SIKO-Montagesystem mit Schneefang.“
- Ainring: auf 1800 px verkleinertes WebP, Qualität 84; 1800 × 1039, keine Hochskalierung. Illustrative Landschaft mit PV-Dach, ohne neue Projektdaten. `cover`, lazy. Alt: „Photovoltaikmodule auf einem Dach vor der Berglandschaft bei Ainring“.

SIKO SHA-256: `589dfc1adb9c84311306208ecf06287ff24f1ca0fc9287d6c768fd6667169d13`. Der Render-/Asset-Test prüft die finale Datei ohne Abhängigkeit vom ignorierten Quellordner.

## Lokaler Quellschutz und visuelle Nachweise

`git check-ignore -v` bestätigt `.git/info/exclude:10:.source-assets/`. Keine globale Git-Konfiguration geändert, keine Originaldatei verschoben oder überschrieben, nichts gestagt.

Visuelle Inventur: `artifacts/sprint10-photovoltaik-qa/asset-contact-sheet.png`; technische Daten: `asset-inventory.json`. Browsernachweise und verbleibende Punkte stehen in [Validierung](sprint10-photovoltaik-validation.md).

## Abschließender Browsernachweis

SIKO ist bei 1920, 1440, 1280, 1024, 390 und 375 px vollständig sichtbar, mit `object-fit: contain` und unverändertem Verhältnis 1679:1256. Die technischen Bauteile/Schneefangrohre wurden in der Desktop- und Mobile-Detailaufnahme visuell geprüft. Bei 390 px ist das gemeinsame Asset 358 px breit; keine erzwungene Hochkantbeschneidung. Die Bilddatei wird 1:1 ausgeliefert.

Sigenergy wurde in der Desktop-/Mobile-Detailaufnahme visuell geprüft; die vorhandenen `residential-storage-feature-*`-Varianten halten Gerät und Markenaufdruck im Ausschnitt. Keine neue Dateiduplikation. Sämtliche verwendeten PV-Bilddateien liefern erfolgreich; keine lokalen Bild-404 im Browserlauf.
