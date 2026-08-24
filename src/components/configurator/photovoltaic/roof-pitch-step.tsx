import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { RoofPitchIllustration } from "@/components/configurator/photovoltaic/roof-pitch-illustration";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import {
  photovoltaicConfiguratorContent,
  photovoltaicRoofPitchOptions,
} from "@/content/configurators";
import type { RoofPitch } from "@/types/configurator";

interface RoofPitchStepProps {
  selected?: RoofPitch;
  onSelect: (value: RoofPitch) => void;
}

export function RoofPitchStep({
  selected,
  onSelect,
}: RoofPitchStepProps) {
  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-roof-pitch-heading"
      eyebrow={photovoltaicConfiguratorContent.eyebrow}
      title="Welche Neigung hat dein Dach?"
      description="Eine ungefähre Einschätzung reicht aus. Die exakte Dachneigung wird später bei der technischen Planung geprüft."
    >
      <SelectionGrid columns={4}>
        {photovoltaicRoofPitchOptions.map((option) => (
          <SelectionCard
            key={option.value}
            title={option.title}
            description={option.description}
            selected={selected === option.value}
            onSelect={() => onSelect(option.value)}
            media={
              <RoofPitchIllustration
                pitch={option.value}
              />
            }
          />
        ))}
      </SelectionGrid>
    </ConfiguratorStepSection>
  );
}