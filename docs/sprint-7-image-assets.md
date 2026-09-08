# Sprint 7 – Bildassets

Alle Bilder liegen lokal unter `public/images/`, werden als WebP ausgeliefert und enthalten weder
Hotlinks noch eingebettete Texte oder Fremdlogos. Die Website nutzt responsive Art Direction;
Desktop- und Mobile-Crops werden über die Next.js-16-API `getImageProps()` in einem `<picture>`
ausgegeben.

## Asset-Matrix

Visual-Polish-Pass: keine neuen Medien erzeugt oder importiert. Alle bestehenden Desktop-/Mobile-
Assets, Legacy-Motive, Original-Partnerlogos und realen Referenzbilder bleiben erhalten.
Der PV-Eigenverbrauchsabschnitt verwendet zusätzlich das vorhandene Speichermotiv.
Hero und Mega-Menü nutzen helle Bildflächen mit lokalen Scrims. Das weiße Signet steht auf der
Grenze von Homepage-Hero und blauem Intro; es gibt keinen Fullscreen-Brand-Screen mehr. Das
Mega-Menü verwendet für seine dynamischen Vorschauen ausschließlich vorhandene Produktbilder.

| Section                              | Desktop-Datei                                          | Mobile-Datei                                          | Maße Desktop | Maße Mobile | Ratio         | Motiv / Ausschnitt                                                                                                             | `object-position` | Alt-Text                                                                           | Format | Status                     |
| ------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------- | ------------ | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------- | ---------------------------------------------------------------------------------- | ------ | -------------------------- |
| Homepage Hero                        | `home-premium/hero-energy-home-desktop.webp`           | `home-premium/hero-energy-home-mobile.webp`           | 2000 × 1200  | 1200 × 1600 | 5:3 / 3:4     | Energiehaus in den bayerischen Voralpen; Desktop Haus rechts mit Freiraum links, Mobile PV-Dach und Systemkomponenten vertikal | center            | Modernes Haus mit Photovoltaik, Wärmepumpe und Wallbox in den bayerischen Voralpen | WebP   | final                      |
| Photovoltaik Feature / Produkt-Hero  | `photovoltaic/photovoltaic-feature-desktop.webp`       | `photovoltaic/photovoltaic-feature-mobile.webp`       | 1600 × 1200  | 1200 × 1500 | 4:3 / 4:5     | Monteur prüft PV-Modul auf geneigtem Dach; mobiler Fokus auf Monteur und Modul                                                 | center / right    | Fachgerechte Montage einer Photovoltaikanlage auf einem Hausdach                   | WebP   | final                      |
| Stromspeicher Feature / Produkt-Hero | `battery-storage/battery-storage-feature-desktop.webp` | `battery-storage/battery-storage-feature-mobile.webp` | 1600 × 1200  | 1200 × 1500 | 4:3 / 4:5     | Ungebrandeter Speicher und Wechselrichter im hellen Technikraum; mobiler Fokus links                                           | center / left     | Modern installierter Stromspeicher in einem hellen Hauswirtschaftsraum             | WebP   | final                      |
| Wärmepumpe Feature / Produkt-Hero    | `heat-pump/heat-pump-feature-desktop.webp`             | `heat-pump/heat-pump-feature-mobile.webp`             | 1600 × 1200  | 1200 × 1500 | 4:3 / 4:5     | Architektonisch integrierte Außeneinheit am Wohnhaus; mobiler Fokus rechts                                                     | center / right    | Dezent in die Architektur eines Wohnhauses integrierte Wärmepumpe                  | WebP   | final                      |
| Klimaanlage Feature / Produkt-Hero   | `climate/climate-feature-desktop.webp`                 | `climate/climate-feature-mobile.webp`                 | 1600 × 1200  | 1200 × 1500 | 4:3 / 4:5     | Heller Wohnraum mit dezenter Split-Einheit; mobiler Fokus links oben                                                           | center / left     | Dezent integrierte Klimaanlage in einem hellen modernen Wohnraum                   | WebP   | final                      |
| Wallbox Feature / Produkt-Hero       | `wallbox/wallbox-feature-desktop.webp`                 | `wallbox/wallbox-feature-mobile.webp`                 | 1600 × 1200  | 1200 × 1500 | 4:3 / 4:5     | E-Auto lädt am Carport, PV-Dach im Hintergrund; mobiler Fokus rechts                                                           | center / right    | Elektroauto lädt an einer Wallbox unter dem Carport eines Hauses mit Photovoltaik  | WebP   | final                      |
| Service & Wartung                    | `home-premium/service-maintenance-desktop.webp`        | `home-premium/service-maintenance-mobile.webp`        | 1600 × 1000  | 1080 × 1350 | 8:5 / 4:5     | Techniker prüft ungebrandete Steuerung; mobiler Fokus auf Person und Messgerät                                                 | center / right    | Servicetechniker prüft fachgerecht eine Energieanlage                              | WebP   | final                      |
| Beratung / Referenzen                | `home-premium/consultation-reference-desktop.webp`     | `home-premium/consultation-reference-mobile.webp`     | 1600 × 1000  | 1080 × 1350 | 8:5 / 4:5     | Beratung am Planungstisch, PV-Dach im Hintergrund; mobiler Fokus auf Gespräch                                                  | center / right    | Persönliche Energieberatung mit Hauseigentümern am Planungstisch                   | WebP   | final                      |
| Abschluss-CTA / Legacy Beratung      | `home-premium/contact-legacy-desktop.webp`             | `home-premium/contact-legacy-mobile.webp`             | 2000 × 804   | 800 × 1200  | ca. 5:2 / 2:3 | Beratung einer Familie vor regionaler Gebäudekulisse                                                                           | center            | Persönliche Beratung einer Familie zu einer Energielösung                          | WebP   | final, Legacy-Medium       |
| Service-Seite / Legacy PV            | `service/service-solar-legacy-desktop.webp`            | `service/service-solar-legacy-mobile.webp`            | 1800 × 1000  | 1080 × 1350 | 9:5 / 4:5     | Photovoltaikmodule im Abendlicht, mobiler Fokus auf Modulfläche                                                                | center            | Photovoltaikanlage im Abendlicht als Teil eines betreuten Energiesystems           | WebP   | final, Legacy-Medium       |
| PV-Seite, zweite Bildsection         | `service/service-solar-legacy-desktop.webp`             | `service/service-solar-legacy-mobile.webp`             | 1800 × 1000  | 1080 × 1350 | 9:5 / 4:5     | Alternatives PV-Motiv im Abendlicht statt Wiederholung des Produkt-Heros                                                       | center            | Photovoltaikmodule im warmen Abendlicht                                            | WebP   | final, Legacy-Medium       |
| Mega-Menü Energielösungen            | `navigation/energy-solutions-mega.webp`                | –                                                     | 1200 × 800   | –           | 3:2           | Energiehaus und Voralpen; Fokus rechts, dunkler Verlauf nur im UI                                                              | center right      | Modernes Wohnhaus mit Photovoltaikanlage in den bayerischen Voralpen               | WebP   | final                      |
| Mega-Menü Service                    | `navigation/service-maintenance-mega.webp`             | –                                                     | 1200 × 800   | –           | 3:2           | Servicetechniker und Anlage; Fokus rechts                                                                                      | center right      | Servicetechniker prüft die Steuerung eines Energiesystems                          | WebP   | final                      |
| Referenz Berchtesgaden               | `references/berchtesgaden-residential.webp`            | –                                                     | 1200 × 800   | –           | 3:2           | Reales Wohnhaus mit PV-Anlage und regionaler Bergkulisse                                                                       | center            | Photovoltaikanlage auf einem Wohnhaus in Berchtesgaden                             | WebP   | final, reales Referenzbild |
| Referenz Ainring                     | `references/ainring-residential.webp`                  | –                                                     | 1200 × 800   | –           | 3:2           | Reale PV-Module auf Wohngebäude im ländlichen Umfeld                                                                           | center            | Photovoltaikmodule auf einem Wohnhaus in Ainring                                   | WebP   | final, reales Referenzbild |
| Referenz Freilassing                 | `references/freilassing-commercial.webp`               | –                                                     | 1200 × 800   | –           | 3:2           | Reale PV-Anlage auf Gewerbedach                                                                                                | center            | Photovoltaikanlage auf einem Gewerbedach in Freilassing                            | WebP   | final, reales Referenzbild |
| Referenz Schönram-Petting            | `references/schoenram-commercial.webp`                 | –                                                     | 1200 × 800   | –           | 3:2           | Reale großflächige PV-Anlage auf Gewerbedach                                                                                   | center            | Großflächige Photovoltaikanlage auf einem Gewerbedach in Schönram-Petting          | WebP   | final, reales Referenzbild |

