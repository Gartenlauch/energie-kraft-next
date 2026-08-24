import {
    getPhotovoltaicHouseholdConsumptionDefault,
  } from "@/lib/configurator/photovoltaic";
  import type {
    BuildingOwnership,
    BuildingType,
    ConfiguratorSelectionOption,
    HouseholdPersons,
    PhotovoltaicStepDefinition,
  } from "@/types/configurator";
  
  function formatKwh(value: number): string {
    return new Intl.NumberFormat("de-DE").format(value);
  }
  
  export const photovoltaicWizardSteps = [
    {
      id: "household_persons",
      title: "Wie viele Personen leben in deinem Haushalt?",
      shortLabel: "Haushalt",
      description:
        "Die Haushaltsgröße hilft uns, deinen Stromverbrauch sinnvoll vorzubelegen.",
      phase: "configuration",
    },
    {
      id: "ownership",
      title: "Bist du Eigentümer oder Mieter?",
      shortLabel: "Eigentum",
      description:
        "Für eine fest installierte Photovoltaikanlage ist die Zustimmung des Eigentümers erforderlich.",
      phase: "configuration",
    },
    {
      id: "building_type",
      title: "Um welche Gebäudeart handelt es sich?",
      shortLabel: "Gebäude",
      description:
        "Wähle die Gebäudeart, auf der die Photovoltaikanlage geplant werden soll.",
      phase: "configuration",
    },
    {
      id: "annual_consumption",
      title: "Wie hoch ist dein Jahresstromverbrauch?",
      shortLabel: "Verbrauch",
      description:
        "Wir haben anhand deiner Haushaltsgröße bereits einen Richtwert vorausgewählt. Du kannst ihn jederzeit ändern.",
      phase: "configuration",
    },
  ] as const satisfies readonly [
    PhotovoltaicStepDefinition,
    ...PhotovoltaicStepDefinition[],
  ];
  
  export const photovoltaicHouseholdPersonOptions = [
    {
      value: 1,
      title: "1 Person",
      description: `Richtwert: ${formatKwh(
        getPhotovoltaicHouseholdConsumptionDefault(1),
      )} kWh/Jahr`,
    },
    {
      value: 2,
      title: "2 Personen",
      description: `Richtwert: ${formatKwh(
        getPhotovoltaicHouseholdConsumptionDefault(2),
      )} kWh/Jahr`,
    },
    {
      value: 3,
      title: "3 Personen",
      description: `Richtwert: ${formatKwh(
        getPhotovoltaicHouseholdConsumptionDefault(3),
      )} kWh/Jahr`,
    },
    {
      value: "4_5",
      title: "4–5 Personen",
      description: `Richtwert: ${formatKwh(
        getPhotovoltaicHouseholdConsumptionDefault("4_5"),
      )} kWh/Jahr`,
    },
  ] satisfies readonly ConfiguratorSelectionOption<HouseholdPersons>[];
  
  export const photovoltaicOwnershipOptions = [
    {
      value: "owner",
      title: "Eigentümer",
      description:
        "Ich bin Eigentümer der Immobilie oder kann über die Installation entscheiden.",
    },
    {
      value: "tenant",
      title: "Mieter",
      description:
        "Ich wohne zur Miete und bin nicht Eigentümer der Immobilie.",
    },
  ] satisfies readonly ConfiguratorSelectionOption<BuildingOwnership>[];
  
  export const photovoltaicBuildingTypeOptions = [
    {
      value: "detached_house",
      title: "Freistehendes Einfamilienhaus",
    },
    {
      value: "semi_detached_house",
      title: "Doppelhaushälfte",
    },
    {
      value: "mid_terrace_house",
      title: "Reihenmittelhaus",
    },
    {
      value: "end_terrace_house",
      title: "Reihenendhaus",
    },
    {
      value: "multi_family_house",
      title: "Mehrfamilienhaus",
    },
  ] satisfies readonly ConfiguratorSelectionOption<BuildingType>[];
  
  export const photovoltaicConfiguratorContent = {
    eyebrow: "Photovoltaik-Konfigurator",
  
    intro:
      "Beantworte Schritt für Schritt einige kurze Fragen. Deine Angaben bleiben erhalten, wenn du innerhalb des Konfigurators zurückgehst.",
  
    consumptionHelp:
      "Den tatsächlichen Jahresstromverbrauch findest du in der Regel auf deiner letzten Stromabrechnung.",
  
    tenant: {
      title: "Für die Installation brauchst du die Zustimmung des Eigentümers.",
      description:
        "Sprich zunächst mit deinem Vermieter bzw. Eigentümer. Sobald eine Zustimmung vorliegt, unterstützen wir dich gerne bei der weiteren Planung.",
    },
  } as const;