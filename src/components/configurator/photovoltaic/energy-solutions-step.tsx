import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { photovoltaicEnergySolutionOptions } from "@/content/configurators";
import { getAdditionalConsumptionReminder, type ConsumptionSolution } from "@/lib/configurator/additional-consumption";
import type {
    ConfiguratorInterests,
    PhotovoltaicEnergySolution,
} from "@/types/configurator";

interface EnergySolutionsStepProps {
    interests: ConfiguratorInterests;
    acknowledgedConsumptionSolutions?: ConsumptionSolution[];
    onAdjustConsumption: () => void;
    onAcknowledgeConsumption: () => void;

    onToggle: (
        solution: PhotovoltaicEnergySolution,
    ) => void;
}

export function EnergySolutionsStep({
    interests,
    onToggle,
    acknowledgedConsumptionSolutions,
    onAdjustConsumption,
    onAcknowledgeConsumption,
}: EnergySolutionsStepProps) {
    const reminder = getAdditionalConsumptionReminder(interests, acknowledgedConsumptionSolutions);
    return (
        <ConfiguratorStepSection
            headingId="photovoltaic-energy-solutions-heading"
            eyebrow="Photovoltaik-Konfigurator"
            title="Welche weiteren Energielösungen möchten Sie berücksichtigen?"
            description="Wählen Sie optional die Bereiche aus, die für Ihr Energieprojekt relevant sind."
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

            <div aria-live="polite" aria-atomic="true">
                {reminder ? (
                    <aside aria-label="Zusätzlichen Stromverbrauch berücksichtigen" className="mt-6 border-l-4 border-brand-secondary bg-surface px-5 py-5 sm:px-6">
                        <p className="text-brand-navy font-semibold leading-7">{reminder}</p>
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <button type="button" className="button-primary min-h-11" onClick={onAdjustConsumption}>
                                Verbrauch anpassen
                            </button>
                            <button type="button" className="button-secondary min-h-11" onClick={onAcknowledgeConsumption}>
                                Bereits berücksichtigt
                            </button>
                        </div>
                    </aside>
                ) : null}
            </div>

            <div className="mt-6 rounded-2xl border border-border-default bg-surface p-5">
                <p className="leading-7 text-foreground/70">
                    Wenn Sie mehrere Bereiche auswählen,
                    führen wir Sie nach der
                    Photovoltaik-Konfiguration automatisch
                    nacheinander durch die ausgewählten
                    Konfiguratoren. Danach ergänzen Sie einmal
                    Ihre Kontaktdaten.
                </p>
            </div>
        </ConfiguratorStepSection>
    );
}
