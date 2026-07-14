import type { Metadata } from "next";
import type { ReactNode } from "react";

import { publicEnv } from "@/config/env/public";
import { siteConfig } from "@/config/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalBaseUrl),

  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },

  robots: publicEnv.isProduction
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        noarchive: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={siteConfig.language}>
      <body>{children}</body>
    </html>
  );
}
