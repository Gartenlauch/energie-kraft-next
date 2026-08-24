import type {
  PvRoofOrientation,
  PvShadingLevel,
} from "@/types/pv-sizing-calculator";

export const PV_ORIENTATION_FACTORS = {
  south: 1,
  southEastSouthWest: 0.95,
  eastWest: 0.85,
  north: 0.65,
} satisfies Record<PvRoofOrientation, number>;

export const PV_SHADING_FACTORS = {
  none: 1,
  light: 0.95,
  medium: 0.85,
  strong: 0.7,
} satisfies Record<PvShadingLevel, number>;

export const PV_DEFAULT_BASE_SPECIFIC_YIELD_KWH_PER_KWP = 1_000;

export const PV_DEFAULT_TARGET_GENERATION_COVERAGE_PERCENT = 110;