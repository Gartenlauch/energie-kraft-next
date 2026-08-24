import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { RoofOrientationIllustration } from "@/components/configurator/photovoltaic/roof-orientation-illustration";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import {
  photovoltaicConfiguratorContent,
  photovoltaicRoofOrientationOptions,
} from "@/content/configurators";
import type { RoofOrientation } from "@/types/configurator";

interface RoofOrientationStepProps {
  selected?: RoofOrientation;
  onSelect: (value: RoofOrientation) => void;
}

export function RoofOrientationStep({
  selected,
  onSelect,
}: RoofOrientationStepProps) {
  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-roof-orientation-heading"
      eyebrow={photovoltaicConfiguratorContent.eyebrow}
      title="Wie ist dein Dach hauptsächlich ausgerichtet?"
      description="Die Dachausrichtung beeinflusst, wann und wie viel Solarstrom erzeugt werden kann."
    >
      <SelectionGrid columns={4}>
        {photovoltaicRoofOrientationOptions.map((option) => (
          <SelectionCard
            key={option.value}
            title={option.title}
            description={option.description}
            selected={selected === option.value}
            onSelect={() => onSelect(option.value)}
            media={
              <RoofOrientationIllustration
                orientation={option.value}
              />
            }
          />
        ))}
      </SelectionGrid>
    </ConfiguratorStepSection>
  );
}