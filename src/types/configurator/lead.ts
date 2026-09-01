import type {
  BatteryStorageBackupPreference,
  BatteryStorageConfiguratorResult,
  BatteryStorageConsumptionPattern,
  BatteryStorageGoal,
} from "./battery-storage";
import type {
  ClimateInsulationLevel,
  ClimateSolarLoad,
} from "@/types/climate-calculator";
import type {
  HeatPumpFlowTemperatureAssessment,
} from "@/types/heat-pump-calculator";
import type {
  BuildingConfiguratorState,
  BuildingType,
  ConfiguratorInterests,
  ConfiguratorNotes,
  ConfiguratorState,
  HouseholdConfiguratorState,
  HouseholdPersons,
  PhotovoltaicConfiguratorResult,
  RoofConfiguratorState,
  RoofMaterial,
  RoofOrientation,
  RoofPitch,
  RoofRenovationPeriod,
} from "./state";

import type { FirestoreTimestamp } from "@/types/firestore";
import type {
  LeadMailInfo,
  LeadStatus,
} from "@/types/lead";

export type ConfiguratorLeadType =
  | "photovoltaic"
  | "battery_storage"
  | "wallbox"
  | "heat_pump"
  | "climate";

export type ConfiguratorLeadSource =
  | "konfigurator/photovoltaik"
  | "konfigurator/stromspeicher"
  | "konfigurator/wallbox"
  | "konfigurator/waermepumpe"
  | "konfigurator/klimaanlage";

export interface ConfiguratorContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  installationAtResidence: boolean | null;

  street: string;
  postalCode: string;
  city: string;

  privacyAccepted: boolean;

  /**
   * Honeypot. Muss für echte Benutzer leer bleiben.
   */
  website: string;
}

export interface ConfiguratorLeadContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ConfiguratorInstallationLocation {
  atResidence: boolean;
  street: string;
  postalCode: string;
  city: string;
}

export interface SubmitConfiguratorLeadCommonInput {
  type: "configurator";

  contact: ConfiguratorLeadContact;

  installation: ConfiguratorInstallationLocation;

  privacyAccepted: boolean;

  website?: string;

  formStartedAt: number;
}

/*
 * Photovoltaik
 */

export interface PhotovoltaicConfiguratorLeadAnswers {
  household: HouseholdConfiguratorState;
  building: BuildingConfiguratorState;
  roof: RoofConfiguratorState;
  interests: ConfiguratorInterests;
  notes: ConfiguratorNotes;
}

export interface SubmitPhotovoltaicConfiguratorLeadInput
  extends SubmitConfiguratorLeadCommonInput {
  configurator: {
    type: "photovoltaic";
    answers: PhotovoltaicConfiguratorLeadAnswers;
    result: PhotovoltaicConfiguratorResult;
  };
}

/*
 * Stromspeicher
 */

export interface BatteryStorageConfiguratorLeadAnswers {
  annualConsumptionKwh?: number;
  pvPowerKwp?: number;

  consumptionPattern: BatteryStorageConsumptionPattern;
  backupPreference: BatteryStorageBackupPreference;
  goal: BatteryStorageGoal;
}

export interface SubmitBatteryStorageConfiguratorLeadInput
  extends SubmitConfiguratorLeadCommonInput {
  configurator: {
    type: "battery_storage";
    answers: BatteryStorageConfiguratorLeadAnswers;
    result: BatteryStorageConfiguratorResult;
  };
}

/*
 * Wallbox
 *
 * calculationInput wird bewusst nicht in den Lead
 * übernommen. Die Nutzereingaben stehen in answers;
 * das Lead-Ergebnis enthält nur die relevanten
 * Ergebniswerte.
 */

export interface WallboxConfiguratorLeadAnswers {
  annualDrivingKm: number;
  vehicleConsumptionKwhPer100Km: number;
  batteryCapacityKwh: number;
  homeChargingSharePercent: number;
  chargingPowerKw: 3.7 | 11 | 22;
  pvChargingSharePercent: number;
}

export interface WallboxConfiguratorLeadResult {
  annualVehicleEnergyDemandKwh: number;
  annualHomeChargingInputEnergyKwh: number;
  annualPvChargingEnergyKwh: number;
  annualGridChargingEnergyKwh: number;

  typicalChargingTimeHours: number;

  annualHomeChargingCostEuro: number;
  monthlyHomeChargingCostEuro: number;

  estimatedTotalCostEuro: number;
  estimatedMinimumCostEuro: number;
  estimatedMaximumCostEuro: number;

  usesPhotovoltaicCharging: boolean;
  technicalReviewRecommended: boolean;
}

export interface SubmitWallboxConfiguratorLeadInput
  extends SubmitConfiguratorLeadCommonInput {
  configurator: {
    type: "wallbox";
    answers: WallboxConfiguratorLeadAnswers;
    result: WallboxConfiguratorLeadResult;
  };
}

