"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { readConfiguratorState } from "@/lib/configurator/storage";
import { clearSubmittedConfiguratorProject } from "@/lib/configurator/project-reset";
import Link from "next/link";

import { ArtDirectedImage } from "@/components/media/art-directed-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { ConfiguratorLandingProduct, ConfiguratorType } from "@/types/configurator";

interface ConfiguratorHouseNavigationProps {
  products: readonly ConfiguratorLandingProduct[];
}

const hotspots = {
  photovoltaic: { x: 78, y: 44, mobileX: 65, mobileY: 44, description: "Auf dem Dach eigenen Solarstrom erzeugen." },
  battery_storage: { x: 61, y: 75, mobileX: 44, mobileY: 69, description: "Im Technikraum Solarstrom für später speichern." },
  climate: { x: 71, y: 57, mobileX: 86, mobileY: 60, description: "Im Wohnbereich für angenehme Temperaturen sorgen." },
  heat_pump: { x: 40, y: 79, mobileX: 30, mobileY: 85, description: "Die Außeneinheit versorgt Ihr Zuhause mit Wärme." },
  wallbox: { x: 82, y: 67, mobileX: 60, mobileY: 70, description: "Am Carport mit eigener Energie laden." },
} satisfies Record<ConfiguratorType, { x: number; y: number; mobileX: number; mobileY: number; description: string }>;

export function ConfiguratorHouseNavigation({ products }: ConfiguratorHouseNavigationProps) {
  const [hasOpenProject, setHasOpenProject] = useState(false);
  const [mode, setMode] = useState<"new" | "continue">("new");
  useEffect(() => {
    let cancelled = false;
    const saved = readConfiguratorState(window.sessionStorage);
    queueMicrotask(() => {
      if (!cancelled) {
        setHasOpenProject(Boolean(saved?.journey.entryPoint && saved.submission.status !== "submitted"));
      }
    });
    return () => { cancelled = true; };
  }, []);
  function handleProductSelection() {
    if (mode === "new") clearSubmittedConfiguratorProject(window.sessionStorage);
  }
  return (
    <>
      {hasOpenProject ? (
        <fieldset className="mt-8 border-l-4 border-brand-secondary pl-5">
          <legend className="text-brand-primary font-semibold">Wie möchten Sie starten?</legend>
          <label className="flex min-h-11 items-center gap-3">
            <input type="radio" name="configurator-start" checked={mode === "new"} onChange={() => setMode("new")} />
            Neue Konfiguration – bisherige Angaben verwerfen
          </label>
          <label className="flex min-h-11 items-center gap-3">
            <input type="radio" name="configurator-start" checked={mode === "continue"} onChange={() => setMode("continue")} />
            Projekt fortsetzen/erweitern – Angaben behalten
          </label>
          <p className="text-sm text-foreground/70">Wählen Sie anschließend unten das gewünschte Produkt.</p>
        </fieldset>
      ) : null}
      <div className="house-navigation mt-10">
        <div className="house-navigation__visual">
          <ArtDirectedImage
            desktopSrc="/images/home-premium/configurator-energy-home-desktop.webp"
            mobileSrc="/images/home-premium/configurator-energy-home-mobile.webp"
            desktopWidth={2000}
            desktopHeight={1200}
            mobileWidth={1200}
            mobileHeight={1600}
            alt="Haus mit Photovoltaik auf dem Dach, Klimaanlage am Balkon, Wärmepumpe im Garten und Wallbox am Carport"
            sizes="(max-width: 1023px) 100vw, 1280px"
          />
          <div className="house-navigation__caption" aria-hidden="true">
            <span className="eyebrow eyebrow-on-dark">Alles spielt zusammen</span>
            <p className="mt-4 max-w-[12ch] text-[clamp(1.8rem,3.2vw,3.1rem)] leading-tight font-bold text-white">
              Ihr Haus als Energiesystem.
            </p>
          </div>
          <nav aria-label="Energiekomponenten am Haus" className="house-hotspots">
            {products.map((product, index) => {
              const spot = hotspots[product.type];
              return (
                <Link
                  key={product.type}
                  href={product.href} onClick={handleProductSelection}
                  className={`house-hotspot ${spot.x > 70 ? "house-hotspot--right" : ""}`}
                  style={
                    {
                      "--hotspot-x": `${spot.x}%`,
                      "--hotspot-y": `${spot.y}%`,
                      "--hotspot-mobile-x": `${spot.mobileX}%`,
                      "--hotspot-mobile-y": `${spot.mobileY}%`,
                    } as CSSProperties
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
            <Link key={product.type} href={product.href} onClick={handleProductSelection} className="house-product-link group">
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
    </>
  );
}
