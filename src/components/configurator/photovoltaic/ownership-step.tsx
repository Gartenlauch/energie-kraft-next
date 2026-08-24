import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import {
  photovoltaicConfiguratorContent,
  photovoltaicOwnershipOptions,
} from "@/content/configurators";
import type { BuildingOwnership } from "@/types/configurator";

interface OwnershipStepProps {
  selected?: BuildingOwnership;
  onSelect: (value: BuildingOwnership) => void;
}

export function OwnershipStep({
  selected,
  onSelect,
}: OwnershipStepProps) {
  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-ownership-heading"
      eyebrow={photovoltaicConfiguratorContent.eyebrow}
      title="Bist du Eigentümer oder Mieter?"
      description="Für eine fest installierte Photovoltaikanlage ist die Zustimmung des Eigentümers erforderlich."
    >
      <SelectionGrid columns={2}>
        {photovoltaicOwnershipOptions.map((option) => (
          <SelectionCard
            key={option.value}
            title={option.title}
            description={option.description}
            selected={selected === option.value}
            onSelect={() => onSelect(option.value)}
          />
        ))}
      </SelectionGrid>
    </ConfiguratorStepSection>
  );
}