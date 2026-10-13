import { useId } from "react";

// Illustrative hourly power values only; these are not measured project data.
const dailyLoadKw = [10, 10, 9, 9, 10, 12, 18, 54, 70, 48, 94, 58, 46, 74, 66, 100, 59, 38, 20, 14, 12, 11, 10, 10, 10];
const x = (hour: number) => 52 + hour / 24 * 428;
const y = (power: number) => 214 - power / 100 * 166;
const points = dailyLoadKw.map((power, hour) => `${x(hour)},${y(power)}`).join(" ");

export function CommercialLoadProfileChart() {
  const id = useId();
  return (
    <figure className="mt-10 w-full max-w-xl">
      <svg
        viewBox="0 0 500 280"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
        className="h-auto w-full overflow-visible"
      >
        <title id={`${id}-title`}>Beispielhaftes Tageslastprofil eines Gewerbebetriebs</title>
        <desc id={`${id}-description`}>
          Illustrative Beispieldaten: geringe Grundlast nachts, Anstieg zum Betriebsbeginn,
          schwankender Bedarf und einzelne Lastspitzen tagsüber. Keine realen Messdaten.
        </desc>
        <g fill="var(--text-muted)" fontSize="17">
          <text x="52" y="22" fill="var(--brand-dark)" fontWeight="600">Leistung (kW)</text>
          {[0, 25, 50, 75, 100].map(power => (
            <g key={power}>
              <line x1="52" x2="480" y1={y(power)} y2={y(power)} stroke="var(--brand-primary)" strokeOpacity="0.12" />
              <text x="40" y={y(power) + 6} textAnchor="end">{power}</text>
            </g>
          ))}
          {[0, 6, 12, 18, 24].map(hour => (
            <g key={hour}>
              <line x1={x(hour)} x2={x(hour)} y1="214" y2="220" stroke="var(--brand-primary)" strokeOpacity="0.4" />
              <text x={x(hour)} y="244" textAnchor={hour === 0 ? "start" : hour === 24 ? "end" : "middle"}>
                {String(hour).padStart(2, "0")}:00
              </text>
            </g>
          ))}
          <text x="480" y="274" textAnchor="end" fill="var(--brand-dark)" fontWeight="600">Uhrzeit</text>
        </g>
        <polygon points={`52,214 ${points} 480,214`} fill="var(--brand-accent)" fillOpacity="0.08" />
        <polyline points={points} fill="none" stroke="var(--brand-primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(15)} cy={y(100)} r="4" fill="var(--brand-primary)" />
        <line x1={x(15)} x2={x(15)} y1="30" y2="40" stroke="var(--brand-primary)" strokeOpacity="0.5" />
        <text x={x(15)} y="22" textAnchor="middle" fontSize="16" fill="var(--brand-primary)">Lastspitze</text>
      </svg>
      <figcaption className="mt-4 text-xs leading-6 text-[var(--text-subtle)]">
        Illustratives Tageslastprofil · Beispieldaten, keine Messwerte eines realen Betriebs.
      </figcaption>
    </figure>
  );
}
