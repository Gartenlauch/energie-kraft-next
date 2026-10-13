import type { ConfiguratorInterests } from "@/types/configurator";

const consumptionSolutions = [
  { key: "heatPump", label: "Wärmepumpe" },
  { key: "climate", label: "Klimaanlage" },
  { key: "wallbox", label: "Wallbox" },
] as const;

export type ConsumptionSolution = (typeof consumptionSolutions)[number]["key"];

export function getAdditionalConsumptionSolutions(interests: ConfiguratorInterests): ConsumptionSolution[] {
  return consumptionSolutions.filter(({ key }) => interests[key]).map(({ key }) => key);
}

export function getAdditionalConsumptionReminder(
  interests: ConfiguratorInterests,
  acknowledged: readonly ConsumptionSolution[] = [],
): string | null {
  const selected = consumptionSolutions.filter(({ key }) => interests[key]);
  if (!selected.some(({ key }) => !acknowledged.includes(key))) return null;

  const labels = new Intl.ListFormat("de-DE", { type: "conjunction" }).format(
    selected.map(({ label }) => label),
  );
  return `Haben Sie den zusätzlichen Stromverbrauch für Ihre ${labels} bereits in Schritt 9 berücksichtigt?`;
}
