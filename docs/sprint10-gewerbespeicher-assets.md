# Sprint 10 – Gewerbespeicher: Assets

Stand: 29.09.2026. Offizielle deutsche Produktseiten wurden geöffnet und mit den heruntergeladenen Quellen abgeglichen. Keine Händlerbilder, KI-Bilder, Hotlinks oder Browser-Screenshots als Websiteassets.

## Neue finale Produktbilder

| Asset unter `public/images/commercial-storage/products/` | Hersteller / Produkt         | Offizielle Quelle                                                                                                                                                                          | Original → Ziel          | Größe        | Darstellung / Alt-Text                                                                                  |
| -------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ------------ | ------------------------------------------------------------------------------------------------------- |
| `sigenstack.webp`                                        | Sigenergy / SigenStack       | [Produktseite](https://www.sigenergy.com/de/products/sigenstack), [offizielles Produktvideo](https://wwwstatic.sigenergy.com/static/images/product-SigenStack/video01.mp4)                 | 1920 × 1080 → 1600 × 900 | 41.604 Bytes | Desktop/Mobile: vollständiges Standbild bei 3 Sekunden, contain; „Sigenergy SigenStack Gewerbespeicher“ |
| `sonnenpro-flexstack.webp`                               | sonnen / sonnenPro FlexStack | [Produktseite](https://www.sonnen.pro/de-de/flexstack), [Originalbild](https://cdn.prod.website-files.com/69f05901a4cebec17ab94a16/69f05901a4cebec17ab94c59_sonnenPro-FlexStack-Hero.avif) | 2880 × 1600 → 1600 × 889 | 58.504 Bytes | Desktop/Mobile: vollständiges Bild, contain; „sonnenPro FlexStack Gewerbespeicher“                      |

WebP Qualität 90; keine Vergrößerung, keine nachträgliche Montage, keine Retusche. Ein Asset pro Produkt; next/image liefert passende Auflösungen. Beide Bilder werden im gleichen 16:9-Bildbereich und mit gleicher Porträtstruktur präsentiert. Hersteller werden in sichtbaren Bildunterschriften genannt; keine eigenen Referenzprojekte werden suggeriert.

Das SigenStack-Video hat 6,47 Sekunden Laufzeit. Das dunkle Posterbild wurde verworfen; das Standbild bei 3 Sekunden zeigt die Systemkomponenten erkennbar. Ein ebenfalls gefundenes Sigenergy-Gateway-Bild wurde nicht als SigenStack verwendet. Kandidaten, Quell-HTML und Originalvideo liegen nur unter `artifacts/sprint10-gewerbespeicher-qa/`.

## Bestehende Assets

| Asset unter `public/images/`                                          | Maße / Bytes          | Einsatz               | Crop / Alt-Text                                                              |
| --------------------------------------------------------------------- | --------------------- | --------------------- | ---------------------------------------------------------------------------- |
| `battery-storage/battery-storage-feature-desktop.webp`                | 1600 × 1200 / 344.508 | Hero Desktop          | cover; „Gewerblicher Batteriespeicher neben Gewächshäusern mit Photovoltaik“ |
| `battery-storage/battery-storage-feature-mobile.webp`                 | 1200 × 1527 / 240.092 | Hero Mobile           | vorhandener mobiler Ausschnitt, cover; gleicher Alt-Text                     |
| `commercial-photovoltaic/commercial-photovoltaic-system-desktop.webp` | 1440 × 900 / 189.762  | PV + Speicher Desktop | cover; „Photovoltaikanlage auf einer großen gewerblichen Dachfläche“         |
| `commercial-photovoltaic/commercial-photovoltaic-system-mobile.webp`  | 768 × 960 / 90.628    | PV + Speicher Mobile  | vorhandener mobiler Ausschnitt, cover; gleicher Alt-Text                     |

Das bisherige Hero wurde visuell geprüft: Speicher an gewerblichen Gewächshäusern, kein Wohnhausmotiv. Es bleibt erhalten und wird keinem konkreten Energie-Kraft-Referenzprojekt zugeordnet. Originaldimensionen vor Optimierung und ursprüngliche einzelne URLs der vorhandenen Repo-Assets sind nicht dokumentiert; die Tabelle nennt die vorhandenen finalen Maße.

Das Inventar unter battery-storage, commercial-photovoltaic und navigation wurde gezielt geprüft. Die vorhandenen Privatkundenprodukte und Navigationsbilder wurden nicht zu Gewerbeprodukten umetikettiert. Das Brand-Signet bleibt unverändert.

## Herkunft und Nutzungsrechte

Die neuen Medien stammen unmittelbar aus den genannten offiziellen Herstellerseiten beziehungsweise deren dort eingebundenen CDN-Dateien. Das dokumentiert die Herkunft, aber keine pauschale Nutzungslizenz. Eine gesonderte Freigabe für Energie-Kraft ist in den geprüften Quellen nicht nachgewiesen. Vor einer Veröffentlichung muss der Auftraggeber die Nutzungsrechte für die beiden neuen Herstellerassets bestätigen beziehungsweise dokumentieren. Es wurde keine Lizenz behauptet und nichts veröffentlicht.

Bestehende Projektassets wurden gemäß Auftrag weiterverwendet. Rohmaterial in design-input und migration-input wurde nicht verändert. QA-Artefakte wurden nicht gestagt.
