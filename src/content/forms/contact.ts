import type {
    BuildingType,
    ContactInterest,
    ContactPreference,
    Ownership,
  } from "@/types/contact-lead";
  
  interface ContactFormOption<T extends string> {
    value: T;
    label: string;
    description: string;
  }
  
  export const contactFormContent = {
    eyebrow: "Projektanfrage",
    title: "Erzählen Sie uns von Ihrem Vorhaben",
    description:
      "Mit einigen Angaben können wir Ihre Anfrage schneller der richtigen Fachrichtung zuordnen. Sie können selbstverständlich auch mehrere Energielösungen auswählen.",
  
    interests: [
      {
        value: "photovoltaik",
        label: "Photovoltaik",
        description: "Solarstrom auf dem eigenen Dach erzeugen.",
      },
      {
        value: "stromspeicher",
        label: "Stromspeicher",
        description:
          "Eigenen Solarstrom speichern und flexibler nutzen.",
      },
      {
        value: "wallbox",
        label: "Wallbox",
        description:
          "Elektrofahrzeug zu Hause oder im Betrieb laden.",
      },
      {
        value: "klimaanlage",
        label: "Klimaanlage",
        description:
          "Wohn- oder Gewerberäume effizient klimatisieren.",
      },
      {
        value: "waermepumpe",
        label: "Wärmepumpe",
        description:
          "Gebäude effizient und zukunftsorientiert beheizen.",
      },
      {
        value: "sonstiges",
        label: "Sonstiges",
        description:
          "Eine andere Frage oder ein kombiniertes Energieprojekt.",
      },
    ] satisfies readonly ContactFormOption<ContactInterest>[],
  
    buildingTypes: [
      {
        value: "einfamilienhaus",
        label: "Einfamilienhaus",
        description: "Ein Wohngebäude mit einer Wohneinheit.",
      },
      {
        value: "mehrfamilienhaus",
        label: "Mehrfamilienhaus",
        description: "Wohngebäude mit mehreren Wohneinheiten.",
      },
      {
        value: "gewerbe",
        label: "Gewerbe",
        description: "Gewerbe-, Büro- oder Betriebsgebäude.",
      },
      {
        value: "sonstiges",
        label: "Sonstiges",
        description: "Andere Gebäude- oder Nutzungsart.",
      },
    ] satisfies readonly ContactFormOption<BuildingType>[],
  
    ownershipOptions: [
      {
        value: "eigentuemer",
        label: "Eigentümer",
        description: "Das Gebäude befindet sich in Ihrem Eigentum.",
      },
      {
        value: "mieter",
        label: "Mieter",
        description: "Sie nutzen das Gebäude als Mieter.",
      },
      {
        value: "sonstiges",
        label: "Sonstiges",
        description: "Andere Eigentums- oder Nutzungssituation.",
      },
    ] satisfies readonly ContactFormOption<Ownership>[],
  
    contactPreferences: [
      {
        value: "telefon",
        label: "Telefon",
        description: "Wir melden uns bevorzugt telefonisch.",
      },
      {
        value: "email",
        label: "E-Mail",
        description: "Wir melden uns bevorzugt per E-Mail.",
      },
      {
        value: "egal",
        label: "Keine Präferenz",
        description: "Telefon oder E-Mail – beides ist für Sie in Ordnung.",
      },
    ] satisfies readonly ContactFormOption<ContactPreference>[],
  } as const;