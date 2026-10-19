// Public, environment-independent identity shared with client components.
export const siteIdentity = {
  name: "Energie-Kraft Süd",
  legalName: "Energie-Kraft Süd GmbH & Co. KG",

  language: "de",
  locale: "de_DE",

  social: {
    facebook: "https://www.facebook.com/EnergieKraftSued/?locale=de_DE",
    instagram: "https://www.instagram.com/energie_kraft_sued/",
  },

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
  careers: {
    email: "bewerbung@energie-kraft.de",
    emailHref: "mailto:bewerbung@energie-kraft.de",
  },
} as const;
