import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { BuildingTypeIllustration } from "@/components/configurator/photovoltaic/building-type-illustration";
import {
  photovoltaicBuildingTypeOptions,
  photovoltaicConfiguratorContent,
} from "@/content/configurators";
import type { BuildingType } from "@/types/configurator";

interface BuildingTypeStepProps {
  selected?: BuildingType;
  onSelect: (value: BuildingType) => void;
}

export function BuildingTypeStep({
  selected,
  onSelect,
}: BuildingTypeStepProps) {
  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-building-heading"
      eyebrow={photovoltaicConfiguratorContent.eyebrow}
      title="Um welche Gebäudeart handelt es sich?"
      description="Wähle die Gebäudeart, auf der die Photovoltaikanlage geplant werden soll."
    >
      <SelectionGrid columns={3}>
        {photovoltaicBuildingTypeOptions.map((option) => (
          <SelectionCard
            key={option.value}
            title={option.title}
            selected={selected === option.value}
            onSelect={() => onSelect(option.value)}
            media={
              <BuildingTypeIllustration
                type={option.value}
              />
            }
          />
        ))}
      </SelectionGrid>
    </ConfiguratorStepSection>
  );
}