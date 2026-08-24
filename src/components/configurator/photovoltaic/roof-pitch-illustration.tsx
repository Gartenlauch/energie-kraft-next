import type { RoofPitch } from "@/types/configurator";

interface RoofPitchIllustrationProps {
  pitch: RoofPitch;
}

const roofHeights = {
  0: 40,
  15: 32,
  30: 22,
  45: 10,
} satisfies Record<RoofPitch, number>;

export function RoofPitchIllustration({
  pitch,
}: RoofPitchIllustrationProps) {
  const roofY = roofHeights[pitch];

  return (
    <svg
      viewBox="0 0 140 90"
      className="h-20 w-32"
      aria-hidden="true"
    >
      <path
        d={`M20 74 V48 L70 ${roofY} L120 48 V74 Z`}
        fill="var(--surface)"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <path
        d={`M14 50 L70 ${roofY} L126 50`}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={`M48 ${roofY + 11} L89 ${roofY + 5}`}
        stroke="var(--brand-accent)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}