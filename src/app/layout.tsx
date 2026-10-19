import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { isSearchIndexingEnabled } from "@/config/search-indexing";

// Validate configuration on the server, including routes with client-side PublicLink consumers.
import "@/config/env/public";

import "./globals.css";

const montserrat = localFont({
  src: [
    {
      path: "./fonts/Montserrat-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Montserrat-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Montserrat-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Energie-Kraft Süd",
    template: "%s | Energie-Kraft Süd",
  },
  description:
    "Individuelle Lösungen für Photovoltaik, Stromspeicher, Wallboxen, Klimaanlagen und Wärmepumpen.",
  robots: isSearchIndexingEnabled()
    ? undefined
    : {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
      },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="de" className={montserrat.variable} data-scroll-behavior="smooth" >
      <body>{children}</body>
    </html>
  );
}
