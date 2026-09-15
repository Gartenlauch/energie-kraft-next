interface Segment {
  label: string;
  value: number;
  color?: string;
}

export function SegmentedEnergyBar({
  segments,
  unit,
}: {
  segments: readonly Segment[];
  unit: string;
}) {
  const total = Math.max(
    segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0),
    1,
  );
  const colors = ["#005CA9", "#0DA1D1", "#91A4C4", "#182E4C"];

  return (
    <figure
      className="mt-5"
      aria-label={segments
        .map((segment) => `${segment.label}: ${Math.round(segment.value)} ${unit}`)
        .join(", ")}
    >
      <div className="bg-surface flex h-4 overflow-hidden rounded-full" aria-hidden="true">
        {segments.map((segment, index) => (
          <span
            key={segment.label}
            style={{
              width: `${(Math.max(segment.value, 0) / total) * 100}%`,
              backgroundColor: segment.color ?? colors[index % colors.length],
            }}
          />
        ))}
      </div>
      <figcaption className="text-foreground/70 mt-3 grid gap-2 text-sm sm:grid-cols-2">
        {segments.map((segment, index) => (
          <span key={segment.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: segment.color ?? colors[index % colors.length] }}
              />
              {segment.label}
            </span>
            <strong className="text-brand-navy">
              {new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(segment.value)}{" "}
              {unit}
            </strong>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

export function ComparisonBars({ items, unit }: { items: readonly Segment[]; unit: string }) {
  const max = Math.max(...items.map((item) => Math.abs(item.value)), 1);
  return (
    <figure
      className="mt-5 space-y-3"
      aria-label={items
        .map((item) => `${item.label}: ${Math.round(item.value)} ${unit}`)
        .join(", ")}
    >
      {items.map((item, index) => (
        <div key={item.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-foreground/70">{item.label}</span>
            <strong className="text-brand-navy">
              {new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(item.value)}{" "}
              {unit}
            </strong>
          </div>
          <div className="bg-surface h-3 overflow-hidden rounded-full" aria-hidden="true">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(Math.abs(item.value) / max) * 100}%`,
                backgroundColor: item.color ?? (index === 0 ? "#91A4C4" : "#0DA1D1"),
              }}
            />
          </div>
        </div>
      ))}
    </figure>
  );
}

export function CashflowSparkline({ values }: { values: readonly number[] }) {
  if (values.length < 2) return null;
  const width = 640;
  const height = 180;
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const range = Math.max(max - min, 1);
  const points = values
    .map(
      (value, index) =>
        `${(index / (values.length - 1)) * width},${height - ((value - min) / range) * height}`,
    )
    .join(" ");
  const zeroY = height - ((0 - min) / range) * height;
  return (
    <figure
      className="mt-5"
      aria-label={`Kumulativer Cashflow von ${Math.round(values[0] ?? 0)} Euro bis ${Math.round(values.at(-1) ?? 0)} Euro`}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-hidden="true"
      >
        <line x1="0" y1={zeroY} x2={width} y2={zeroY} stroke="#91A4C4" strokeDasharray="6 6" />
        <polyline
          points={points}
          fill="none"
          stroke="#005CA9"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <figcaption className="text-foreground/60 flex justify-between text-xs">
        <span>Jahr 0</span>
        <span>Modellhorizont</span>
      </figcaption>
    </figure>
  );
}
