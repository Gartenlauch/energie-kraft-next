import type { ContactLead } from "@/types/contact-lead";
import type {
  ConfiguratorLead,
  ConfiguratorLeadType,
} from "@/types/configurator";

export type AdminLead =
  | ContactLead
  | ConfiguratorLead;

export type AdminLeadType =
  AdminLead["type"];

export type AdminLeadFilterType =
  | "contact"
  | ConfiguratorLeadType;

export function isAdminLeadType(
  value: unknown,
): value is AdminLeadType {
  return (
    value === "contact" ||
    value === "configurator"
  );
}

export function isAdminLeadFilterType(
  value: unknown,
): value is AdminLeadFilterType {
  return (
    value === "contact" ||
    value === "photovoltaic" ||
    value === "battery_storage" ||
    value === "wallbox" ||
    value === "heat_pump" ||
    value === "climate"
  );
}

export function isContactAdminLead(
  lead: AdminLead,
): lead is ContactLead {
  return lead.type === "contact";
}

export function isConfiguratorAdminLead(
  lead: AdminLead,
): lead is ConfiguratorLead {
  return lead.type === "configurator";
}

export function matchesAdminLeadFilter(
  lead: AdminLead,
  filter: AdminLeadFilterType,
): boolean {
  if (filter === "contact") {
    return lead.type === "contact";
  }

  return (
    lead.type === "configurator" &&
    lead.configurator.type === filter
  );
}