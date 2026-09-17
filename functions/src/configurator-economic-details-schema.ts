import { z } from "zod";

const money = z.number().finite();
const nonnegative = money.nonnegative();
export const investmentSourceSchema = z.enum([
  "photovoltaic.pricing", "batteryStorage.pricing", "heatPump", "climate", "wallbox",
]);
export const projectPaybackStatusSchema = z.enum([
  "reached", "not_reached_within_horizon", "unavailable_missing_investment", "not_applicable",
]);
export const projectIrrStatusSchema = z.enum([
  "valid", "unavailable_missing_investment", "unavailable_no_valid_irr", "not_applicable",
]);
const flow = z.object({
  generationKwh: nonnegative,
  demandKwh: nonnegative,
  directUseKwh: nonnegative,
  storageChargeKwh: nonnegative,
  storageDeliveredKwh: nonnegative,
  storageLossesKwh: nonnegative,
  gridPurchaseKwh: nonnegative,
  feedInKwh: nonnegative,
  selfConsumptionPercent: nonnegative.max(100),
  autarkyPercent: nonnegative.max(100),
}).strict();

export const solarEconomicsSchema = z.object({
  investmentEuro: nonnegative.nullable(),
  storageInvestmentEuro: nonnegative.nullable(),
  storageUsableCapacityKwh: nonnegative,
  withoutStorage: flow,
  withStorage: flow,
  storageAvoidedGridPurchaseKwh: nonnegative,
  storageReducedFeedInKwh: nonnegative,
  withoutStorageFirstYearBenefitEuro: money,
  withStorageFirstYearBenefitEuro: money,
  storageAdditionalAnnualBenefitEuro: money,
  firstYearElectricitySavingsEuro: nonnegative,
  firstYearFeedInRevenueEuro: nonnegative,
  firstYearOperatingCostsEuro: nonnegative,
  firstYearNetBenefitEuro: money,
  annualCashflows: z.array(z.object({
    year: z.number().int().min(0).max(50),
    electricityCostSavingsEuro: nonnegative,
    feedInRevenueEuro: nonnegative,
    storageAdditionalBenefitEuro: money,
    operatingCostsEuro: nonnegative,
    netAnnualBenefitEuro: money.nullable(),
    cumulativeCashFlowEuro: money.nullable(),
  }).strict()).max(51),
  paybackYears: nonnegative.nullable(),
  paybackStatus: z.enum(["reached", "not_reached_within_horizon", "unavailable_missing_investment"]),
  annualizedReturnPercent: money.nullable(),
  irrStatus: z.enum(["valid", "unavailable_missing_investment", "unavailable_no_valid_irr"]),
  netSurplus20YearsEuro: money.nullable(),
}).strict();

export const heatingSavingsSchema = z.object({
  referenceSource: z.string().min(1).max(200),
  currentAnnualEuro: nonnegative.nullable(),
  heatPumpAnnualEuro: nonnegative,
  annualSavingEuro: money.nullable(),
  savingPercent: money.nullable(),
  saving10YearsEuro: money.nullable(),
  saving20YearsEuro: money.nullable(),
}).strict();
