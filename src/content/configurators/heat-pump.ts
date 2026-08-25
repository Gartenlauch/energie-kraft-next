import type {
    ConfiguratorSelectionOption,
    HeatPumpStepDefinition,
  } from "@/types/configurator";
  
  export const heatPumpWizardSteps: readonly HeatPumpStepDefinition[] =
    [
      {
        id: "heated_area",
        title: "Wie groß ist die beheizte Fläche?",
        shortLabel: "Fläche",
        description:
          "Gib die Wohn- oder Nutzfläche an, die künftig durch die Wärmepumpe beheizt werden soll.",
        phase: "configuration",
      },
      {
        id: "heating_demand",
        title: "Wie hoch ist der Wärmebedarf deines Gebäudes?",
        shortLabel: "Wärmebedarf",
        description:
          "Wenn du keinen genauen Wert kennst, kannst du eine passende Gebäudeorientierung auswählen. Der Wert dient nur als erste Modellannahme.",
        phase: "configuration",
      },
      {
        id: "occupancy",
        title: "Wie viele Personen leben im Haushalt?",
        shortLabel: "Personen",
        description:
          "Die Personenzahl wird für die überschlägige Warmwasserberechnung verwendet.",
        phase: "configuration",
      },
      {
        id: "flow_temperature",
        title: "Welche Vorlauftemperatur benötigt deine Heizung?",
        shortLabel: "Vorlauf",
        description:
          "Entscheidend ist die ungefähr höchste benötigte Vorlauftemperatur an kalten Tagen.",
        phase: "configuration",
      },
      {
        id: "efficiency",
        title: "Welche Effizienz sollen wir annehmen?",
        shortLabel: "Effizienz",
        description:
          "Die Jahresarbeitszahl beschreibt das Verhältnis zwischen erzeugter Wärme und eingesetztem Strom.",
        phase: "configuration",
      },
    ];
  
  export const heatPumpHeatingDemandOptions: readonly ConfiguratorSelectionOption<number>[] =
    [
      {
        value: 50,
        title: "Ca. 50 kWh/m²",
        description:
          "Sehr gut gedämmtes oder energetisch hochwertiges Gebäude.",
      },
      {
        value: 90,
        title: "Ca. 90 kWh/m²",
        description:
          "Gute bis durchschnittliche energetische Ausgangssituation.",
      },
      {
        value: 140,
        title: "Ca. 140 kWh/m²",
        description:
          "Älteres Gebäude oder höherer Heizenergiebedarf.",
      },
      {
        value: 200,
        title: "Ca. 200 kWh/m²",
        description:
          "Hoher Wärmebedarf. Eine genauere energetische Prüfung ist besonders sinnvoll.",
      },
    ];
  
  export const heatPumpOccupancyOptions: readonly ConfiguratorSelectionOption<number>[] =
    [
      {
        value: 1,
        title: "1 Person",
        description: "Einpersonenhaushalt.",
      },
      {
        value: 2,
        title: "2 Personen",
        description: "Zweipersonenhaushalt.",
      },
      {
        value: 3,
        title: "3 Personen",
        description: "Dreipersonenhaushalt.",
      },
      {
        value: 4,
        title: "4 Personen",
        description: "Vierpersonenhaushalt.",
      },
      {
        value: 5,
        title: "5 oder mehr",
        description:
          "Für die Modellrechnung werden zunächst fünf Personen angesetzt.",
      },
    ];
  
  export const heatPumpFlowTemperatureOptions: readonly ConfiguratorSelectionOption<number>[] =
    [
      {
        value: 35,
        title: "Ca. 35 °C",
        description:
          "Typischer Niedertemperaturbereich, beispielsweise bei geeigneter Fußbodenheizung.",
      },
      {
        value: 45,
        title: "Ca. 45 °C",
        description:
          "Moderater Vorlauf bei geeigneten Heizflächen.",
      },
      {
        value: 55,
        title: "Ca. 55 °C",
        description:
          "Oberer Bereich unserer Niedertemperatur-Modellbewertung.",
      },
      {
        value: 60,
        title: "60 °C oder höher",
        description:
          "Das Heizsystem sollte vor einer Wärmepumpenentscheidung genauer geprüft werden.",
      },
    ];
  
  export const heatPumpEfficiencyOptions: readonly ConfiguratorSelectionOption<number>[] =
    [
      {
        value: 3,
        title: "JAZ 3,0",
        description:
          "Vorsichtige Modellannahme für weniger günstige Betriebsbedingungen.",
      },
      {
        value: 3.5,
        title: "JAZ 3,5",
        description:
          "Ausgewogene Standardannahme unseres Wärmepumpenmodells.",
      },
      {
        value: 4,
        title: "JAZ 4,0",
        description:
          "Effizienter Betrieb bei guten Systembedingungen.",
      },
      {
        value: 4.5,
        title: "JAZ 4,5",
        description:
          "Sehr gute Modellannahme bei entsprechend günstiger Auslegung.",
      },
    ];