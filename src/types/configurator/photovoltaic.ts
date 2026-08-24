import type { ConfiguratorStepDefinition } from "./wizard";

export type PhotovoltaicStepId =
  | "household_persons"
  | "ownership"
  | "building_type"
  | "annual_consumption";

export type PhotovoltaicStepDefinition = Omit<
  ConfiguratorStepDefinition,
  "id"
> & {
  id: PhotovoltaicStepId;
};