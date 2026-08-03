export const LEGAL_ROUTES = {
  impressum: {
    href: "/impressum",
    label: "Impressum",
  },
  datenschutz: {
    href: "/datenschutz",
    label: "Datenschutz",
  },
  agb: {
    href: "/agb",
    label: "AGB",
  },
} as const;

export type LegalRouteKey = keyof typeof LEGAL_ROUTES;

export const LEGAL_ROUTE_LIST = Object.values(LEGAL_ROUTES);