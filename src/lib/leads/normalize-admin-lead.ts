import type { AdminLead } from "@/types/admin-lead";
import type { ContactLeadDocument } from "@/types/contact-lead";
import type { ConfiguratorLeadDocument } from "@/types/configurator";

const SUPPORTED_CONFIGURATOR_SCHEMA_VERSIONS = new Set([3, 4]);

export function normalizeAdminLeadDocument(
  id: string,
  data: Record<string, unknown>,
): AdminLead | null {
  if (data.type === "contact") {
    return { id, ...(data as unknown as ContactLeadDocument) };
  }
  if (data.type === "configurator") {
    if (
      typeof data.meta !== "object" ||
      data.meta === null ||
      !("schemaVersion" in data.meta) ||
      !SUPPORTED_CONFIGURATOR_SCHEMA_VERSIONS.has(data.meta.schemaVersion as number) ||
      !Array.isArray(data.products) ||
      !Array.isArray(data.configurators) ||
      typeof data.journey !== "object" ||
      data.journey === null
    ) {
      return null;
    }
    return { id, ...(data as unknown as ConfiguratorLeadDocument) };
  }
  return null;
}
