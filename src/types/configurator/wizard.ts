export type ConfiguratorPhase = "configuration" | "contact" | "submit";

export interface ConfiguratorStepDefinition {
  id: string;
  title: string;
  shortLabel?: string;
  description?: string;
  phase: ConfiguratorPhase;
}