import type {
    ConfiguratorSelectionOption,
    WallboxChargingPowerKw,
    WallboxStepDefinition,
} from "@/types/configurator";

export const wallboxWizardSteps: readonly WallboxStepDefinition[] =
    [
        {
            id: "vehicle_data",
            title: "Wie sieht dein Elektrofahrzeug aus?",
            shortLabel: "Fahrzeug",
            description:
                "Fahrleistung, Verbrauch und Batteriekapazität bestimmen den typischen Ladebedarf.",
            phase: "configuration",
        },
        {
            id: "home_charging",
            title: "Wie viel möchtest du zu Hause laden?",
            shortLabel: "Heimladen",
            description:
                "Schätze, welcher Anteil des jährlichen Fahrstroms voraussichtlich an deiner eigenen Wallbox geladen wird.",
            phase: "configuration",
        },
        {
            id: "charging_power",
            title: "Welche Ladeleistung möchtest du?",
            shortLabel: "Ladeleistung",
            description:
                "11 kW sind für viele private Anwendungen ein sinnvoller Standard. Die tatsächlich mögliche Leistung hängt von Fahrzeug und Elektroinstallation ab.",
            phase: "configuration",
        },
        {
            id: "photovoltaics",
            title: "Wie viel Solarstrom möchtest du zum Laden nutzen?",
            shortLabel: "Photovoltaik",
            description:
                "Der tatsächliche PV-Anteil hängt unter anderem von Fahrzeugstandzeiten, PV-Erzeugung und Energiemanagement ab.",
            phase: "configuration",
        },
    ];

export const wallboxHomeChargingOptions: readonly ConfiguratorSelectionOption<number>[] =
    [
        {
            value: 30,
            title: "Etwa 30 %",
            description:
                "Ein größerer Teil wird unterwegs oder öffentlich geladen.",
        },
        {
            value: 50,
            title: "Etwa die Hälfte",
            description:
                "Heimladen und öffentliches Laden sind ungefähr gleich wichtig.",
        },
        {
            value: 80,
            title: "Überwiegend zu Hause",
            description:
                "Die eigene Wallbox ist der wichtigste Ladepunkt.",
        },
        {
            value: 100,
            title: "Fast ausschließlich zu Hause",
            description:
                "Im Modell wird praktisch der gesamte Fahrstrom zu Hause geladen.",
        },
    ];

export const wallboxChargingPowerOptions: readonly ConfiguratorSelectionOption<WallboxChargingPowerKw>[] =
    [
        {
            value: 3.7,
            title: "3,7 kW",
            description:
                "Langsameres Laden bei langen Standzeiten und geringerem Ladebedarf.",
        },
        {
            value: 11,
            title: "11 kW",
            description:
                "Typische Ladeleistung für viele private Wallbox-Anwendungen.",
        },
        {
            value: 22,
            title: "22 kW",
            description:
                "Erhöhte Ladeleistung. Fahrzeug, Netzanschluss und Installation müssen dafür geeignet sein.",
        },
    ];

export const wallboxPvChargingOptions: readonly ConfiguratorSelectionOption<number>[] =
    [
        {
            value: 0,
            title: "Kein PV-Strom",
            description:
                "Das Fahrzeug wird im Modell vollständig mit Netzstrom geladen.",
        },
        {
            value: 30,
            title: "Etwa 30 %",
            description:
                "Ein Teil des Heimladens wird mit eigener Solarenergie abgedeckt.",
        },
        {
            value: 60,
            title: "Etwa 60 %",
            description:
                "Das Fahrzeug kann häufig während geeigneter PV-Zeiten geladen werden.",
        },
        {
            value: 80,
            title: "Hoher PV-Anteil",
            description:
                "Das Ladeverhalten soll möglichst stark auf die eigene PV-Erzeugung abgestimmt werden.",
        },
    ];