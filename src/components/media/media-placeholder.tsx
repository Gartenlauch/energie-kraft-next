import { cn } from "@/lib/utils/cn";

interface MediaPlaceholderProps {
  motif: string;
  width: number;
  height: number;
  format?: "WebP" | "AVIF" | "SVG";
  className?: string;
}

export function MediaPlaceholder({
  motif,
  width,
  height,
  format = "WebP",
  className,
}: MediaPlaceholderProps) {
  const divisor = (first: number, second: number): number =>
    second === 0 ? first : divisor(second, first % second);
  const ratioDivisor = divisor(width, height);
  const ratio = `${width / ratioDivisor}:${height / ratioDivisor}`;
  const label = `${motif} benötigt. ${width} mal ${height} Pixel, Seitenverhältnis ${ratio}, ${format}.`;

  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: `${width} / ${height}` }}
      className={cn(
        "border-brand-primary/25 bg-surface-soft text-brand-navy relative grid min-h-72 place-items-center overflow-hidden border",
        className,
      )}
    >
      <div className="bg-brand-accent/15 absolute -top-16 -right-16 size-48 rounded-full" />
      <div className="border-brand-primary/15 absolute inset-4 border" />
      <div className="relative max-w-xs px-8 text-center">
        <p className="text-brand-primary text-xs font-bold tracking-[0.16em] uppercase">
          Media-Placeholder
        </p>
        <p className="mt-4 text-xl font-bold">{motif}</p>
        <dl className="mt-5 grid grid-cols-3 gap-3 text-xs">
          <div>
            <dt className="text-[var(--text-subtle)]">Maße</dt>
            <dd className="mt-1 font-semibold">{width} × {height}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-subtle)]">Ratio</dt>
            <dd className="mt-1 font-semibold">{ratio}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-subtle)]">Format</dt>
            <dd className="mt-1 font-semibold">{format}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
