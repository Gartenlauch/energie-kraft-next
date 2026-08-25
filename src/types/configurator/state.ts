import type {
  BatteryStorageConfiguratorResult,
  BatteryStorageConfiguratorState,
} from "./battery-storage";
import type {
  WallboxConfiguratorResult,
  WallboxConfiguratorState,
} from "./wallbox";
import type {
  HeatPumpConfiguratorResult,
  HeatPumpConfiguratorState,
} from "./heat-pump";
import type {
  ClimateConfiguratorResult,
  ClimateConfiguratorState,
} from "./climate";


export const CONFIGURATOR_STATE_VERSION = 5 as const;

export type ConfiguratorType =
  | "photovoltaic"
  | "battery_storage"
  | "climate"
  | "heat_pump"
  | "wallbox";

export type HouseholdPersons = 1 | 2 | 3 | "4_5";

export type BuildingOwnership = "owner" | "tenant";

export type BuildingType =
  | "detached_house"
  | "semi_detached_house"
  | "mid_terrace_house"
  | "end_terrace_house"
  | "multi_family_house";

export type RoofPitch = 0 | 15 | 30 | 45;

export type RoofMaterial =
  | "roof_tile"
  | "beaver_tail"
  | "slate"
  | "metal"
  | "roofing_felt"
  | "gravel"
  | "plastic"
  | "other"
  | "unknown";

export type RoofOrientation =
  | "south"
  | "south_east_south_west"
  | "east_west"
  | "north";

export type RoofRenovationPeriod =
  | "new_build"
  | "after_1990"
  | "before_1990"
  | "before_1960"
  | "unknown";

export interface HouseholdConfiguratorState {
  persons?: HouseholdPersons;
  annualConsumptionKwh?: number;
  futureIncreasePercent: number;
  projectedConsumptionKwh?: number;
}

export interface BuildingConfiguratorState {
  ownership?: BuildingOwnership;
  type?: BuildingType;
}

export interface RoofConfiguratorState {
  pitch?: RoofPitch;
  material?: RoofMaterial;
  orientation?: RoofOrientation;
  renovationPeriod?: RoofRenovationPeriod;
}

export interface ConfiguratorInterests {
  batteryStorage: boolean;
  climate: boolean;
  heatPump: boolean;
  wallbox: boolean;
}

export interface ConfiguratorNotes {
  hasNotes?: boolean;
  text?: string;
}

export interface PhotovoltaicConfiguratorResult {
  recommendedPowerKwpMin: number;
  recommendedPowerKwpMax: number;

  estimatedAnnualYieldKwhMin: number;
  estimatedAnnualYieldKwhMax: number;

  projectedAnnualConsumptionKwh: number;
  targetAnnualGenerationKwh: number;

  orientationFactor: number;

  specificYieldKwhPerKwpMin: number;
  specificYieldKwhPerKwpMax: number;

  batteryStorageRequested: boolean;
  technicalReviewRecommended: boolean;
}

export interface ConfiguratorResults {
  photovoltaic?: PhotovoltaicConfiguratorResult;
  batteryStorage?: BatteryStorageConfiguratorResult;
  wallbox?: WallboxConfiguratorResult;
  heatPump?: HeatPumpConfiguratorResult;
  climate?: ClimateConfiguratorResult;
}

export interface ConfiguratorState {
  version: typeof CONFIGURATOR_STATE_VERSION;
  activeConfigurator: ConfiguratorType | null;

  household: HouseholdConfiguratorState;
  building: BuildingConfiguratorState;
  roof: RoofConfiguratorState;
  batteryStorage: BatteryStorageConfiguratorState;
  heatPump: HeatPumpConfiguratorState;
  wallbox: WallboxConfiguratorState;
  climate: ClimateConfiguratorState;
  interests: ConfiguratorInterests;
  notes: ConfiguratorNotes;
  results: ConfiguratorResults;
}

export type ConfiguratorAction =
  | {
    type: "SET_ACTIVE_CONFIGURATOR";
    payload: ConfiguratorType | null;
  }
  | {
    type: "UPDATE_HOUSEHOLD";
    payload: Partial<HouseholdConfiguratorState>;
  }
  | {
    type: "UPDATE_BUILDING";
    payload: Partial<BuildingConfiguratorState>;
  }
  | {
    type: "UPDATE_ROOF";
    payload: Partial<RoofConfiguratorState>;
  }
  | {
    type: "UPDATE_INTERESTS";
    payload: Partial<ConfiguratorInterests>;
  }
  | {
    type: "UPDATE_NOTES";
    payload: Partial<ConfiguratorNotes>;
  }
  | {
    type: "SET_PHOTOVOLTAIC_RESULT";
    payload: PhotovoltaicConfiguratorResult;
  }
  | {
    type: "UPDATE_BATTERY_STORAGE";
    payload: Partial<BatteryStorageConfiguratorState>;
  }
  | {
    type: "SET_BATTERY_STORAGE_RESULT";
    payload: BatteryStorageConfiguratorResult;
  }
  | {
    type: "REPLACE_STATE";
    payload: ConfiguratorState;
  }
  | {
    type: "UPDATE_WALLBOX";
    payload: Partial<WallboxConfiguratorState>;
  }
  | {
    type: "SET_WALLBOX_RESULT";
    payload: WallboxConfiguratorResult;
  }
  | {
    type: "UPDATE_HEAT_PUMP";
    payload: Partial<HeatPumpConfiguratorState>;
  }
  | {
    type: "SET_HEAT_PUMP_RESULT";
    payload: HeatPumpConfiguratorResult;
  }
  | {
    type: "UPDATE_CLIMATE";
    payload: Partial<ClimateConfiguratorState>;
  }
  | {
    type: "SET_CLIMATE_RESULT";
    payload: ClimateConfiguratorResult;
  }
  | {
    type: "RESET";
  };