Der mobile Header verwendet keine Mega-Menü-Bilder, weil er als eigenständiges Accordion mit
kurzen Ladewegen und großen Touch-Zielen konzipiert ist.

### Dynamische Mega-Menü-Zuordnung

- Photovoltaik → `photovoltaic/photovoltaic-feature-desktop.webp`
- Stromspeicher → `battery-storage/battery-storage-feature-desktop.webp`
- Wärmepumpe → `heat-pump/heat-pump-feature-desktop.webp`
- Klimaanlage → `climate/climate-feature-desktop.webp`
- Wallbox → `wallbox/wallbox-feature-desktop.webp`
- Energie-Konfigurator und persönliche Unterstützung →
  `home-premium/consultation-reference-desktop.webp`
- Service & Wartung → `navigation/service-maintenance-mega.webp`
- Anlagencheck → `service/service-solar-legacy-desktop.webp`
- Wartung → `home-premium/service-maintenance-desktop.webp`

### Marken- und Zertifizierungsassets

- Footer-Logo: `public/brand/energie-kraft/eksued-logo-kompakt-website.svg`, originale
  bereitgestellte dreizeilige Kompaktvariante, final.
- Footer-Vertrauen: `public/brand/certifications/dgs-mitglied.jpg`, unverändertes originales
  DGS-Mitgliedslogo, final.
