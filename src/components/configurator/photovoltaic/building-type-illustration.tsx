import type { BuildingType } from "@/types/configurator";

interface BuildingTypeIllustrationProps {
  type: BuildingType;
}

export function BuildingTypeIllustration({
  type,
}: BuildingTypeIllustrationProps) {
  if (type === "multi_family_house") {
    return (
      <svg
        viewBox="0 0 160 96"
        className="h-20 w-32"
        aria-hidden="true"
      >
        <rect
          x="42"
          y="10"
          width="76"
          height="76"
          rx="5"
          fill="var(--surface)"
          stroke="currentColor"
          strokeWidth="4"
        />

        {[30, 55].map((y) => (
          <g key={y}>
            <rect
              x="56"
              y={y}
              width="15"
              height="12"
              fill="var(--brand-accent)"
            />
            <rect
              x="89"
              y={y}
              width="15"
              height="12"
              fill="var(--brand-accent)"
            />
          </g>
        ))}

        <rect
          x="72"
          y="65"
          width="16"
          height="21"
          fill="var(--background)"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>
    );
  }

  const units =
    type === "detached_house"
      ? 1
      : type === "semi_detached_house"
        ? 2
        : 3;

  return (
    <svg
      viewBox="0 0 180 96"
      className="h-20 w-36"
      aria-hidden="true"
    >
      {Array.from({ length: units }).map((_, index) => {
        const width = 48;
        const startX = 90 - (units * width) / 2;
        const x = startX + index * width;

        return (
          <g key={index}>
            <path
              d={`M ${x} 45 L ${x + 24} 20 L ${x + 48} 45 V 84 H ${x} Z`}
              fill="var(--surface)"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            <rect
              x={x + 9}
              y="52"
              width="12"
              height="12"
              fill="var(--brand-accent)"
            />

            <rect
              x={x + 29}
              y="58"
              width="11"
              height="26"
              fill="var(--background)"
              stroke="currentColor"
              strokeWidth="2"
            />
          </g>
        );
      })}
    </svg>
  );
}