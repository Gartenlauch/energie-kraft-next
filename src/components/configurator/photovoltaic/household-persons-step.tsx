import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import {
  photovoltaicConfiguratorContent,
  photovoltaicHouseholdPersonOptions,
} from "@/content/configurators";
import type { HouseholdPersons } from "@/types/configurator";

interface HouseholdPersonsStepProps {
  selected?: HouseholdPersons;
  onSelect: (value: HouseholdPersons) => void;
}

export function HouseholdPersonsStep({
  selected,
  onSelect,
}: HouseholdPersonsStepProps) {
  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-household-heading"
      eyebrow={photovoltaicConfiguratorContent.eyebrow}
      title="Wie viele Personen leben in deinem Haushalt?"
      description="Die Haushaltsgröße hilft uns, deinen Stromverbrauch sinnvoll vorzubelegen."
    >
      <SelectionGrid columns={4}>
        {photovoltaicHouseholdPersonOptions.map((option) => (
          <SelectionCard
            key={String(option.value)}
            title={option.title}
            description={option.description}
            selected={selected === option.value}
            onSelect={() => onSelect(option.value)}
            media={
              <span className="text-3xl font-semibold text-brand-primary">
                {option.value === "4_5" ? "4–5" : option.value}
              </span>
            }
          />
        ))}
      </SelectionGrid>
    </ConfiguratorStepSection>
  );
}