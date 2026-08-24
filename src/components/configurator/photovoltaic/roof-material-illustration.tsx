import type { RoofMaterial } from "@/types/configurator";

interface RoofMaterialIllustrationProps {
  material: RoofMaterial;
}

export function RoofMaterialIllustration({
  material,
}: RoofMaterialIllustrationProps) {
  if (material === "unknown") {
    return (
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border-default text-3xl font-semibold text-brand-primary"
        aria-hidden="true"
      >
        ?
      </div>
    );
  }

  if (material === "other") {
    return (
      <div
        className="flex h-20 w-20 items-center justify-center rounded-xl bg-surface text-3xl font-semibold text-brand-primary"
        aria-hidden="true"
      >
        …
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 120 80"
      className="h-20 w-28"
      aria-hidden="true"
    >
      <path
        d="M12 67 60 15l48 52Z"
        fill="var(--surface)"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {material === "roof_tile" ||
      material === "beaver_tail" ? (
        <>
          <path
            d="M33 54h54M42 43h36M51 32h18"
            stroke="var(--brand-accent)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M43 43v11M60 32v22M77 43v11"
            stroke="currentColor"
            strokeWidth="2"
          />
        </>
      ) : null}

      {material === "slate" ? (
        <path
          d="m34 54 13-13 13 13 13-13 13 13"
          fill="none"
          stroke="var(--brand-accent)"
          strokeWidth="4"
        />
      ) : null}

      {material === "metal" ? (
        <path
          d="M35 57 49 35M50 57l14-22M65 57l14-22M80 57l8-13"
          stroke="var(--brand-accent)"
          strokeWidth="4"
        />
      ) : null}

      {material === "roofing_felt" ? (
        <path
          d="M33 55h54"
          stroke="var(--brand-accent)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      ) : null}

      {material === "gravel" ? (
        <>
          <circle cx="42" cy="51" r="4" fill="var(--brand-accent)" />
          <circle cx="55" cy="43" r="4" fill="var(--brand-accent)" />
          <circle cx="68" cy="51" r="4" fill="var(--brand-accent)" />
          <circle cx="79" cy="42" r="4" fill="var(--brand-accent)" />
        </>
      ) : null}

      {material === "plastic" ? (
        <path
          d="M34 54c9-12 18 12 27 0s18 12 27 0"
          fill="none"
          stroke="var(--brand-accent)"
          strokeWidth="4"
        />
      ) : null}
    </svg>
  );
}