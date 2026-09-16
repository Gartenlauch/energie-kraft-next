import { clearCalculatorHandoff } from "@/lib/configurator/calculator-handoff";
import { clearConfiguratorState } from "@/lib/configurator/storage";

export function clearSubmittedConfiguratorProject(storage: Storage): void {
  clearConfiguratorState(storage);
  clearCalculatorHandoff(storage);
}
