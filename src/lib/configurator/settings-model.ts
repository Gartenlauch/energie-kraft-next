export {
  CONFIGURATOR_SETTINGS_SCHEMA_VERSION,
  DEFAULT_CONFIGURATOR_SETTINGS,
  buildConfiguratorPublicReference,
  createNextConfiguratorSettingsVersion,
  configuratorSettingsSchema,
  parseConfiguratorSettings,
  priceTierSchema,
  nextConfiguratorReferenceSequence,
  resolveConfiguratorSettingsOrDefaults,
} from "../../../functions/src/configurator-settings-model";

export { calculateTieredCostCorridor, resolveTierPrice } from "../../../functions/src/configurator-technical-model";

export type {
  ConfiguratorSettings,
  PriceTier,
  PricingMode,
} from "../../../functions/src/configurator-settings-model";

export type { TieredCostCorridor, TierPriceResolution } from "../../../functions/src/configurator-technical-model";