/*
 * Wärmepumpe
 */

export interface HeatPumpConfiguratorLeadAnswers {
  heatedAreaM2: number;
  specificSpaceHeatingDemandKwhPerM2Year: number;
  occupancyPersons: number;
  requiredFlowTemperatureC: number;
  annualPerformanceFactor: number;
}

export interface HeatPumpConfiguratorLeadResult {
  recommendedHeatPumpCapacityKw: number;

  totalAnnualHeatDemandKwh: number;
  spaceHeatingDemandKwh: number;
  hotWaterDemandKwh: number;

  annualHeatPumpElectricityConsumptionKwh: number;
  annualHeatPumpOperatingCostEuro: number;

  estimatedTotalCostEuro: number;
  estimatedMinimumCostEuro: number;
  estimatedMaximumCostEuro: number;

  flowTemperatureAssessment:
  HeatPumpFlowTemperatureAssessment;

  ntReady: boolean;
  technicalReviewRecommended: boolean;
}

export interface SubmitHeatPumpConfiguratorLeadInput
  extends SubmitConfiguratorLeadCommonInput {
  configurator: {
    type: "heat_pump";
    answers: HeatPumpConfiguratorLeadAnswers;
    result: HeatPumpConfiguratorLeadResult;
  };
}

/*
 * Klimaanlage
 */

export interface ClimateConfiguratorLeadAnswers {
  conditionedAreaM2: number;
  roomCount: number;
  insulationLevel: ClimateInsulationLevel;
  solarLoad: ClimateSolarLoad;
  occupancyPersons: number;
}

export interface ClimateConfiguratorLeadResult {
  calculatedCoolingLoadKw: number;
  recommendedCoolingCapacityKw: number;
  recommendedIndoorUnitCount: number;
  averageCapacityPerRoomKw: number;

  systemRecommendation:
  | "singleSplit"
  | "multiSplit"
  | "projectPlanning";

  annualElectricityConsumptionKwh: number;
  annualOperatingCostEuro: number;

  estimatedTotalCostEuro: number;
  estimatedMinimumCostEuro: number;
  estimatedMaximumCostEuro: number;

  individualPlanningRecommended: boolean;
}

export interface SubmitClimateConfiguratorLeadInput
  extends SubmitConfiguratorLeadCommonInput {
  configurator: {
    type: "climate";
    answers: ClimateConfiguratorLeadAnswers;
    result: ClimateConfiguratorLeadResult;
  };
}

/*
 * Gemeinsamer Submit-Vertrag.
 *
 * configurator.type ist der Discriminator.
 */

export type ConfiguratorLeadPayload =
  | SubmitPhotovoltaicConfiguratorLeadInput["configurator"]
  | SubmitBatteryStorageConfiguratorLeadInput["configurator"]
  | SubmitWallboxConfiguratorLeadInput["configurator"]
  | SubmitHeatPumpConfiguratorLeadInput["configurator"]
  | SubmitClimateConfiguratorLeadInput["configurator"];

export interface SubmitConfiguratorLeadInput
  extends SubmitConfiguratorLeadCommonInput {
  /**
   * Alle vom Benutzer ausgewählten Produkte.
   * Die Reihenfolge entspricht der zentralen
   * Configurator-Journey.
   */
  products: ConfiguratorLeadType[];

  journey: {
    entryPoint: ConfiguratorLeadType;

    selectedProducts: ConfiguratorLeadType[];

    completedProducts: ConfiguratorLeadType[];
  };

  /**
   * Alle tatsächlich abgeschlossenen
   * Konfiguratoren mit Antworten und Ergebnis.
   */
  configurators: ConfiguratorLeadPayload[];
}

export interface SubmitConfiguratorLeadResult {
  ok: true;
  leadId: string;
  mailStatus?: "accepted" | "failed";
}

/*
 * Persistierte PV-Struktur.
 *
 * Für bestehende PV-Leads bleibt schemaVersion 1
 * gültig. Neue Leads dürfen ab 6.8 schemaVersion 2
 * verwenden.
 */

export interface StoredPhotovoltaicConfiguratorAnswers {
  household: {
    persons: HouseholdPersons;
    annualConsumptionKwh: number;
    futureIncreasePercent: number;
    projectedConsumptionKwh: number;
  };

  building: {
    ownership: "owner";
    type: BuildingType;
  };

  roof: {
    pitch: RoofPitch;
    material: RoofMaterial;
    orientation: RoofOrientation;
    renovationPeriod: RoofRenovationPeriod;
  };

  interests: ConfiguratorInterests;

  notes: {
    hasNotes: boolean;
    text: string | null;
  };
}

