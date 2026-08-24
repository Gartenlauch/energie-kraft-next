import type { ConfiguratorStepDefinition } from "./wizard";

export type PhotovoltaicStepId =
  | "household_persons"
  | "ownership"
  | "building_type"
  | "annual_consumption"
  | "roof_pitch"
  | "roof_material"
  | "roof_orientation"
  | "roof_renovation"
  | "future_consumption"
  | "battery_storage"
  | "additional_interests"
  | "notes";

export type PhotovoltaicAdditionalInterest =
  | "climate"
  | "heatPump"
  | "wallbox";

export type PhotovoltaicStepDefinition = Omit<
  ConfiguratorStepDefinition,
  "id"
> & {
  id: PhotovoltaicStepId;
};