- Hero/Intro-Signet: `public/brand/energie-kraft/energie-kraft-supersign.svg`, als vorhandenes
  Asset technisch weiß dargestellt, final.

## Finales Prompt-Set

Die Assets wurden mit dem integrierten Bildgenerator im Modus `photorealistic-natural` erstellt.
Alle Prompts enthielten diese gemeinsamen Invarianten: hochwertige, glaubwürdige Editorial-
Fotografie; realistische süddeutsche Architektur bzw. Installation; keine lesbaren Texte, Logos,
Markenzeichen oder Wasserzeichen; keine Neon-Effekte, UI-Overlays oder futuristische Geräte.

1. **Desktop-Hero:** Zeitgemäßes Energiehaus in den bayerischen Voralpen mit integriertem
   dunklem PV-Dach, dezenter Wärmepumpe und E-Auto an der Wallbox; breite Komposition, Haus rechts,
   ruhiger Freiraum links; warmes frühes Tageslicht.
2. **Mobile-Hero:** Dasselbe Motiv als bewusst vertikale 3:4-Komposition; PV-Dach oben,
   Wärmepumpe und Wallbox in den unteren Ebenen; ruhige Fläche für responsives UI.
3. **Photovoltaik:** Fachkundiger Monteur prüft die Ausrichtung dunkler Module auf einem realen
   süddeutschen Steildach; dokumentarische Handwerksfotografie, ruhiges Tageslicht.
