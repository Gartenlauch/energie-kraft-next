export type ConfiguratorPhase = "configuration" | "contact" | "submit";

export interface ConfiguratorStepDefinition {
  id: string;
  title: string;
  shortLabel?: string;
  description?: string;
  phase: ConfiguratorPhase;
}

export interface ConfiguratorSelectionOption<
  TValue extends string | number,
> {
  value: TValue;
  title: string;
  description?: string;
}