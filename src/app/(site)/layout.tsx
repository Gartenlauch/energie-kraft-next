import { Suspense, type ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { ConsentManager } from "@/components/consent/consent-manager";
import { GoogleAnalytics } from "@/components/consent/google-analytics";
import { GoogleAds } from "@/components/consent/google-ads";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteOrganizationJsonLd } from "@/components/seo/site-organization-json-ld";

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <SiteOrganizationJsonLd />

      <a href="#main-content" className="skip-link">
        Zum Inhalt springen
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
      <ConsentManager />
      <Suspense fallback={null}>
        <GoogleAnalytics />
        <GoogleAds />
      </Suspense>
    </>
  );
}
