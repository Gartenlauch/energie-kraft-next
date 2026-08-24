import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";

interface BatteryStorageStepProps {
  selected: boolean;
  onChange: (value: boolean) => void;
}

export function BatteryStorageStep({
  selected,
  onChange,
}: BatteryStorageStepProps) {
  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-battery-storage-heading"
      eyebrow="Photovoltaik-Konfigurator"
      title="Möchtest du einen Stromspeicher berücksichtigen?"
      description="Ein Stromspeicher kann Solarstrom für die Nutzung am Abend oder in der Nacht verfügbar machen."
    >
      <label
        className={[
          "flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition",
          selected
            ? "border-brand-accent bg-surface ring-2 ring-brand-accent"
            : "border-border-default bg-background hover:border-brand-secondary",
        ].join(" ")}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) =>
            onChange(event.currentTarget.checked)
          }
          className="mt-1 h-5 w-5 shrink-0"
        />

        <span>
          <span className="block font-semibold text-brand-primary">
            Stromspeicher berücksichtigen
          </span>

          <span className="mt-1 block leading-7 text-foreground/70">
            Wenn du diese Option auswählst, berücksichtigen wir
            den Speicherwunsch in der späteren Empfehlung.
          </span>
        </span>
      </label>

      <div className="mt-6 rounded-2xl border border-border-default bg-surface p-5">
        <p className="leading-7 text-foreground/70">
          Nach dem Photovoltaik-Konfigurator kannst du optional
          direkt mit dem Stromspeicher-Konfigurator
          weitermachen. Bereits bekannte Angaben werden dabei
          übernommen.
        </p>
      </div>
    </ConfiguratorStepSection>
  );
}