4. **Stromspeicher:** Ungebrandeter Heimspeicher mit Wechselrichter und sauberer Leitungsführung in
   einem hellen, authentischen Technikraum; matte Materialien und natürliche Fensterbeleuchtung.
5. **Wärmepumpe:** Ungebrandete Luft-Wasser-Außeneinheit, zurückhaltend in Garten und Fassade eines
   modernen Hauses integriert; realistische Abstände und Proportionen.
6. **Klimaanlage:** Heller Wohnraum mit unaufdringlicher Wand-Split-Einheit, Kalkputz, Eiche und
   Leinentexturen; diffuses Sommerlicht, keine künstlichen Luftstromgrafiken.
7. **Wallbox:** Ungebrandetes Elektroauto lädt an einer dezenten Wallbox unter einem Carport;
   sichtbares PV-Dach, korrekte Kabelverbindung, realistisches deutsches Wohnumfeld.
8. **Service:** Techniker in dunkelblauer Arbeitskleidung prüft mit Diagnosegerät ein ungebrandetes
   Energiesystem; natürliche Haltung, sichtbare Hände, heller Technikraum.
9. **Beratung:** Ein Berater und zwei Hauseigentümer besprechen Plan und Tablet am Esstisch;
   natürlicher Dialog ohne Blick in die Kamera, PV-Dach subtil im Hintergrund.

## Übernommene Bestandsmedien

Aus `design-input/legacy-media/` wurden nur zwei tatsächlich eingesetzte Motive als optimierte
WebP-Ausgaben nach `public/images/` übernommen:

- `Header_Adresse-und-Kontakt_sonnig.jpg` und `Header_Adresse-und-Kontakt_Mobile.jpg` für den
  bildgestützten Abschluss-CTA der Homepage
- `Header_Service-Team.jpg` für den Hero der Seite Service & Wartung

Aus `design-input/reference-originals/` wurden vier vorhandene reale Projektbilder für das
Referenz-Mosaik der Homepage und der Übersichtsseite übernommen. Die Rohdaten bleiben im
Design-Input; veröffentlicht werden ausschließlich die optimierten WebP-Dateien.

## Partnerlogos

Der Partnerbereich verwendet ausschließlich vorhandene Originaldateien aus
`public/brand/partners/`. Verwendet werden Fronius, Kostal, SMA, SolarEdge, K2 Systems,
Schletter, IBC Solar, KACO new energy, Sungrow, Sigenergy, Solar-Log und ABL. Doppelte Dateien im
Quellordner werden nicht erneut im Carousel ausgegeben.

## Noch offene Bildinhalte

### Functional-Polish: Konfigurator-Haus

Die produktive Hausnavigation verwendet die bereits vorhandenen Dateien
`home-premium/hero-energy-home-desktop.webp` (2000 × 1200) und
`home-premium/hero-energy-home-mobile.webp` (1200 × 1600). Keine neuen Bilder erzeugt.
Desktop wird das Bild im originalen Seitenverhältnis 5:3 dargestellt, sodass die prozentual
positionierten Hotspots an PV-Dach (76/39), Wärmepumpe (45/78) und Wallbox (81/74) sitzen.
Die weiteren Marker zeigen auf Wohnbereich (66/59) und Technikbereich (59/73); ihre Texte
behaupten keine außen sichtbaren Speicher- oder Klimageräte. Mobil entfällt die Hotspot-Ebene;
unter dem vertikalen Bild stehen die Produktlinks in der bestehenden Reihenfolge.

Es gibt keine technischen Bildplatzhalter. Eine erste Auswahl realer Referenzbilder ist integriert,
die Sammlung ist jedoch noch nicht vollständig. Es wurden deshalb keine einzelnen Ortsseiten und
keine nicht verifizierten Detailangaben wie Anlagenleistung, Baujahr oder Kundenzitate publiziert.
Weitere Orte werden erst ergänzt, wenn ausreichend freigegebener, eindeutiger Inhalt vorliegt.
