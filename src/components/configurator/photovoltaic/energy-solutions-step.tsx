import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { photovoltaicEnergySolutionOptions } from "@/content/configurators";
import type {
    ConfiguratorInterests,
    PhotovoltaicEnergySolution,
} from "@/types/configurator";

interface EnergySolutionsStepProps {
    interests: ConfiguratorInterests;

    onToggle: (
        solution: PhotovoltaicEnergySolution,
    ) => void;
}

export function EnergySolutionsStep({
    interests,
    onToggle,
}: EnergySolutionsStepProps) {
    return (
        <ConfiguratorStepSection
            headingId="photovoltaic-energy-solutions-heading"
            eyebrow="Photovoltaik-Konfigurator"
            title="Welche weiteren Energielösungen möchtest du berücksichtigen?"
            description="Wähle optional die Bereiche aus, die für dein Energieprojekt relevant sind."
        >
            <SelectionGrid columns={2}>
                {photovoltaicEnergySolutionOptions.map(
                    (option) => (
                        <SelectionCard
                            key={option.value}
                            title={option.title}
                            description={option.description}
                            selected={
                                interests[option.value]
                            }
                            onSelect={() =>
                                onToggle(option.value)
                            }
                        />
                    ),
                )}
            </SelectionGrid>

            <div className="mt-6 rounded-2xl border border-border-default bg-surface p-5">
                <p className="leading-7 text-foreground/70">
                    Wenn du mehrere Bereiche auswählst,
                    führen wir dich nach der
                    Photovoltaik-Konfiguration automatisch
                    nacheinander durch die ausgewählten
                    Konfiguratoren. Danach ergänzt du einmal
                    deine Kontaktdaten.
                </p>
            </div>
        </ConfiguratorStepSection>
    );
}