import { calculateCanonicalProjectEconomics } from "../../../functions/src/configurator-project-economics";
import type { ConfiguratorState, ProjectEconomicsResult } from "@/types/configurator";

/** Preview uses the same economics model that reprices the persisted server result. */
export function calculateProjectEconomics(state: ConfiguratorState): ProjectEconomicsResult {
  return calculateCanonicalProjectEconomics({
    photovoltaic: state.results.photovoltaic,
    batteryStorage: state.results.batteryStorage,
    heatPump: state.results.heatPump,
    climate: state.results.climate,
    wallbox: state.results.wallbox,
  }, state.settings);
}
