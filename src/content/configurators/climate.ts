import type {
    ClimateStepDefinition,
    ConfiguratorSelectionOption,
  } from "@/types/configurator";
  import type {
    ClimateInsulationLevel,
    ClimateSolarLoad,
  } from "@/types/climate-calculator";
  
  export const climateWizardSteps: readonly ClimateStepDefinition[] =
    [
      {
        id: "rooms",
        title: "Welche Räume möchtest du klimatisieren?",
        shortLabel: "Räume",
        description:
          "Gib die gesamte zu klimatisierende Fläche und die Anzahl der getrennten Räume oder Zonen an.",
        phase: "configuration",
      },
      {
        id: "insulation",
        title: "Wie ist der energetische Zustand des Gebäudes?",
        shortLabel: "Gebäude",
        description:
          "Der Gebäudezustand beeinflusst, wie viel Wärme von außen in die Räume gelangt.",
        phase: "configuration",
      },
      {
        id: "solar_load",
        title: "Wie stark heizen sich die Räume durch Sonne auf?",
        shortLabel: "Sonne",
        description:
          "Große oder stark besonnte Fensterflächen können den Kühlbedarf deutlich erhöhen.",
        phase: "configuration",
      },
      {
        id: "occupancy",
        title: "Wie viele Personen sind üblicherweise gleichzeitig anwesend?",
        shortLabel: "Personen",
        description:
          "Auch Personen geben Wärme an den Raum ab und werden deshalb in der überschlägigen Kühlleistung berücksichtigt.",
        phase: "configuration",
      },
    ];
  
  export const climateInsulationOptions: readonly ConfiguratorSelectionOption<ClimateInsulationLevel>[] =
    [
      {
        value: "good",
        title: "Gut",
        description:
          "Gute Dämmung oder moderner energetischer Gebäudezustand.",
      },
      {
        value: "average",
        title: "Durchschnittlich",
        description:
          "Üblicher Gebäudezustand ohne besonders gute oder besonders schwache Dämmung.",
      },
      {
        value: "weak",
        title: "Eher schwach",
        description:
          "Schwächere Dämmung oder Gebäude mit erhöhtem Wärmeeintrag.",
      },
    ];
  
  export const climateSolarLoadOptions: readonly ConfiguratorSelectionOption<ClimateSolarLoad>[] =
    [
      {
        value: "low",
        title: "Gering",
        description:
          "Wenig direkte Sonne oder gut verschattete Fenster.",
      },
      {
        value: "medium",
        title: "Mittel",
        description:
          "Zeitweise direkte Sonne und eine durchschnittliche Fensterfläche.",
      },
      {
        value: "high",
        title: "Hoch",
        description:
          "Große oder stark besonnte Fensterflächen und deutliche sommerliche Aufheizung.",
      },
    ];