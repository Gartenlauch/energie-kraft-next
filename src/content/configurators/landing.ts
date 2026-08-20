import type {
  ConfiguratorLandingProduct,
  ConfiguratorType,
} from "@/types/configurator";
import type { SeoContent } from "@/types/content";

export const configuratorProducts = {
  photovoltaic: {
    type: "photovoltaic",
    title: "Photovoltaik",
    shortLabel: "PV-Anlage",
    description:
      "Ermittle mit wenigen Angaben eine passende Größenordnung für deine Photovoltaikanlage.",
    href: "/konfigurator/photovoltaik",
    serviceHref: "/photovoltaik",
    availability: "next",
    statusLabel: "Als Erstes verfügbar",
    seo: {
      title: "Photovoltaik-Konfigurator | Energie-Kraft Süd",
      description:
        "Mit dem Photovoltaik-Konfigurator von Energie-Kraft Süd Schritt für Schritt eine passende Größenordnung für die eigene PV-Anlage ermitteln.",
      canonicalPath: "/konfigurator/photovoltaik",
      noIndex: true,
    },
  },

  battery_storage: {
    type: "battery_storage",
    title: "Stromspeicher",
    shortLabel: "Speicher",
    description:
      "Finde heraus, welche Speicherlösung zu deinem Stromverbrauch und deiner Photovoltaikanlage passen kann.",
    href: "/konfigurator/stromspeicher",
    serviceHref: "/stromspeicher",
    availability: "planned",
    statusLabel: "In Vorbereitung",
    seo: {
      title: "Stromspeicher-Konfigurator | Energie-Kraft Süd",
      description:
        "Mit dem Stromspeicher-Konfigurator von Energie-Kraft Süd eine passende Speicherlösung vorbereiten.",
      canonicalPath: "/konfigurator/stromspeicher",
      noIndex: true,
    },
  },

  climate: {
    type: "climate",
    title: "Klimaanlage",
    shortLabel: "Klima",
    description:
      "Bereite die wichtigsten Angaben für eine passende Klimatisierung deines Gebäudes vor.",
    href: "/konfigurator/klimaanlage",
    serviceHref: "/klimaanlagen",
    availability: "planned",
    statusLabel: "In Vorbereitung",
    seo: {
      title: "Klimaanlagen-Konfigurator | Energie-Kraft Süd",
      description:
        "Mit dem Klimaanlagen-Konfigurator von Energie-Kraft Süd die wichtigsten Angaben für eine passende Klimatisierung vorbereiten.",
      canonicalPath: "/konfigurator/klimaanlage",
      noIndex: true,
    },
  },

  heat_pump: {
    type: "heat_pump",
    title: "Wärmepumpe",
    shortLabel: "Wärmepumpe",
    description:
      "Erfasse die wichtigsten Gebäudedaten für eine erste Einordnung einer Wärmepumpenlösung.",
    href: "/konfigurator/waermepumpe",
    serviceHref: "/waermepumpen",
    availability: "planned",
    statusLabel: "In Vorbereitung",
    seo: {
      title: "Wärmepumpen-Konfigurator | Energie-Kraft Süd",
      description:
        "Mit dem Wärmepumpen-Konfigurator von Energie-Kraft Süd Gebäudedaten für eine erste Einordnung erfassen.",
      canonicalPath: "/konfigurator/waermepumpe",
      noIndex: true,
    },
  },

  wallbox: {
    type: "wallbox",
    title: "Wallbox",
    shortLabel: "Wallbox",
    description:
      "Bereite die grundlegenden Angaben für eine passende Ladelösung zu Hause vor.",
    href: "/konfigurator/wallbox",
    serviceHref: "/wallbox",
    availability: "planned",
    statusLabel: "In Vorbereitung",
    seo: {
      title: "Wallbox-Konfigurator | Energie-Kraft Süd",
      description:
        "Mit dem Wallbox-Konfigurator von Energie-Kraft Süd die grundlegenden Angaben für eine passende Ladelösung vorbereiten.",
      canonicalPath: "/konfigurator/wallbox",
      noIndex: true,
    },
  },
} satisfies Record<ConfiguratorType, ConfiguratorLandingProduct>;

export const configuratorProductList = [
  configuratorProducts.photovoltaic,
  configuratorProducts.battery_storage,
  configuratorProducts.climate,
  configuratorProducts.heat_pump,
  configuratorProducts.wallbox,
] as const;

export const configuratorLandingContent = {
  seo: {
    title:
      "Energie-Konfigurator für Photovoltaik, Speicher & mehr | Energie-Kraft Süd",
    description:
      "Mit dem Energie-Kraft Konfigurator Photovoltaik, Stromspeicher, Klimaanlage, Wärmepumpe und Wallbox Schritt für Schritt passend zum eigenen Gebäude vorbereiten.",
    canonicalPath: "/konfigurator",
  } satisfies SeoContent,

  breadcrumbLabel: "Energie-Konfigurator",

  hero: {
    eyebrow: "Energie passend zum Zuhause",
    title: "Welche Energielösung passt zu deinem Zuhause?",
    description:
      "Wähle dein Projekt aus und beantworte anschließend nur die Fragen, die für deine Situation relevant sind. Du erhältst eine erste Orientierung und kannst deine Angaben direkt für eine persönliche Beratung verwenden.",
  },

  house: {
    eyebrow: "Dein Zuhause im Mittelpunkt",
    title: "Starte dort, wo du Energie nutzen oder erzeugen möchtest",
    description:
      "Photovoltaik, Speicher, Klimatisierung, Wärmepumpe und Wallbox können einzeln geplant oder später sinnvoll miteinander kombiniert werden.",
  },
} as const;