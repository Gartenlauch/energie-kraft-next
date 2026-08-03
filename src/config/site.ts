import { publicEnv } from "@/config/env/public";

export const siteConfig = {
  name: "Energie-Kraft Süd",
  legalName: "Energie-Kraft Süd GmbH & Co. KG",

  canonicalBaseUrl: publicEnv.NEXT_PUBLIC_CANONICAL_BASE_URL,

  language: "de",
  locale: "de_DE",

  contact: {
    phoneDisplay: "+49 (0) 8654 77161-0",
    phoneHref: "tel:+498654771610",

    email: "office@energie-kraft.de",
    emailHref: "mailto:office@energie-kraft.de",

    address: {
      street: "Gewerbestraße 12",
      postalCode: "83404",
      city: "Ainring",
      country: "Deutschland",
    },

    mapHref:
      "https://www.google.com/maps/search/?api=1&query=Gewerbestra%C3%9Fe%2012%2C%2083404%20Ainring",
  },
} as const;
