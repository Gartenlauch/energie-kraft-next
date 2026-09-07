import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
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
    </>
  );
}
