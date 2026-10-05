import { BatteryIcon, BoltIcon, SunIcon } from "@/components/ui/icons";

function EnergyDiagram({ mobile = false }: { mobile?: boolean }) {
  const center = mobile ? 180 : 360;
  const grid = mobile ? 64 : 105;
  const storage = mobile ? 296 : 615;
  const leftLoad = mobile ? 85 : 245;
  const rightLoad = mobile ? 275 : 475;
  const loadY = mobile ? 320 : 285;
  return (
    <svg
      viewBox={mobile ? "0 0 360 430" : "0 0 720 395"}
      role="img"
      aria-label="PV versorgt die Hausverteilung. Speicher und öffentliches Netz sind in beide Richtungen verbunden. Die Hausverteilung versorgt Wärmepumpe und Wallbox."
      className={`w-full ${mobile ? "md:hidden" : "hidden md:block"}`}
      fill="none"
    >
      <g stroke="#005CA9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={`M${center} 96v49m-5-6 5 6 5-6`} />
        <path d={`M${grid + 33} 195H${center - 52}m-6-5 6 5-6 5M${grid + 39} 190l-6 5 6 5`} />
        <path d={`M${center + 52} 195H${storage - 33}m-6-5 6 5-6 5M${center + 58} 190l-6 5 6 5`} />
        <path d={`M${center} 240v24H${leftLoad}v${loadY - 277}m-5-6 5 6 5-6`} />
        <path d={`M${center} 264H${rightLoad}v${loadY - 277}m-5-6 5 6 5-6`} />
        <path
          d={`M${center - 35} 73l10-35h55l10 35zM${center - 29} 56h62M${center - 9} 39l-4 32m28-32 4 32`}
        />
        <path d={`M${center - 34} 190l34-28 34 28m-59-7v36h50v-36m-32 36v-23h14v23`} />
        <path d={`M${grid - 17} 218l17-57 17 57m-31-15h28m-24-15h20m-15-12h10m-31 12h52`} />
        <rect x={storage - 22} y="168" width="44" height="51" rx="4" />
        <path d={`M${storage - 8} 162h16m-12 20-6 13h12l-6 13`} />
        <rect x={leftLoad - 27} y={loadY} width="54" height="39" rx="3" />
        <circle cx={leftLoad} cy={loadY + 19} r="12" />
        <path d={`M${leftLoad - 7} ${loadY + 12}l14 14m0-14-14 14`} />
        <rect x={rightLoad - 16} y={loadY} width="32" height="39" rx="5" />
        <path d={`M${rightLoad + 16} ${loadY + 11}h10v25a6 6 0 0 1-12 0m-16-27-5 11h10l-5 11`} />
      </g>
      <g fill="#182E4C" textAnchor="middle" fontSize={mobile ? "16" : "18"} fontWeight="600">
        <text x={center} y="22">
          Photovoltaik
        </text>
        <text x={center} y="125" fontSize="13" fontWeight="400">
          Solarstrom ↓
        </text>
        <text x={center} y="239" fontSize={mobile ? "14" : "17"}>
          Haus & Verteilung
        </text>
        <text x={grid} y="245">
          Netz
        </text>
        <text x={storage} y="245">
          Speicher
        </text>
        <text x={leftLoad} y={loadY + 65}>
          Wärmepumpe
        </text>
        <text x={rightLoad} y={loadY + 65}>
          Wallbox
        </text>
      </g>
      <path d={`M${leftLoad} ${loadY + 80}H${rightLoad}`} stroke="#005CA9" strokeDasharray="4 5" />
      <text x={center} y={loadY + 101} fill="#005CA9" textAnchor="middle" fontSize="13">
        EMS koordiniert Speicher & Verbraucher
      </text>
    </svg>
  );
}

export function TariffSystemVisual() {
  return (
    <figure className="min-w-0">
      <div className="bg-surface-soft/65 rounded-xl px-2 py-5 md:px-5 md:py-8">
        <EnergyDiagram />
        <EnergyDiagram mobile />
      </div>
      <figcaption className="mt-4 text-xs leading-6 text-[var(--text-muted)]">
        Vereinfachtes Systemschema: Pfeile zeigen mögliche Energieflüsse. Das
        Energiemanagementsystem (EMS) steuert; es ist keine Energiequelle. Netzbezug und Einspeisung
        laufen über das passende Messkonzept.
      </figcaption>
    </figure>
  );
}

export function FlexibleConsumptionVisual() {
  return (
    <figure className="min-w-0 border-t border-white/30 pt-6">
      <p className="text-sm font-semibold text-white">Verbrauch verschieben, wenn es passt</p>
      <svg
        viewBox="0 0 480 250"
        role="img"
        aria-label="Schematischer variabler Energiepreis: ein niedrigeres Preisfenster zwischen höheren Preisphasen. Flexibler Verbrauch kann in dieses Fenster verschoben werden. Kein realer Preisverlauf."
        className="mt-5 w-full"
        fill="none"
      >
        <rect x="168" y="18" width="136" height="190" fill="white" fillOpacity="0.09" />
        <g stroke="white" strokeOpacity="0.25">
          <path d="M38 208h422M38 18v190" />
          <path d="M38 72h422M38 136h422" strokeDasharray="4 6" />
        </g>
        <path
          d="M40 84C90 26 116 32 150 100S203 182 236 175 288 141 320 73 388 57 456 99"
          stroke="white"
          strokeWidth="3"
        />
        <path d="M366 184H253m10-7-10 7 10 7" stroke="#66DBF3" strokeWidth="2.5" />
        <g fill="white" fontSize="16">
          <text x="42" y="239">
            Zeitraum A
          </text>
          <text x="191" y="239">
            Zeitraum B
          </text>
          <text x="354" y="239">
            Zeitraum C
          </text>
          <text x="179" y="45" fontSize="14">
            Niedrigerer Preis
          </text>
          <text x="291" y="173" fontSize="13">
            Flexibler Verbrauch
          </text>
        </g>
      </svg>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-white">
        <span className="flex items-center gap-2">
          <SunIcon className="size-5" />
          PV direkt nutzen
        </span>
        <span className="flex items-center gap-2">
          <BatteryIcon className="size-5" />
          Überschüsse speichern
        </span>
        <span className="flex items-center gap-2">
          <BoltIcon className="size-5" />
          Laden & Heizen abstimmen
        </span>
      </div>
      <figcaption className="mt-5 text-xs leading-6 text-white/85">
        Schematische Erklärung ohne Marktdaten oder Preisangaben. Günstige Zeitfenster liegen nicht
        an jedem Tag zur gleichen Uhrzeit. Die nutzbare Flexibilität hängt von Ihrer Technik und
        Ihrem Alltag ab.
      </figcaption>
    </figure>
  );
}
