export const FAQ_ROUTE_KEYS = [
  "home",
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
  "photovoltaik",
  "pv-rechner",
  "pv-kostenrechner",
  "klima-kostenrechner",
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
