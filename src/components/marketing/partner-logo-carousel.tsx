"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";

const partners = [
  {
    name: "Fronius",
    src: "/brand/partners/Partner_fronius-249x69x0x0x249x69x1734284654.png",
    width: 249,
    height: 69,
  },
  {
    name: "Kostal",
    src: "/brand/partners/Kostal-212x46x0x0x212x46x1738057381.png",
    width: 212,
    height: 46,
  },
  {
    name: "SMA",
    src: "/brand/partners/Partner_SMA-187x120x0x0x187x120x1734284654.png",
    width: 187,
    height: 120,
  },
  {
    name: "SolarEdge",
    src: "/brand/partners/Partner_solaredge-249x50x0x0x249x50x1734284654.png",
    width: 249,
    height: 50,
  },
  {
    name: "K2 Systems",
    src: "/brand/partners/Partner_K2-Systems-162x162x0x0x162x162x1734284654.png",
    width: 162,
    height: 162,
  },
  {
    name: "Schletter",
    src: "/brand/partners/SCHLETTER_Logo-237x31x0x0x237x31x1734284653.png",
    width: 237,
    height: 31,
  },
  { name: "IBC Solar", src: "/brand/partners/IBC_Solar.svg", width: 192, height: 160 },
  {
    name: "KACO new energy",
    src: "/brand/partners/KACO_new_energy_logo.svg",
    width: 1024,
    height: 309,
  },
  { name: "Sungrow", src: "/brand/partners/Sungrow_Power_Supply.svg", width: 1552, height: 340 },
  {
    name: "Sigenergy",
    src: "/brand/partners/Sigenergy-logo-black-237x49x0x0x237x49x1734430433.png",
    width: 237,
    height: 49,
  },
  {
    name: "Solar-Log",
    src: "/brand/partners/Solar-Log_Logo_Web-237x48x0x0x237x48x1738056843.png",
    width: 237,
    height: 48,
  },
  { name: "ABL", src: "/brand/partners/ABL_logo.svg", width: 75, height: 30 },
] as const;

export function PartnerLogoCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 }, [
    Autoplay({ delay: 6500, playOnInit: false, stopOnInteraction: false, stopOnFocusIn: false }),
  ]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!emblaApi || !section) return;
    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = emblaApi.rootNode();
    let visible = false;
    let disposed = false;
    let dragging = false;

    function sync() {
      if (disposed) return;
      const hovered = window.matchMedia("(hover: hover)").matches && section?.matches(":hover");
      const blocked =
        paused ||
        motion.matches ||
        document.hidden ||
        !visible ||
        hovered ||
        section?.matches(":focus-within") ||
        dragging;
      if (blocked) autoplay?.stop();
      else if (!autoplay?.isPlaying()) autoplay?.play();
    }
    // Embla owns timing. Reapply pause policy after plugin interaction/reInit events.
    const afterInteraction = () => queueMicrotask(sync);
    const dragStart = () => {
      dragging = true;
      sync();
    };
    const dragEnd = () => {
      dragging = false;
      afterInteraction();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(viewport);
    section.addEventListener("mouseenter", sync);
    section.addEventListener("mouseleave", sync);
    section.addEventListener("focusin", sync);
    section.addEventListener("focusout", afterInteraction);
    document.addEventListener("visibilitychange", afterInteraction);
    motion.addEventListener("change", sync);
    emblaApi
      .on("pointerDown", dragStart)
      .on("pointerUp", dragEnd)
      .on("autoplay:play", afterInteraction)
      .on("reInit", afterInteraction);
    return () => {
      disposed = true;
      observer.disconnect();
      autoplay.stop();
      section.removeEventListener("mouseenter", sync);
      section.removeEventListener("mouseleave", sync);
      section.removeEventListener("focusin", sync);
      section.removeEventListener("focusout", afterInteraction);
      document.removeEventListener("visibilitychange", afterInteraction);
      motion.removeEventListener("change", sync);
      emblaApi
        .off("pointerDown", dragStart)
        .off("pointerUp", dragEnd)
        .off("autoplay:play", afterInteraction)
        .off("reInit", afterInteraction);
    };
  }, [emblaApi, paused]);

  function move(direction: -1 | 1) {
    const jump = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (direction < 0) emblaApi?.scrollPrev(jump);
    else emblaApi?.scrollNext(jump);
    emblaApi?.plugins().autoplay?.reset();
  }

  return (
    <section
      ref={sectionRef}
      id="partners"
      className="partner-section bg-background overflow-hidden"
      aria-labelledby="partners-heading"
    >
      <div className="section-shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Verlässliche Technik</p>
            <h2 id="partners-heading" className="section-title mt-4">
              Unsere Qualitäts-Partner
            </h2>
            <p className="mt-5 max-w-2xl text-[var(--text-muted)]">
              Bewährte Technik. Starke Partner. Sorgfältig aufeinander abgestimmt.
            </p>
          </div>
          <div className="flex gap-2" aria-label="Partnerlogos steuern">
            <button
              type="button"
              className="partner-control partner-autoplay"
              aria-pressed={paused}
              aria-label={
                paused
                  ? "Automatischen Logo-Wechsel starten"
                  : "Automatischen Logo-Wechsel pausieren"
              }
              onClick={() => setPaused((value) => !value)}
            >
              <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
            </button>
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
        <div
          ref={emblaRef}
          className="partner-viewport mt-8"
          tabIndex={0}
          role="region"
          aria-roledescription="Karussell"
          aria-label="Unsere Qualitäts-Partner"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          <ul className="partner-track">
            {partners.map((partner) => (
              <li key={partner.name} className="partner-logo-item">
                <Image
                  src={partner.src}
                  alt={`${partner.name} Logo`}
                  width={partner.width}
                  height={partner.height}
                  className={`partner-logo object-contain ${partner.width / partner.height < 1.7 ? "partner-logo--compact" : ""}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
