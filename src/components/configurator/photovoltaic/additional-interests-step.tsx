import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { photovoltaicAdditionalInterestOptions } from "@/content/configurators";
import type {
  ConfiguratorInterests,
  PhotovoltaicAdditionalInterest,
} from "@/types/configurator";

interface AdditionalInterestsStepProps {
  interests: ConfiguratorInterests;
  onToggle: (
    interest: PhotovoltaicAdditionalInterest,
  ) => void;
}

export function AdditionalInterestsStep({
  interests,
  onToggle,
}: AdditionalInterestsStepProps) {
  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-additional-interests-heading"
      eyebrow="Photovoltaik-Konfigurator"
      title="Interessierst du dich für weitere Energielösungen?"
      description="Die Auswahl ist optional. Du kannst auch ohne zusätzliche Auswahl fortfahren."
    >
      <SelectionGrid columns={3}>
        {photovoltaicAdditionalInterestOptions.map(
          (option) => (
            <SelectionCard
              key={option.value}
              title={option.title}
              description={option.description}
              selected={interests[option.value]}
              onSelect={() => onToggle(option.value)}
            />
          ),
        )}
      </SelectionGrid>
    </ConfiguratorStepSection>
  );
}