import type { CSSProperties } from "react";
import Link from "next/link";

import { ArtDirectedImage } from "@/components/media/art-directed-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { ConfiguratorLandingProduct, ConfiguratorType } from "@/types/configurator";

interface ConfiguratorHouseNavigationProps {
  products: readonly ConfiguratorLandingProduct[];
}

const hotspots = {
  photovoltaic: { x: 76, y: 39, description: "Auf dem Dach eigenen Solarstrom erzeugen." },
  battery_storage: { x: 59, y: 73, description: "Im Technikraum Solarstrom für später speichern." },
  climate: { x: 66, y: 59, description: "Im Wohnbereich für angenehme Temperaturen sorgen." },
  heat_pump: { x: 45, y: 78, description: "Die Außeneinheit versorgt dein Zuhause mit Wärme." },
  wallbox: { x: 81, y: 74, description: "Am Carport mit eigener Energie laden." },
} satisfies Record<ConfiguratorType, { x: number; y: number; description: string }>;

export function ConfiguratorHouseNavigation({ products }: ConfiguratorHouseNavigationProps) {
  return (
    <div className="house-navigation mt-10">
      <div className="house-navigation__visual">
        <ArtDirectedImage
          desktopSrc="/images/home-premium/hero-energy-home-desktop.webp"
          mobileSrc="/images/home-premium/hero-energy-home-mobile.webp"
          desktopWidth={2000}
          desktopHeight={1200}
          mobileWidth={1200}
          mobileHeight={1600}
          alt="Haus mit Photovoltaik auf dem Dach, Wärmepumpe im Garten und Wallbox am Carport"
          sizes="(max-width: 1023px) 100vw, 1280px"
        />
        <div className="house-navigation__caption" aria-hidden="true">
          <span className="eyebrow eyebrow-on-dark">Alles spielt zusammen</span>
          <p className="mt-4 max-w-[12ch] text-[clamp(1.8rem,3.2vw,3.1rem)] leading-tight font-bold text-white">
            Dein Haus als Energiesystem.
          </p>
        </div>
        <nav aria-label="Energiekomponenten am Haus" className="house-hotspots">
          {products.map((product, index) => {
            const spot = hotspots[product.type];
            return (
              <Link
                key={product.type}
                href={product.href}
                className={`house-hotspot ${spot.x > 70 ? "house-hotspot--right" : ""}`}
                style={
                  { "--hotspot-x": `${spot.x}%`, "--hotspot-y": `${spot.y}%` } as CSSProperties
                }
                aria-label={`${product.title}: ${spot.description} Jetzt konfigurieren`}
              >
                <span className="house-hotspot__marker" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="house-hotspot__label">
                  <strong>{product.title}</strong>
                  <span className="mt-2 block text-sm leading-6">{spot.description}</span>
                  <span className="text-brand-primary mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                    Jetzt konfigurieren <ArrowRightIcon className="size-4" />
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <nav aria-label="Energielösung auswählen" className="house-product-list">
        {products.map((product, index) => (
          <Link key={product.type} href={product.href} className="house-product-link group">
            <span className="text-brand-primary text-xs font-bold">0{index + 1}</span>
            <span className="min-w-0">
              <strong className="text-brand-primary block text-lg">{product.title}</strong>
              <span className="mt-1 block text-sm leading-6 text-[var(--text-muted)]">
                {hotspots[product.type].description}
              </span>
            </span>
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
