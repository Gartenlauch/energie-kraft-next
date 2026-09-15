"use client";

import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { useConfigurator } from "@/lib/configurator/configurator-context";
import type { ConfiguratorInterests, ConfiguratorType } from "@/types/configurator";

const OPTIONS = [
  {
    type: "photovoltaic",
    interest: "photovoltaic",
    title: "Photovoltaik",
    description:
      "Eigenen Solarstrom erzeugen und weitere Verbraucher in ein Gesamtsystem einbinden.",
  },
  {
    type: "battery_storage",
    interest: "batteryStorage",
    title: "Stromspeicher",
    description: "Solarenergie zeitversetzt nutzen und den Eigenverbrauch erhöhen.",
  },
  {
    type: "wallbox",
    interest: "wallbox",
    title: "Wallbox",
    description: "Das Elektroauto komfortabel zu Hause und optional mit Solarstrom laden.",
  },
  {
    type: "heat_pump",
    interest: "heatPump",
    title: "Wärmepumpe",
    description: "Wärmeversorgung und Stromsystem gemeinsam betrachten.",
  },
  {
    type: "climate",
    interest: "climate",
    title: "Klimaanlage",
    description: "Kühlung, Strombedarf und PV-Kompatibilität einordnen.",
  },
] as const satisfies readonly {
  type: ConfiguratorType;
  interest: keyof ConfiguratorInterests;
  title: string;
  description: string;
}[];

export function AdditionalEnergySolutions({
  currentProduct,
}: {
  currentProduct: ConfiguratorType;
}) {
  const { state, dispatch } = useConfigurator();
  const options = OPTIONS.filter((option) => option.type !== currentProduct);

  return (
    <section
      className="border-border-default mt-8 border-y py-7"
      aria-labelledby={`${currentProduct}-additional-solutions`}
    >
      <p className="eyebrow">Dein Energieprojekt erweitern</p>
      <h2
        id={`${currentProduct}-additional-solutions`}
        className="text-brand-navy mt-3 text-2xl font-semibold tracking-tight"
      >
        Weitere Energielösungen berücksichtigen?
      </h2>
      <p className="text-foreground/70 mt-3 max-w-2xl leading-7">
        Optional auswählen. Abgeschlossene Ergebnisse bleiben erhalten; jede Lösung wird höchstens
        einmal konfiguriert.
      </p>
      <div className="mt-5">
        <SelectionGrid columns={2}>
          {options.map((option) => (
            <SelectionCard
              key={option.type}
              title={option.title}
              description={option.description}
              selected={state.interests[option.interest]}
              onSelect={() =>
                dispatch({
                  type: "UPDATE_INTERESTS",
                  payload: { [option.interest]: !state.interests[option.interest] },
                })
              }
            />
          ))}
        </SelectionGrid>
      </div>
    </section>
  );
}
