import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { RoofMaterialIllustration } from "@/components/configurator/photovoltaic/roof-material-illustration";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import {
  photovoltaicConfiguratorContent,
  photovoltaicRoofMaterialOptions,
} from "@/content/configurators";
import type { RoofMaterial } from "@/types/configurator";

interface RoofMaterialStepProps {
  selected?: RoofMaterial;
  onSelect: (value: RoofMaterial) => void;
}

export function RoofMaterialStep({
  selected,
  onSelect,
}: RoofMaterialStepProps) {
  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-roof-material-heading"
      eyebrow={photovoltaicConfiguratorContent.eyebrow}
      title="Aus welchem Material besteht dein Dach?"
      description="Wähle die Dacheindeckung, die deinem Gebäude am ehesten entspricht."
    >
      <SelectionGrid columns={3}>
        {photovoltaicRoofMaterialOptions.map((option) => (
          <SelectionCard
            key={option.value}
            title={option.title}
            selected={selected === option.value}
            onSelect={() => onSelect(option.value)}
            media={
              <RoofMaterialIllustration
                material={option.value}
              />
            }
          />
        ))}
      </SelectionGrid>
    </ConfiguratorStepSection>
  );
}