export const CONTACT_FORM_HREF = "/kontakt#kontaktformular";

export const FAQ_ROUTE_KEYS = [
  "home",
  "konfigurator",
  "photovoltaik",
  "stromspeicher",
  "wallbox",
  "klimaanlagen",
  "waermepumpen",
  "kontakt",
] as const;

export type FaqRouteKey = (typeof FAQ_ROUTE_KEYS)[number];

export const FAQ_ROUTE_LABELS = {
  home: "Startseite",
  konfigurator: "Energie-Konfigurator",
  photovoltaik: "Photovoltaik",
  stromspeicher: "Stromspeicher",
  wallbox: "Wallbox",
  klimaanlagen: "Klimaanlagen",
  waermepumpen: "Wärmepumpen",
  kontakt: "Kontakt",
} satisfies Record<FaqRouteKey, string>;

export function isFaqRouteKey(value: string): value is FaqRouteKey {
  return FAQ_ROUTE_KEYS.some((routeKey) => routeKey === value);
}

export const PUBLIC_ROUTE_KEYS = [
  "home",
  "konfigurator",
  "photovoltaik",
  "pv-rechner",
  "pv-kostenrechner",
  "klima-kostenrechner",
  "waermepumpen-rechner",
  "wallbox-rechner",
  "energieloesungen",
  "photovoltaik-fuer-unternehmen",
  "stromtarife-pv",
  "service-und-wartung",
  "service-und-team",
  "pv-referenzen",
  "ueber-uns",
  "jobs",
  "bewerbung",
  "kunden-werben-kunden",
  "stromspeicher",
  "wallbox",
  "klimaanlagen",
  "waermepumpen",
  "kontakt",
] as const;

export type PublicRouteKey = (typeof PUBLIC_ROUTE_KEYS)[number];

export interface PublicRouteConfig {
  key: PublicRouteKey;
  href: string;
  label: string;
  faqRouteKey: FaqRouteKey;

  navigation: {
    header: boolean;
    footer: boolean;
  };

  sitemap: {
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: number;
  };
}

