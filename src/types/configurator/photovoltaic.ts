import type { ConfiguratorStepDefinition } from "./wizard";

export type PhotovoltaicStepId =
  | "household_persons"
  | "ownership"
  | "building_type"
  | "annual_consumption"
  | "roof_pitch"
  | "roof_material"
  | "roof_orientation"
  | "roof_renovation";

export type PhotovoltaicStepDefinition = Omit<
  ConfiguratorStepDefinition,
  "id"
> & {
  id: PhotovoltaicStepId;
};