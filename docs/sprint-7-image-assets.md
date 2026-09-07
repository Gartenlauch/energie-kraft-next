# Sprint 7 – Bildassets

Alle Bilder liegen lokal unter `public/images/`, werden als WebP ausgeliefert und enthalten weder
Hotlinks noch eingebettete Texte oder Fremdlogos. Die Website nutzt responsive Art Direction;
Desktop- und Mobile-Crops werden über die Next.js-16-API `getImageProps()` in einem `<picture>`
ausgegeben.

## Asset-Matrix

| Section | Desktop-Datei | Mobile-Datei | Maße Desktop | Maße Mobile | Ratio | Motiv / Ausschnitt | `object-position` | Alt-Text | Format | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage Hero | `home-premium/hero-energy-home-desktop.webp` | `home-premium/hero-energy-home-mobile.webp` | 2000 × 1200 | 1200 × 1600 | 5:3 / 3:4 | Energiehaus in den bayerischen Voralpen; Desktop Haus rechts mit Freiraum links, Mobile PV-Dach und Systemkomponenten vertikal | center | Modernes Haus mit Photovoltaik, Wärmepumpe und Wallbox in den bayerischen Voralpen | WebP | final |
| Photovoltaik Feature / Produkt-Hero | `photovoltaic/photovoltaic-feature-desktop.webp` | `photovoltaic/photovoltaic-feature-mobile.webp` | 1600 × 1200 | 1200 × 1500 | 4:3 / 4:5 | Monteur prüft PV-Modul auf geneigtem Dach; mobiler Fokus auf Monteur und Modul | center / right | Fachgerechte Montage einer Photovoltaikanlage auf einem Hausdach | WebP | final |
| Stromspeicher Feature / Produkt-Hero | `battery-storage/battery-storage-feature-desktop.webp` | `battery-storage/battery-storage-feature-mobile.webp` | 1600 × 1200 | 1200 × 1500 | 4:3 / 4:5 | Ungebrandeter Speicher und Wechselrichter im hellen Technikraum; mobiler Fokus links | center / left | Modern installierter Stromspeicher in einem hellen Hauswirtschaftsraum | WebP | final |
| Wärmepumpe Feature / Produkt-Hero | `heat-pump/heat-pump-feature-desktop.webp` | `heat-pump/heat-pump-feature-mobile.webp` | 1600 × 1200 | 1200 × 1500 | 4:3 / 4:5 | Architektonisch integrierte Außeneinheit am Wohnhaus; mobiler Fokus rechts | center / right | Dezent in die Architektur eines Wohnhauses integrierte Wärmepumpe | WebP | final |
| Klimaanlage Feature / Produkt-Hero | `climate/climate-feature-desktop.webp` | `climate/climate-feature-mobile.webp` | 1600 × 1200 | 1200 × 1500 | 4:3 / 4:5 | Heller Wohnraum mit dezenter Split-Einheit; mobiler Fokus links oben | center / left | Dezent integrierte Klimaanlage in einem hellen modernen Wohnraum | WebP | final |
| Wallbox Feature / Produkt-Hero | `wallbox/wallbox-feature-desktop.webp` | `wallbox/wallbox-feature-mobile.webp` | 1600 × 1200 | 1200 × 1500 | 4:3 / 4:5 | E-Auto lädt am Carport, PV-Dach im Hintergrund; mobiler Fokus rechts | center / right | Elektroauto lädt an einer Wallbox unter dem Carport eines Hauses mit Photovoltaik | WebP | final |
| Service & Wartung | `home-premium/service-maintenance-desktop.webp` | `home-premium/service-maintenance-mobile.webp` | 1600 × 1000 | 1080 × 1350 | 8:5 / 4:5 | Techniker prüft ungebrandete Steuerung; mobiler Fokus auf Person und Messgerät | center / right | Servicetechniker prüft fachgerecht eine Energieanlage | WebP | final |
| Beratung / Referenzen | `home-premium/consultation-reference-desktop.webp` | `home-premium/consultation-reference-mobile.webp` | 1600 × 1000 | 1080 × 1350 | 8:5 / 4:5 | Beratung am Planungstisch, PV-Dach im Hintergrund; mobiler Fokus auf Gespräch | center / right | Persönliche Energieberatung mit Hauseigentümern am Planungstisch | WebP | final |
| Mega-Menü Energielösungen | `navigation/energy-solutions-mega.webp` | – | 1200 × 800 | – | 3:2 | Energiehaus und Voralpen; Fokus rechts, dunkler Verlauf nur im UI | center right | Modernes Wohnhaus mit Photovoltaikanlage in den bayerischen Voralpen | WebP | final |
| Mega-Menü Service | `navigation/service-maintenance-mega.webp` | – | 1200 × 800 | – | 3:2 | Servicetechniker und Anlage; Fokus rechts | center right | Servicetechniker prüft die Steuerung eines Energiesystems | WebP | final |

Der mobile Header verwendet keine Mega-Menü-Bilder, weil er als eigenständiges Accordion mit
kurzen Ladewegen und großen Touch-Zielen konzipiert ist.

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

## Noch offene Bildinhalte

Es gibt keine technischen Platzhalter. Für echte Referenzprojekte fehlen im Repository jedoch
freigegebene Kundenfotos und belastbare Projektdaten. Die Referenzroute verwendet deshalb bis zu
deren Freigabe das finale Beratungsbild und macht keine erfundenen Projektbehauptungen.
