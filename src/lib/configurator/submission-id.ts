import type { ConfiguratorState } from "@/types/configurator";
import { writeConfiguratorState } from "@/lib/configurator/storage";

export function createConfiguratorSubmissionId(): string {
  const provider = globalThis.crypto;
  if (!provider?.getRandomValues) throw new Error("Secure random IDs are unavailable");
  if (typeof provider.randomUUID === "function") return provider.randomUUID();
  const bytes = provider.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function ensureConfiguratorSubmissionId(state: ConfiguratorState, storage: Storage): string {
  if (state.submission.id) return state.submission.id;
  const id = createConfiguratorSubmissionId();
  if (!writeConfiguratorState(storage, {
    ...state,
    submission: { ...state.submission, id },
  })) {
    throw new Error("Configurator submission draft could not be stored");
  }
  return id;
}
