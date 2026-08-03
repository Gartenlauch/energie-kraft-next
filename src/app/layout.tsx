import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Energie-Kraft Süd",
    template: "%s | Energie-Kraft Süd",
  },
  description:
    "Individuelle Lösungen für Photovoltaik, Stromspeicher, Wallboxen, Klimaanlagen und Wärmepumpen.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}