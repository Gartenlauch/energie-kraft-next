import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { TextareaField } from "@/components/configurator/textarea-field";
import { photovoltaicNotesOptions } from "@/content/configurators";

interface NotesStepProps {
  hasNotes: boolean | undefined;
  text: string;
  onHasNotesChange: (value: boolean) => void;
  onTextChange: (value: string) => void;
}

export function NotesStep({
  hasNotes,
  text,
  onHasNotesChange,
  onTextChange,
}: NotesStepProps) {
  const textRequired =
    hasNotes === true && text.trim().length === 0;

  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-notes-heading"
      eyebrow="Photovoltaik-Konfigurator"
      title="Gibt es weitere Informationen, die berücksichtigt werden sollen?"
      description="Zum Beispiel Besonderheiten vor Ort, Wünsche, Installationspositionen oder bekannte Einschränkungen."
    >
      <SelectionGrid columns={2}>
        {photovoltaicNotesOptions.map((option) => (
          <SelectionCard
            key={String(option.value)}
            title={option.title}
            selected={hasNotes === option.value}
            onSelect={() =>
              onHasNotesChange(option.value)
            }
          />
        ))}
      </SelectionGrid>

      {hasNotes === true ? (
        <div className="mt-8">
          <TextareaField
            id="photovoltaic-notes"
            label="Deine Anmerkungen"
            value={text}
            onChange={onTextChange}
            helpText="Bitte beschreibe kurz, was wir bei deinem Projekt berücksichtigen sollen."
            error={
              textRequired
                ? "Bitte ergänze deine Anmerkung."
                : undefined
            }
          />
        </div>
      ) : null}
    </ConfiguratorStepSection>
  );
}