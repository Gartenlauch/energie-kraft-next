import type { RoofOrientation } from "@/types/configurator";

interface RoofOrientationIllustrationProps {
  orientation: RoofOrientation;
}

const rotations = {
  south: 180,
  south_east_south_west: 135,
  east_west: 90,
  north: 0,
} satisfies Record<RoofOrientation, number>;

export function RoofOrientationIllustration({
  orientation,
}: RoofOrientationIllustrationProps) {
  const rotation = rotations[orientation];

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-20 w-20"
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="39"
        fill="var(--surface)"
        stroke="currentColor"
        strokeWidth="4"
      />

      <text
        x="50"
        y="17"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="currentColor"
      >
        N
      </text>

      <g transform={`rotate(${rotation} 50 50)`}>
        <path
          d="M50 24 61 54 50 48 39 54Z"
          fill="var(--brand-accent)"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        <path
          d="M50 48v29"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}