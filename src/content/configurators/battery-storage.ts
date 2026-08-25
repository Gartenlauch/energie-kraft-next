import type {
    BatteryStorageBackupPreference,
    BatteryStorageConsumptionPattern,
    BatteryStorageGoal,
    BatteryStorageStepDefinition,
    ConfiguratorSelectionOption,
  } from "@/types/configurator";
  
  export const batteryStorageWizardSteps: readonly BatteryStorageStepDefinition[] =
    [
      {
        id: "system_data",
        title: "Welche Ausgangsdaten hat deine Anlage?",
        shortLabel: "Anlagendaten",
        description:
          "Für die Speicherempfehlung benötigen wir deinen Jahresstromverbrauch und die Leistung deiner Photovoltaikanlage.",
        phase: "configuration",
      },
      {
        id: "consumption_pattern",
        title: "Wann verbrauchst du den meisten Strom?",
        shortLabel: "Verbrauchszeit",
        description:
          "Der Zeitpunkt des Stromverbrauchs beeinflusst, wie stark ein Speicher den Eigenverbrauch erhöhen kann.",
        phase: "configuration",
      },
      {
        id: "backup_preference",
        title: "Ist dir Ersatzstrom wichtig?",
        shortLabel: "Ersatzstrom",
        description:
          "Ersatz- oder Notstrom muss technisch zur gewünschten Versorgung und zur Elektroinstallation passen.",
        phase: "configuration",
      },
      {
        id: "goal",
        title: "Was ist dir bei deinem Stromspeicher besonders wichtig?",
        shortLabel: "Ziel",
        description:
          "Wir verwenden deine Auswahl für die Größenordnung des Speichers – ohne unnötige Überdimensionierung.",
        phase: "configuration",
      },
    ];
  
  export const batteryStorageConsumptionPatternOptions: readonly ConfiguratorSelectionOption<BatteryStorageConsumptionPattern>[] =
    [
      {
        value: "mostly_daytime",
        title: "Überwiegend tagsüber",
        description:
          "Ein größerer Teil des erzeugten Solarstroms kann direkt verbraucht werden.",
      },
      {
        value: "mixed",
        title: "Über den Tag verteilt",
        description:
          "Strom wird sowohl tagsüber als auch morgens und abends genutzt.",
      },
      {
        value: "mostly_evening",
        title: "Vor allem morgens und abends",
        description:
          "Ein größerer Teil des Verbrauchs fällt außerhalb der typischen PV-Erzeugungszeit an.",
      },
    ];
  
  export const batteryStorageBackupOptions: readonly ConfiguratorSelectionOption<BatteryStorageBackupPreference>[] =
    [
      {
        value: "none",
        title: "Nein",
        description:
          "Der Speicher soll vor allem Eigenverbrauch und Wirtschaftlichkeit unterstützen.",
      },
      {
        value: "selected_loads",
        title: "Ausgewählte Verbraucher",
        description:
          "Bei einem Stromausfall sollen wichtige Verbraucher weiter versorgt werden.",
      },
      {
        value: "whole_home",
        title: "Möglichst das ganze Haus",
        description:
          "Eine umfassende Ersatzstromversorgung soll technisch geprüft werden.",
      },
    ];
  
  export const batteryStorageGoalOptions: readonly ConfiguratorSelectionOption<BatteryStorageGoal>[] =
    [
      {
        value: "economic",
        title: "Wirtschaftlich",
        description:
          "Eher kompakter Speicher mit Fokus auf sinnvolle Nutzung und geringe Überdimensionierung.",
      },
      {
        value: "balanced",
        title: "Ausgewogen",
        description:
          "Guter Kompromiss aus Speicherkapazität, Eigenverbrauch und Reserven.",
      },
      {
        value: "high_autonomy",
        title: "Möglichst hohe Autarkie",
        description:
          "Mehr Speicherkapazität innerhalb unserer fachlichen Obergrenze.",
      },
    ];