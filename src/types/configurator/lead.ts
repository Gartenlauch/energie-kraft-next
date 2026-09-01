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

  /**
   * Bestehender Status der internen
   * Energie-Kraft Benachrichtigung.
   */
  mailStatus?:
  | "accepted"
  | "failed";

  customerMailStatus?:
  | "accepted"
  | "failed";

  reportStatus?:
  | "generated"
  | "failed";
}

/*
 * Persistierte PV-Struktur.
 *
 * Für bestehende PV-Leads bleibt schemaVersion 1
 * gültig. Neue Leads dürfen ab 6.8 schemaVersion 2
 * verwenden.
 */
/*
 * Persistierter Gesamtprojekt-Lead.
 *
 * Seit schemaVersion 3 wird eine Kundenanfrage
 * immer als ein gemeinsames Energieprojekt mit
 * mehreren configurators[] gespeichert.
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

    renovationPeriod:
    RoofRenovationPeriod;
  };

  interests:
  ConfiguratorInterests;

  notes: {
    hasNotes: boolean;

    text: string | null;
  };
}

export interface StoredPhotovoltaicConfiguratorLeadPayload {
  type: "photovoltaic";

  answers:
  StoredPhotovoltaicConfiguratorAnswers;

  result:
  PhotovoltaicConfiguratorResult;
}

export type StoredConfiguratorLeadPayload =
  | StoredPhotovoltaicConfiguratorLeadPayload
  | Exclude<
    ConfiguratorLeadPayload,
    {
      type: "photovoltaic";
    }
  >;

export interface ConfiguratorLeadReportInfo {
  status:
  | "generated"
  | "failed";

  filename:
  string | null;

  sizeBytes:
  number | null;

  generatedAt:
  FirestoreTimestamp | null;

  updatedAt:
  FirestoreTimestamp;
}

export interface ConfiguratorLeadDocument {
  type: "configurator";

  status: LeadStatus;

  products:
  ConfiguratorLeadType[];

  journey: {
    entryPoint:
    ConfiguratorLeadType;

    selectedProducts:
    ConfiguratorLeadType[];

    completedProducts:
    ConfiguratorLeadType[];
  };

  configurators:
  StoredConfiguratorLeadPayload[];

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

  meta: {
    source:
    ConfiguratorLeadSource;

    schemaVersion: 3;
  };

  mail?: LeadMailInfo;

  report?:
  ConfiguratorLeadReportInfo;

  createdAt:
  FirestoreTimestamp;

  updatedAt:
  FirestoreTimestamp;

  updatedBy?: string;
}

export interface ConfiguratorLead
  extends ConfiguratorLeadDocument {
  id: string;
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