// Editorial import material, never imported by the website. Firestore is the runtime source.
// Sources: legitimate WordPress PV/storage/wallbox copy and current product page explanations.
export const faqGroups = [
  {
    slug: "photovoltaik",
    name: "Photovoltaik",
    route: "photovoltaik",
    questions: [
      [
        "wie-funktioniert-photovoltaik",
        "Wie funktioniert eine Photovoltaikanlage?",
        "Solarmodule erzeugen aus Sonnenlicht Gleichstrom. Ein Wechselrichter wandelt ihn in Wechselstrom für die Verbraucher im Gebäude um.",
        "Der erzeugte Solarstrom kann direkt im Haus genutzt werden. Übersteigt die Erzeugung den aktuellen Verbrauch, lässt sich der Überschuss in einem passenden Batteriespeicher speichern oder ins Netz einspeisen.\n\nDie tatsächlich nutzbare Energie hängt unter anderem von Dachausrichtung, Verschattung, Anlagenleistung und Verbrauchszeiten ab. Module, Wechselrichter und elektrische Installation werden deshalb gemeinsam geplant.",
      ],
      [
        "welches-dach-ist-geeignet",
        "Welches Dach eignet sich für Photovoltaik?",
        "Entscheidend sind nutzbare Fläche, Ausrichtung, Verschattung sowie Zustand und Tragfähigkeit des Dachs.",
        "Eine reine Flächenangabe reicht für die Planung nicht aus. Dachfenster, Gauben und verschattete Bereiche begrenzen die mögliche Modulbelegung. Auch Dachdeckung und Befestigungsmöglichkeiten müssen zur Unterkonstruktion passen.\n\nDachpläne und Fotos erleichtern die erste Einschätzung. Die technische Aufnahme klärt, welche Flächen tatsächlich nutzbar sind und ob vor der Montage Arbeiten am Dach erforderlich sind.",
      ],
      [
        "eigenverbrauch-und-autarkie",
        "Was ist der Unterschied zwischen Eigenverbrauch und Autarkie?",
        "Eigenverbrauch beschreibt den selbst genutzten Anteil des erzeugten Solarstroms. Autarkie beschreibt den Anteil des Strombedarfs, den das eigene System deckt.",
        "Beide Größen betrachten unterschiedliche Bezugsgrößen: Beim Eigenverbrauch ist es die PV-Erzeugung, beim Autarkiegrad der gesamte Stromverbrauch. Ein hoher Eigenverbrauch bedeutet daher nicht automatisch einen hohen Autarkiegrad.\n\nEin Speicher kann Solarstrom in andere Tageszeiten verschieben. Wie stark dadurch der Netzbezug sinkt, hängt von Erzeugung, Speicherverlusten und Verbrauch ab. Eine Jahresbilanz bedeutet keine durchgehende Versorgung ohne Stromnetz.",
      ],
      [
        "pv-mit-speicher-planen",
        "Sollte ich Photovoltaik und Stromspeicher gemeinsam planen?",
        "Ja, eine gemeinsame Planung stimmt Erzeugung, Speicherkapazität und Verbrauch aufeinander ab. Ein Speicher ist dabei keine automatische Pflicht.",
        "Relevant sind nicht nur der Jahresstromverbrauch, sondern auch die Zeiten, zu denen Strom benötigt wird. Wer viel Solarstrom bereits tagsüber nutzt, hat andere Anforderungen als ein Haushalt mit hohem Abendverbrauch.\n\nAuch geplante Verbraucher wie Wärmepumpe und Elektroauto gehören in die Betrachtung. Kapazität, Ladeleistung und Schnittstellen des Speichers müssen zum gesamten System passen.",
      ],
      [
        "was-zeigt-pv-monitoring",
        "Was zeigt das Monitoring einer PV-Anlage?",
        "Monitoring zeigt je nach System Erzeugung, Betriebszustand und Fehlermeldungen. Mit geeigneter Messtechnik können auch Verbrauch und Energieflüsse sichtbar werden.",
        "Ein Vergleich der Erträge hilft, Veränderungen zu erkennen. Niedrigere Erträge an einem einzelnen Tag können allerdings auch durch Wetter und Jahreszeit entstehen und belegen allein noch keinen Defekt.\n\nBei einer Serviceanfrage helfen die genaue Fehlermeldung, der Zeitpunkt und vorhandene Verlaufsdaten. Ein Monitoring ersetzt keine technische Prüfung der Anlage.",
      ],
      [
        "photovoltaik-im-gewerbe",
        "Worauf kommt es bei Photovoltaik für Unternehmen an?",
        "Das betriebliche Lastprofil, die Dachfläche und die Anschlussbedingungen bestimmen die Planung einer gewerblichen PV-Anlage.",
        "Wenn der Betrieb tagsüber Strom benötigt, können Erzeugung und Verbrauch zeitlich gut zusammenpassen. Wochenenden, Schichtbetrieb und saisonale Schwankungen beeinflussen den Eigenverbrauch.\n\nZusätzlich werden Dachzustand, Tragfähigkeit, elektrische Einbindung und spätere Erweiterungen betrachtet. Ob ein Gewerbespeicher sinnvoll ist, lässt sich erst anhand des Lastverlaufs und der konkreten Projektbedingungen beurteilen.",
      ],
      [
        "welche-unterlagen-pv-planung",
        "Welche Unterlagen helfen bei der PV-Planung?",
        "Hilfreich sind Stromabrechnung, Dachpläne oder Dachmaße sowie Fotos von Dach und Zählerschrank.",
        "Ergänzen Sie Informationen über größere Verbraucher und geplante Änderungen: etwa ein Elektroauto, eine Wärmepumpe oder einen Anbau. Diese Angaben helfen, den künftigen Bedarf einzuschätzen.\n\nUnterlagen ermöglichen eine erste Orientierung. Für die konkrete Auslegung werden Dach, elektrische Anlage und örtliche Bedingungen anschließend technisch geprüft.",
      ],
    ],
  },
  {
    slug: "stromspeicher",
    name: "Stromspeicher",
    route: "stromspeicher",
    questions: [
      [
        "solarstrom-abends-nutzen",
        "Wie kann ich Solarstrom abends nutzen?",
        "Ein Batteriespeicher nimmt überschüssigen Solarstrom auf und gibt ihn später wieder ab, wenn die PV-Erzeugung den Verbrauch nicht deckt.",
        "Tagsüber kann die Anlage mehr Strom erzeugen, als das Haus gerade braucht. Ein passender Speicher verschiebt einen Teil dieser Energie in den Abend oder in Zeiten geringerer Erzeugung.\n\nDie verfügbare Energie ist durch Ladezustand, nutzbare Kapazität und Verluste begrenzt. Reichen PV und Speicher nicht aus, wird ergänzend Strom aus dem Netz bezogen.",
      ],
      [
        "speicher-kwh-und-kw",
        "Was bedeuten kWh und kW beim Stromspeicher?",
        "Kilowattstunden (kWh) beschreiben die gespeicherte Energiemenge. Kilowatt (kW) beschreiben, wie viel Leistung der Speicher gleichzeitig aufnehmen oder abgeben kann.",
        "Ein Speicher mit großer Kapazität kann nicht automatisch jeden leistungsstarken Verbraucher versorgen. Dafür sind unter anderem Entladeleistung, Wechselrichter und Systemkonfiguration entscheidend.\n\nFür die Auslegung betrachten wir deshalb nutzbare Kapazität und Lade- beziehungsweise Entladeleistung gemeinsam mit dem Verbrauchsprofil.",
      ],
      [
        "speicher-nachruesten",
        "Kann ich einen Stromspeicher nachrüsten?",
        "Eine Nachrüstung ist grundsätzlich möglich, muss aber zur vorhandenen Photovoltaikanlage und Elektroinstallation passen.",
        "Zu prüfen sind insbesondere Wechselrichter, elektrische Einbindung, Platzangebot und technische Schnittstellen. Die geeignete Lösung hängt vom vorhandenen System ab.\n\nFür die erste Einschätzung sind Anlagendokumentation, Wechselrichtertyp und Verbrauchsdaten hilfreich. Auch gewünschte Funktionen wie Ersatzstrom sollten vor der Auswahl geklärt werden.",
      ],
      [
        "speicher-bei-stromausfall",
        "Versorgt jeder Stromspeicher das Haus bei Stromausfall?",
        "Nein. Notstrom oder Ersatzstrom setzt eine dafür ausgelegte Anlage und passende Umschalttechnik voraus.",
        "Ein gewöhnlicher netzgekoppelter Speicher ist nicht automatisch eine Ersatzstromversorgung. Vorab muss geklärt werden, welche Verbraucher weiterlaufen sollen und welche Leistung sie benötigen.\n\nAuch Laufzeit, Ladezustand und die Möglichkeit zum Nachladen durch Photovoltaik hängen vom jeweiligen System ab. Die gewünschte Versorgung gehört deshalb ausdrücklich in die technische Planung.",
      ],
      [
        "wie-gross-stromspeicher",
        "Wie groß sollte ein Stromspeicher sein?",
        "Die passende Größe ergibt sich aus PV-Erzeugung, Verbrauchszeiten und dem Strombedarf außerhalb der Sonnenstunden.",
        "Nur den Jahresverbrauch oder die PV-Leistung zu betrachten, greift zu kurz. Ein großer Speicher wird möglicherweise selten voll; ein kleiner Speicher kann den Abendbedarf nur teilweise decken.\n\nVerbrauchsprofil, nutzbare Kapazität, Ladeleistung und geplante Verbraucher werden gemeinsam bewertet. Pauschale Größenempfehlungen ersetzen diese Prüfung nicht.",
      ],
    ],
  },
  {
    slug: "waermepumpe",
    name: "Wärmepumpe",
    route: "waermepumpen",
    questions: [
      [
        "waermepumpe-mit-photovoltaik",
        "Wie arbeiten Wärmepumpe und Photovoltaik zusammen?",
        "Die Wärmepumpe kann verfügbaren Solarstrom nutzen. Eine passende Steuerung stimmt ihren Betrieb innerhalb der Komfortgrenzen auf die PV-Erzeugung ab.",
        "Solarstrom kann einen Teil des elektrischen Bedarfs der Wärmepumpe decken. Dafür müssen Erzeugung und Betrieb zeitlich zusammenpassen. Eine geeignete Regelung kann flexible Betriebszeiten berücksichtigen.\n\nIm Winter ist der Heizbedarf häufig hoch, während die PV-Erzeugung geringer ausfällt. Die Kombination bedeutet deshalb keine vollständige Versorgung der Heizung allein durch Solarstrom.",
      ],
      [
        "waermepumpe-im-bestand",
        "Eignet sich eine Wärmepumpe für ein bestehendes Haus?",
        "Das hängt vor allem von Wärmebedarf, Heizflächen und den benötigten Vorlauftemperaturen ab. Das Baujahr allein entscheidet nicht.",
        "Vor einer Auswahl werden Gebäude, bisherige Heizung und Wärmeverteilung betrachtet. Die Heizlastberechnung bildet eine Grundlage für die erforderliche Leistung.\n\nAuch Aufstellort, Schall, elektrische Versorgung und Warmwasserbedarf gehören in die Planung. Ob zusätzliche Maßnahmen an Heizflächen oder Gebäude sinnvoll sind, wird im Einzelfall geprüft.",
      ],
      [
        "vorlauftemperatur-effizienz",
        "Warum ist die Vorlauftemperatur bei Wärmepumpen wichtig?",
        "Je höher das benötigte Temperaturniveau, desto anspruchsvoller ist die Wärmeerzeugung für die Wärmepumpe. Passende Heizflächen unterstützen einen effizienten Betrieb.",
        "Die Vorlauftemperatur beschreibt die Temperatur des Heizwassers, das zu den Heizflächen fließt. Ob niedrigere Temperaturen ausreichen, hängt von Heizflächen, Wärmebedarf und gewünschter Raumtemperatur ab.\n\nDeshalb werden Wärmepumpe und Wärmeverteilung als Gesamtsystem geplant. Einzelne Geräteeffizienzwerte reichen nicht aus, um den Verbrauch im Gebäude vorherzusagen.",
      ],
      [
        "jahresarbeitszahl-verstehen",
        "Was sagt die Jahresarbeitszahl einer Wärmepumpe aus?",
        "Die Jahresarbeitszahl setzt die über ein Jahr abgegebene Wärmemenge ins Verhältnis zur eingesetzten elektrischen Energie innerhalb der betrachteten Systemgrenze.",
        "Sie beschreibt die Effizienz über einen längeren Zeitraum. Damit unterscheidet sie sich von einem Gerätewert für einen einzelnen Prüfpunkt.\n\nVorlauftemperatur, Witterung, Warmwasserbereitung und Regelung beeinflussen den Betrieb. Eine angenommene Jahresarbeitszahl im Rechner ist daher eine Modellannahme und keine Garantie für das eigene Gebäude.",
      ],
      [
        "waermepumpe-planungsunterlagen",
        "Welche Angaben braucht die Wärmepumpenplanung?",
        "Benötigt werden Informationen zu Gebäude, beheizter Fläche, bisherigem Energieverbrauch, Heizflächen und Warmwasserbedarf.",
        "Hilfreich sind außerdem Unterlagen zur bestehenden Heizung, Angaben zu Dämmmaßnahmen und mögliche Standorte für die Technik. Verbrauchsdaten ermöglichen eine erste Einordnung.\n\nDie technische Planung ergänzt diese Angaben um die Heizlast und die Prüfung der örtlichen Bedingungen. Auch eine vorhandene PV-Anlage oder ein geplanter Speicher sollte angegeben werden.",
      ],
    ],
  },
  {
    slug: "klimaanlage",
    name: "Klimaanlage",
    route: "klimaanlagen",
    questions: [
      [
        "single-split-oder-multisplit",
        "Was unterscheidet Single-Split und Multisplit?",
        "Single-Split verbindet ein Innen- mit einem Außengerät. Multisplit verbindet mehrere Innengeräte mit einer gemeinsamen Außeneinheit.",
        "Single-Split eignet sich für die gezielte Klimatisierung eines einzelnen Bereichs. Multisplit kann mehrere Räume versorgen und die Anzahl der Außengeräte reduzieren.\n\nDie Auswahl hängt von Räumen, Nutzung, Leitungswegen und erforderlicher Leistung ab. Die einzelnen Räume können je nach System separat geregelt werden; die möglichen Betriebsarten sind geräteabhängig.",
      ],
      [
        "klimaanlage-leistung-planen",
        "Reicht die Raumfläche zur Auswahl einer Klimaanlage?",
        "Nein. Auch Fensterflächen, Sonneneinstrahlung, Dämmung, Raumhöhe, Nutzung und innere Wärmequellen beeinflussen die benötigte Kühlleistung.",
        "Zwei gleich große Räume können einen unterschiedlichen Kühlbedarf haben. Ein Dachgeschoss mit großen sonnenexponierten Fenstern stellt andere Anforderungen als ein gut verschatteter Raum.\n\nEine sorgfältige Auslegung berücksichtigt außerdem Luftverteilung und Nutzung. Eine pauschale Leistung pro Quadratmeter bietet höchstens eine erste Orientierung.",
      ],
      [
        "klimaanlage-mit-solarstrom",
        "Kann eine Klimaanlage mit Solarstrom laufen?",
        "Ja. Eine Klimaanlage kann Solarstrom aus der PV-Anlage nutzen, wenn Erzeugung und Verbrauch zeitlich zusammenfallen.",
        "An sonnigen Tagen können Kühlbedarf und PV-Erzeugung gut zusammenpassen. Wie viel eigener Strom tatsächlich genutzt wird, hängt auch von den übrigen Verbrauchern im Haus ab.\n\nDie Kombination wird deshalb gemeinsam mit Photovoltaik, möglichem Speicher und Energiemanagement betrachtet. Eine vollständige Deckung zu jeder Zeit ist damit nicht zugesichert.",
      ],
      [
        "klimaanlage-heizen",
        "Kann eine Klimaanlage auch heizen?",
        "Viele Split-Klimaanlagen können ihren Kältemittelkreislauf umkehren und Wärme in den Raum abgeben. Ob ein Gerät das unterstützt, ist systemabhängig.",
        "Die Heizfunktion kann insbesondere in der Übergangszeit für einzelne Räume nützlich sein. Leistung und Effizienz hängen unter anderem von Außenbedingungen und Geräteeigenschaften ab.\n\nOb sie als Ergänzung oder für einen weitergehenden Einsatz geeignet ist, wird anhand des Wärmebedarfs und der geplanten Nutzung geprüft.",
      ],
      [
        "klimaanlage-wartung",
        "Was ist bei Pflege und Wartung einer Klimaanlage wichtig?",
        "Filter, Kondensatablauf sowie Innen- und Außeneinheit sollten entsprechend den Herstellerangaben kontrolliert und gepflegt werden.",
        "Verschmutzungen können Luftstrom und Leistung beeinträchtigen. Ungewöhnliche Geräusche, Wasser am Innengerät oder nachlassende Kühlung sollten fachlich geprüft werden.\n\nWelche Arbeiten selbst möglich sind und welche ein Fachbetrieb übernimmt, ergibt sich aus der Bedienungsanleitung und der technischen Situation. Zugänglichkeit für Wartung gehört bereits in die Montageplanung.",
      ],
    ],
  },
  {
    slug: "wallbox",
    name: "Wallbox",
    route: "wallbox",
    questions: [
      [
        "pv-ueberschussladen",
        "Was ist PV-Überschussladen?",
        "Beim PV-Überschussladen nutzt das Elektroauto Solarstrom, der nach dem aktuellen Bedarf im Haus noch verfügbar ist.",
        "Eine geeignete Steuerung erfasst den verfügbaren Überschuss und passt die Ladung an. Dafür müssen Wallbox, Messtechnik und Energiemanagement technisch zusammenarbeiten.\n\nAuch das Fahrzeug muss angeschlossen sein, wenn Solarstrom verfügbar ist. Mindestladeleistung und mögliche Ladefunktionen hängen von den beteiligten Komponenten ab.",
      ],
      [
        "wallbox-ladeleistung",
        "Was bestimmt die tatsächliche Ladeleistung?",
        "Fahrzeug, Wallbox, elektrische Installation und verfügbare Anschlussleistung begrenzen gemeinsam die Ladeleistung.",
        "Die maximale Leistung auf dem Datenblatt der Wallbox ist nicht automatisch die Leistung, die beim Fahrzeug ankommt. Auch das Ladegerät im Auto und die eingestellte Begrenzung spielen eine Rolle.\n\nBei PV-Überschussladen kann die Ladeleistung zusätzlich mit der verfügbaren Solarenergie schwanken. Die Planung berücksichtigt Fahrbedarf und typische Standzeiten.",
      ],
      [
        "dynamisches-lastmanagement",
        "Wozu dient dynamisches Lastmanagement?",
        "Dynamisches Lastmanagement berücksichtigt den aktuellen Gebäudeverbrauch und passt die Ladeleistung an die verfügbare Leistung an.",
        "Wenn zum Beispiel Wärmepumpe und andere größere Verbraucher gleichzeitig laufen, bleibt weniger Leistung für das Elektroauto. Ein geeignetes Lastmanagement kann die Ladung entsprechend begrenzen.\n\nBei mehreren Ladepunkten wird zusätzlich die Verteilung unter den Fahrzeugen relevant. Messung, Steuerung und Installation müssen dafür aufeinander abgestimmt sein.",
      ],
      [
        "wallbox-ohne-speicher",
        "Brauche ich für eine Wallbox einen Stromspeicher?",
        "Nein. Eine Wallbox kann ohne Batteriespeicher betrieben werden und bei geeigneter Steuerung auch direkt verfügbaren Solarstrom nutzen.",
        "Ein Speicher ist eine mögliche Ergänzung des Energiesystems, aber keine technische Grundvoraussetzung für das Laden. Entscheidend ist, wann das Fahrzeug zu Hause steht und wie viel Solarstrom dann verfügbar ist.\n\nOb das Laden aus einem Hausspeicher sinnvoll ist, hängt von Kapazität, Leistung, Verlusten und dem übrigen Strombedarf ab. Das wird gemeinsam mit den Ladezielen betrachtet.",
      ],
      [
        "wallbox-installation-planung",
        "Was wird vor der Wallbox-Installation geprüft?",
        "Geprüft werden Hausanschluss, Elektroinstallation, Leitungsweg, Montageort sowie Fahrzeug und gewünschte Ladefunktionen.",
        "Die Wallbox wird als leistungsstarker Verbraucher in das Gebäude eingebunden. Passende Schutztechnik und die fachgerechte elektrische Installation gehören deshalb zur Umsetzung.\n\nWenn Photovoltaik, Speicher oder weitere Ladepunkte vorhanden oder geplant sind, werden deren Schnittstellen berücksichtigt. Fotos des Zählerschranks und Angaben zum Stellplatz helfen bei der ersten Aufnahme.",
      ],
    ],
  },
];