export interface PhotovoltaicConfiguratorLeadDocument {
  type: "configurator";
  status: LeadStatus;

  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };

  installation: {
    atResidence: boolean;
    street: string;
    postalCode: string;
    city: string;
  };

  configurator: {
    type: "photovoltaic";
    answers: StoredPhotovoltaicConfiguratorAnswers;
    result: PhotovoltaicConfiguratorResult;
  };

  consent: {
    privacyAccepted: true;
    acceptedAt: FirestoreTimestamp;
  };

  meta: {
    source: "konfigurator/photovoltaik";
    schemaVersion: 1 | 2;
  };

  mail?: LeadMailInfo;

  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;

  updatedBy?: string;
}

export interface PhotovoltaicConfiguratorLead
  extends PhotovoltaicConfiguratorLeadDocument {
  id: string;
}

interface StoredConfiguratorLeadDocumentBase {
  type: "configurator";
  status: LeadStatus;

  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };

  installation: {
    atResidence: boolean;
    street: string;
    postalCode: string;
    city: string;
  };

  consent: {
    privacyAccepted: true;
    acceptedAt: FirestoreTimestamp;
  };

  mail?: LeadMailInfo;

  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;

  updatedBy?: string;
}

export interface BatteryStorageConfiguratorLeadDocument
  extends StoredConfiguratorLeadDocumentBase {
  configurator: {
    type: "battery_storage";
    answers: BatteryStorageConfiguratorLeadAnswers;
    result: BatteryStorageConfiguratorResult;
  };

  meta: {
    source: "konfigurator/stromspeicher";
    schemaVersion: 2;
  };
}

export interface BatteryStorageConfiguratorLead
  extends BatteryStorageConfiguratorLeadDocument {
  id: string;
}

export interface WallboxConfiguratorLeadDocument
  extends StoredConfiguratorLeadDocumentBase {
  configurator: {
    type: "wallbox";
    answers: WallboxConfiguratorLeadAnswers;
    result: WallboxConfiguratorLeadResult;
  };

  meta: {
    source: "konfigurator/wallbox";
    schemaVersion: 2;
  };
}

export interface WallboxConfiguratorLead
  extends WallboxConfiguratorLeadDocument {
  id: string;
}

export interface HeatPumpConfiguratorLeadDocument
  extends StoredConfiguratorLeadDocumentBase {
  configurator: {
    type: "heat_pump";
    answers: HeatPumpConfiguratorLeadAnswers;
    result: HeatPumpConfiguratorLeadResult;
  };

  meta: {
    source: "konfigurator/waermepumpe";
    schemaVersion: 2;
  };
}

export interface HeatPumpConfiguratorLead
  extends HeatPumpConfiguratorLeadDocument {
  id: string;
}

export interface ClimateConfiguratorLeadDocument
  extends StoredConfiguratorLeadDocumentBase {
  configurator: {
    type: "climate";
    answers: ClimateConfiguratorLeadAnswers;
    result: ClimateConfiguratorLeadResult;
  };

  meta: {
    source: "konfigurator/klimaanlage";
    schemaVersion: 2;
  };
}

export interface ClimateConfiguratorLead
  extends ClimateConfiguratorLeadDocument {
  id: string;
}

export type ConfiguratorLeadDocument =
  | PhotovoltaicConfiguratorLeadDocument
  | BatteryStorageConfiguratorLeadDocument
  | WallboxConfiguratorLeadDocument
  | HeatPumpConfiguratorLeadDocument
  | ClimateConfiguratorLeadDocument;

export type ConfiguratorLead =
  | PhotovoltaicConfiguratorLead
  | BatteryStorageConfiguratorLead
  | WallboxConfiguratorLead
  | HeatPumpConfiguratorLead
  | ClimateConfiguratorLead;

export function isPhotovoltaicConfiguratorLead(
  lead: ConfiguratorLead,
): lead is PhotovoltaicConfiguratorLead {
  return (
    lead.configurator.type ===
    "photovoltaic"
  );
}

export function isBatteryStorageConfiguratorLead(
  lead: ConfiguratorLead,
): lead is BatteryStorageConfiguratorLead {
  return (
    lead.configurator.type ===
    "battery_storage"
  );
}

export function isWallboxConfiguratorLead(
  lead: ConfiguratorLead,
): lead is WallboxConfiguratorLead {
  return (
    lead.configurator.type ===
    "wallbox"
  );
}

export function isHeatPumpConfiguratorLead(
  lead: ConfiguratorLead,
): lead is HeatPumpConfiguratorLead {
  return (
    lead.configurator.type ===
    "heat_pump"
  );
}

export function isClimateConfiguratorLead(
  lead: ConfiguratorLead,
): lead is ClimateConfiguratorLead {
  return (
    lead.configurator.type ===
    "climate"
  );
}

export function hasPhotovoltaicConfiguratorResult(
  state: ConfiguratorState,
): state is ConfiguratorState & {
  results: {
    photovoltaic: PhotovoltaicConfiguratorResult;
  };
} {
  return state.results.photovoltaic !== undefined;
}