export const PUBLIC_ROUTES = {
  home: {
    key: "home",
    href: "/",
    label: "Startseite",
    faqRouteKey: "home",
    navigation: {
      header: false,
      footer: false,
    },
    sitemap: {
      changeFrequency: "weekly",
      priority: 1,
    },
  },
  konfigurator: {
    key: "konfigurator",
    href: "/konfigurator",
    label: "Energie-Konfigurator",
    faqRouteKey: "konfigurator",
    navigation: {
      header: false,
      footer: false,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.9,
    },
  },

  photovoltaik: {
    key: "photovoltaik",
    href: "/photovoltaik",
    label: "Photovoltaik",
    faqRouteKey: "photovoltaik",
    navigation: {
      header: true,
      footer: true,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.9,
    },
  },

  "pv-rechner": {
    key: "pv-rechner",
    href: "/rechner/photovoltaik",
    label: "PV-Rechner",
    faqRouteKey: "photovoltaik",
    navigation: {
      header: false,
      footer: false,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.8,
    },
  },
  "pv-kostenrechner": {
    key: "pv-kostenrechner",
    href: "/rechner/photovoltaik-kosten",
    label: "PV-Kostenrechner",
    faqRouteKey: "photovoltaik",
    navigation: {
      header: false,
      footer: false,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.8,
    },
  },
  "klima-kostenrechner": {
    key: "klima-kostenrechner",
    href: "/rechner/klimaanlage-kosten",
    label: "Klimaanlagen-Kostenrechner",
    faqRouteKey: "klimaanlagen",
    navigation: {
      header: false,
      footer: false,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.8,
    },
  },
  "waermepumpen-rechner": {
    key: "waermepumpen-rechner",
    href: "/rechner/waermepumpe-kosten",
    label: "Wärmepumpen-Rechner",
    faqRouteKey: "waermepumpen",
    navigation: {
      header: false,
      footer: false,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.8,
    },
  },
  "wallbox-rechner": {
    key: "wallbox-rechner",
    href: "/rechner/wallbox-kosten",
    label: "Wallbox-Rechner",
    faqRouteKey: "wallbox",
    navigation: {
      header: false,
      footer: false,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.7,
    },
  },
  energieloesungen: {
    key: "energieloesungen",
    href: "/energieloesungen",
    label: "Energielösungen",
    faqRouteKey: "home",
    navigation: { header: true, footer: true },
    sitemap: { changeFrequency: "monthly", priority: 0.9 },
  },
  "photovoltaik-fuer-unternehmen": {
    key: "photovoltaik-fuer-unternehmen",
    href: "/energieloesungen/photovoltaik-fuer-unternehmen",
    label: "Photovoltaik für Unternehmen",
    faqRouteKey: "photovoltaik",
    navigation: { header: true, footer: true },
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },
  "stromtarife-pv": {
    key: "stromtarife-pv",
    href: "/energieloesungen/stromtarife-pv",
    label: "Stromtarife",
    faqRouteKey: "stromspeicher",
    navigation: { header: true, footer: true },
    sitemap: { changeFrequency: "monthly", priority: 0.6 },
  },
  "service-und-wartung": {
    key: "service-und-wartung",
    href: "/service-und-wartung",
    label: "Service & Wartung",
    faqRouteKey: "kontakt",
    navigation: {
      header: false,
      footer: false,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.8,
    },
  },
  "service-und-team": {
    key: "service-und-team",
    href: "/service-und-wartung/service-und-team",
    label: "Service & Team",
    faqRouteKey: "kontakt",
    navigation: { header: true, footer: true },
    sitemap: { changeFrequency: "monthly", priority: 0.7 },
  },
  "pv-referenzen": {
    key: "pv-referenzen",
    href: "/pv-referenzen",
    label: "Referenzen",
    faqRouteKey: "home",
    navigation: {
      header: false,
      footer: false,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.7,
    },
  },
  "ueber-uns": {
    key: "ueber-uns",
    href: "/ueber-uns",
    label: "Über uns",
    faqRouteKey: "home",
    navigation: { header: true, footer: true },
    sitemap: { changeFrequency: "monthly", priority: 0.7 },
  },
  jobs: {
    key: "jobs",
    href: "/jobs",
    label: "Jobs",
    faqRouteKey: "kontakt",
    navigation: {
      header: false,
      footer: false,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.6,
    },
  },
  bewerbung: {
    key: "bewerbung",
    href: "/bewerbung",
    label: "Bewerbung",
    faqRouteKey: "kontakt",
    navigation: { header: false, footer: false },
    sitemap: { changeFrequency: "monthly", priority: 0.5 },
  },
  "kunden-werben-kunden": {
    key: "kunden-werben-kunden",
    href: "/kunden-werben-kunden",
    label: "Kunden werben Kunden",
    faqRouteKey: "kontakt",
    navigation: { header: false, footer: true },
    sitemap: { changeFrequency: "monthly", priority: 0.5 },
  },
  stromspeicher: {
    key: "stromspeicher",
    href: "/stromspeicher",
    label: "Stromspeicher",
    faqRouteKey: "stromspeicher",
    navigation: {
      header: true,
      footer: true,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.9,
    },
  },

  wallbox: {
    key: "wallbox",
    href: "/wallbox",
    label: "Wallbox",
    faqRouteKey: "wallbox",
    navigation: {
      header: true,
      footer: true,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.8,
    },
  },

  klimaanlagen: {
    key: "klimaanlagen",
    href: "/klimaanlagen",
    label: "Klimaanlagen",
    faqRouteKey: "klimaanlagen",
    navigation: {
      header: true,
      footer: true,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.9,
    },
  },

  waermepumpen: {
    key: "waermepumpen",
    href: "/waermepumpen",
    label: "Wärmepumpen",
    faqRouteKey: "waermepumpen",
    navigation: {
      header: true,
      footer: true,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.9,
    },
  },

  kontakt: {
    key: "kontakt",
    href: "/kontakt",
    label: "Kontakt",
    faqRouteKey: "kontakt",
    navigation: {
      header: true,
      footer: false,
    },
    sitemap: {
      changeFrequency: "monthly",
      priority: 0.7,
    },
  },
} satisfies Record<PublicRouteKey, PublicRouteConfig>;

export const PUBLIC_ROUTE_LIST = PUBLIC_ROUTE_KEYS.map((routeKey) => PUBLIC_ROUTES[routeKey]);
