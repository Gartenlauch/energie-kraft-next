import type { ContactLead } from "@/types/contact-lead";
import type { PhotovoltaicConfiguratorLead } from "@/types/configurator";

export type AdminLead =
  | ContactLead
  | PhotovoltaicConfiguratorLead;

export type AdminLeadType =
  AdminLead["type"];

export function isAdminLeadType(
  value: unknown,
): value is AdminLeadType {
  return (
    value === "contact" ||
    value === "configurator"
  );
}

export function isContactAdminLead(
  lead: AdminLead,
): lead is ContactLead {
  return lead.type === "contact";
}

export function isConfiguratorAdminLead(
  lead: AdminLead,
): lead is PhotovoltaicConfiguratorLead {
  return lead.type === "configurator";
}