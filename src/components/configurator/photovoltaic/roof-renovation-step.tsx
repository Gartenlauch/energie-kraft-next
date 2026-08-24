import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import {
  photovoltaicConfiguratorContent,
  photovoltaicRoofRenovationOptions,
} from "@/content/configurators";
import type { RoofRenovationPeriod } from "@/types/configurator";

interface RoofRenovationStepProps {
  selected?: RoofRenovationPeriod;
  onSelect: (value: RoofRenovationPeriod) => void;
}

export function RoofRenovationStep({
  selected,
  onSelect,
}: RoofRenovationStepProps) {
  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-roof-renovation-heading"
      eyebrow={photovoltaicConfiguratorContent.eyebrow}
      title="Wann wurde dein Dach gebaut oder zuletzt saniert?"
      description="Diese Information dient der Vorbereitung der späteren technischen Prüfung und ist keine automatische Bewertung deines Daches."
    >
      <SelectionGrid columns={3}>
        {photovoltaicRoofRenovationOptions.map((option) => (
          <SelectionCard
            key={option.value}
            title={option.title}
            selected={selected === option.value}
            onSelect={() => onSelect(option.value)}
            media={
              <span
                className="text-2xl font-semibold text-brand-primary"
                aria-hidden="true"
              >
                {option.value === "unknown" ? "?" : "⌂"}
              </span>
            }
          />
        ))}
      </SelectionGrid>
    </ConfiguratorStepSection>
  );
}