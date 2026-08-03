import type { FaqRouteKey } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import type { SeoContent } from "@/types/content";

const organizationId = buildCanonicalUrl("/#organization");
const websiteId = buildCanonicalUrl("/#website");

const SERVICE_TYPES: Partial<Record<FaqRouteKey, string>> = {
  photovoltaik: "Beratung, Planung, Installation und Inbetriebnahme von Photovoltaikanlagen",
  stromspeicher: "Beratung, Planung und Integration von Stromspeichern für Photovoltaikanlagen",
  wallbox: "Beratung, Planung und Installation von Wallboxen und Ladeinfrastruktur",
  klimaanlagen: "Beratung, Planung, Installation und Inbetriebnahme von Klimaanlagen",
  waermepumpen: "Beratung, Planung und Integration von Wärmepumpen und Energiesystemen",
};

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": organizationId,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: buildCanonicalUrl("/"),
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      postalCode: siteConfig.contact.address.postalCode,
      addressLocality: siteConfig.contact.address.city,
      addressCountry: "DE",
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: buildCanonicalUrl("/"),
    name: siteConfig.name,
    inLanguage: siteConfig.language,
    publisher: {
      "@id": organizationId,
    },
  };
}

export function buildWebPageJsonLd(seo: SeoContent) {
  const canonicalUrl = buildCanonicalUrl(seo.canonicalPath);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: seo.title,
    description: seo.description,
    inLanguage: siteConfig.language,
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id": organizationId,
    },
  };
}

export function buildServiceJsonLd(seo: SeoContent, routeKey: FaqRouteKey) {
  const serviceType = SERVICE_TYPES[routeKey];

  if (!serviceType) {
    return null;
  }

  const canonicalUrl = buildCanonicalUrl(seo.canonicalPath);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonicalUrl}#service`,
    name: seo.title,
    description: seo.description,
    serviceType,
    url: canonicalUrl,
    provider: {
      "@id": organizationId,
    },
    mainEntityOfPage: {
      "@id": `${canonicalUrl}#webpage`,
    },
  };
}

export function buildBreadcrumbJsonLd({
  currentLabel,
  currentPath,
}: {
  currentLabel: string;
  currentPath: string;
}) {
  const canonicalUrl = buildCanonicalUrl(currentPath);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: buildCanonicalUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: currentLabel,
        item: canonicalUrl,
      },
    ],
  };
}
