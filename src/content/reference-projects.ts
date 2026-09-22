import { referenceGroups } from "@/generated/reference-projects.generated";

export type ReferenceGroup = (typeof referenceGroups)[number];
export type ReferenceProject = ReferenceGroup["projects"][number];

export { referenceGroups };

export function getReferenceGroup(slug: string) {
  return referenceGroups.find((group) => group.groupSlug === slug);
}

export function formatReferenceCaption(project: ReferenceProject) {
  const capacity = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 3 }).format(
    project.capacityKwp,
  );
  return `${project.actualLocation} · ${capacity} kWp · ${project.customerType}`;
}
