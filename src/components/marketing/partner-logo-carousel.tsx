"use client";

import Image from "next/image";
import { useRef } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";

const partners = [
  { name: "Fronius", src: "/brand/partners/Partner_fronius-249x69x0x0x249x69x1734284654.png", width: 249, height: 69 },
  { name: "Kostal", src: "/brand/partners/Kostal-212x46x0x0x212x46x1738057381.png", width: 212, height: 46 },
  { name: "SMA", src: "/brand/partners/Partner_SMA-187x120x0x0x187x120x1734284654.png", width: 187, height: 120 },
  { name: "SolarEdge", src: "/brand/partners/Partner_solaredge-249x50x0x0x249x50x1734284654.png", width: 249, height: 50 },
  { name: "K2 Systems", src: "/brand/partners/Partner_K2-Systems-162x162x0x0x162x162x1734284654.png", width: 162, height: 162 },
  { name: "Schletter", src: "/brand/partners/SCHLETTER_Logo-237x31x0x0x237x31x1734284653.png", width: 237, height: 31 },
  { name: "IBC Solar", src: "/brand/partners/IBC_Solar.svg", width: 192, height: 160 },
  { name: "KACO new energy", src: "/brand/partners/KACO_new_energy_logo.svg", width: 1024, height: 309 },
  { name: "Sungrow", src: "/brand/partners/Sungrow_Power_Supply.svg", width: 1552, height: 340 },
  { name: "Sigenergy", src: "/brand/partners/Sigenergy-logo-black-237x49x0x0x237x49x1734430433.png", width: 237, height: 49 },
  { name: "Solar-Log", src: "/brand/partners/Solar-Log_Logo_Web-237x48x0x0x237x48x1738056843.png", width: 237, height: 48 },
  { name: "ABL", src: "/brand/partners/ABL_logo.svg", width: 75, height: 30 },
] as const;

export function PartnerLogoCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);

  function move(direction: -1 | 1) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.78, 260),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <section id="partners" className="section-space overflow-hidden bg-background" aria-labelledby="partners-heading">
      <div className="section-shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Verlässliche Technik</p>
            <h2 id="partners-heading" className="section-title mt-4">
              Unsere Qualitäts-Partner
            </h2>
            <p className="lead-copy mt-5 max-w-2xl">
              Bewährte Komponenten und langfristige Herstellerbeziehungen bilden die Grundlage für
              Systeme, die technisch sauber zusammenspielen.
            </p>
          </div>

          <div className="flex gap-2" aria-label="Partnerlogos steuern">
            <button
              type="button"
              onClick={() => move(-1)}
              className="partner-control"
              aria-label="Vorherige Partnerlogos anzeigen"
            >
              <ArrowRightIcon className="size-5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="partner-control"
              aria-label="Weitere Partnerlogos anzeigen"
            >
              <ArrowRightIcon className="size-5" />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          className="partner-track mt-12"
          aria-label="Liste unserer Qualitäts-Partner"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              move(-1);
            }

            if (event.key === "ArrowRight") {
              event.preventDefault();
              move(1);
            }
          }}
        >
          {partners.map((partner) => (
            <li key={partner.name} className="partner-logo-item">
              <Image
                src={partner.src}
                alt={`${partner.name} Logo`}
                width={partner.width}
                height={partner.height}
                className="max-h-16 w-auto max-w-[11rem] object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
