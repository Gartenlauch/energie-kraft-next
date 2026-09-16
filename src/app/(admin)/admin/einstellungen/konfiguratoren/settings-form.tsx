"use client";

import { useState } from "react";

import type { ConfiguratorSettings } from "@/lib/configurator/settings-model";

import { saveConfiguratorSettingsAction } from "./actions";

interface NumberFieldProps {
  label: string;
  unit: string;
  value: number;
  step?: number;
  help?: string;
  onChange: (value: number) => void;
}

function NumberField({ label, unit, value, step = 0.01, help, onChange }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="mt-2 flex min-h-11 overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/20">
        <input
          type="number"
          required
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
          className="min-w-0 flex-1 px-3 py-2.5 text-slate-950 outline-none"
        />
        <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">
          {unit}
        </span>
      </span>
      {help ? <span className="mt-1.5 block text-xs leading-5 text-slate-500">{help}</span> : null}
    </label>
  );
}

function TierEditor({
  label,
  sizeUnit,
  priceUnit,
  tiers,
  maxModeledSize,
  onChange,
}: {
  label: string;
  sizeUnit: string;
  priceUnit: string;
  tiers: ConfiguratorSettings["photovoltaic"]["pricing"]["tiers"];
  maxModeledSize: number;
  onChange: (value: { tiers: typeof tiers; maxModeledSize: number }) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-950">{label}</h3>
      <div className="mt-4 space-y-3">
        {tiers.map((tier, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <NumberField
              label={`Ab Stufe ${index + 1}`}
              unit={sizeUnit}
              value={tier.from}
              onChange={(from) =>
                onChange({
                  tiers: tiers.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, from } : item,
                  ),
                  maxModeledSize,
                })
              }
            />
            <NumberField
              label="Einheitspreis"
              unit={priceUnit}
              value={tier.unitPriceEuro}
              step={1}
              onChange={(unitPriceEuro) =>
                onChange({
                  tiers: tiers.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, unitPriceEuro } : item,
                  ),
                  maxModeledSize,
                })
              }
            />
            <button
              type="button"
              disabled={tiers.length === 1}
              onClick={() =>
                onChange({ tiers: tiers.filter((_, itemIndex) => itemIndex !== index), maxModeledSize })
              }
              className="min-h-11 self-end rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-40"
            >
              Entfernen
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <button
          type="button"
          onClick={() =>
            onChange({
              tiers: [...tiers, { from: Math.max(maxModeledSize, (tiers.at(-1)?.from ?? 0) + 1), unitPriceEuro: tiers.at(-1)?.unitPriceEuro ?? 1 }],
              maxModeledSize,
            })
          }
          className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Preisstufe ergänzen
        </button>
        <div className="w-full max-w-xs">
          <NumberField
            label="Maximal modellierte Größe"
            unit={sizeUnit}
            value={maxModeledSize}
            onChange={(value) => onChange({ tiers, maxModeledSize: value })}
          />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

export function ConfiguratorSettingsForm({ initialSettings }: { initialSettings: ConfiguratorSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  type EditableSection = Exclude<keyof ConfiguratorSettings, "schemaVersion" | "version">;
  const update = <K extends EditableSection>(
    section: K,
    values: Partial<ConfiguratorSettings[K]>,
  ) => setSettings((current) => ({
    ...current,
    [section]: Object.assign({}, current[section], values),
  }));

  return (
    <form action={saveConfiguratorSettingsAction} className="space-y-6">
      <input type="hidden" name="settings" value={JSON.stringify(settings)} />
      <Section title="Allgemein & Wirtschaftlichkeit">
        <NumberField label="Kostenunsicherheit" unit="%" value={settings.general.costUncertaintyPercent} onChange={(value) => update("general", { costUncertaintyPercent: value })} />
        <NumberField label="Netzstrompreis" unit="€/kWh" value={settings.economics.gridElectricityPriceEuroPerKwh} onChange={(value) => update("economics", { gridElectricityPriceEuroPerKwh: value })} />
        <NumberField label="Einspeisewert" unit="€/kWh" value={settings.economics.feedInValueEuroPerKwh} onChange={(value) => update("economics", { feedInValueEuroPerKwh: value })} />
        <NumberField label="Strompreisentwicklung" unit="%/Jahr" value={settings.economics.electricityPriceDevelopmentPercent} onChange={(value) => update("economics", { electricityPriceDevelopmentPercent: value })} />
        <NumberField label="Projektbetrachtung" unit="Jahre" step={1} value={settings.economics.projectHorizonYears} onChange={(value) => update("economics", { projectHorizonYears: value })} />
      </Section>

      <Section title="Photovoltaik">
        <div className="md:col-span-2 xl:col-span-3">
          <TierEditor label="PV-Preisstufen" sizeUnit="kWp" priceUnit="€/kWp" tiers={settings.photovoltaic.pricing.tiers} maxModeledSize={settings.photovoltaic.pricing.maxModeledSize} onChange={(pricing) => update("photovoltaic", { pricing })} />
        </div>
        <NumberField label="Zusätzliche Projektkosten" unit="€" step={1} value={settings.photovoltaic.fixedAdditionalCostEuro} onChange={(value) => update("photovoltaic", { fixedAdditionalCostEuro: value })} />
        <NumberField label="PV-Degradation" unit="%/Jahr" value={settings.photovoltaic.annualDegradationPercent} onChange={(value) => update("photovoltaic", { annualDegradationPercent: value })} />
        <NumberField label="Eigenverbrauch ohne Speicher" unit="%" value={settings.photovoltaic.defaultSelfConsumptionPercent} onChange={(value) => update("photovoltaic", { defaultSelfConsumptionPercent: value })} />
        <details className="md:col-span-2 xl:col-span-3 rounded-xl border border-slate-200 p-4">
          <summary className="cursor-pointer font-semibold text-slate-900">Erweiterte Modellannahmen</summary>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <NumberField label="Jährliche Betriebskosten" unit="€/Jahr" value={settings.photovoltaic.annualOperatingCostEuro} onChange={(value) => update("photovoltaic", { annualOperatingCostEuro: value })} />
            <NumberField label="Basis-Ertrag für PV-Auslegung" unit="kWh/kWp" value={settings.photovoltaic.baseSpecificYieldKwhPerKwp} onChange={(value) => update("photovoltaic", { baseSpecificYieldKwhPerKwp: value })} />
            <NumberField label="Ertrag ohne PV-Detaildaten" unit="kWh/kWp" value={settings.photovoltaic.specificYieldKwhPerKwpFallback} onChange={(value) => update("photovoltaic", { specificYieldKwhPerKwpFallback: value })} />
            <NumberField label="Zieldeckung" unit="%" value={settings.photovoltaic.targetGenerationCoveragePercent} onChange={(value) => update("photovoltaic", { targetGenerationCoveragePercent: value })} />
            <NumberField label="Ertragsunsicherheit" unit="%" value={settings.photovoltaic.yieldUncertaintyPercent} onChange={(value) => update("photovoltaic", { yieldUncertaintyPercent: value })} />
          </div>
        </details>
      </Section>

      <Section title="Batteriespeicher">
        <div className="md:col-span-2 xl:col-span-3"><TierEditor label="Speicher-Preisstufen" sizeUnit="kWh" priceUnit="€/kWh" tiers={settings.batteryStorage.pricing.tiers} maxModeledSize={settings.batteryStorage.pricing.maxModeledSize} onChange={(pricing) => update("batteryStorage", { pricing })} /></div>
        <NumberField label="Round-Trip-Wirkungsgrad" unit="%" value={settings.batteryStorage.roundTripEfficiencyPercent} onChange={(value) => update("batteryStorage", { roundTripEfficiencyPercent: value })} />
        <NumberField label="Vollzyklen" unit="pro Jahr" value={settings.batteryStorage.equivalentFullCyclesPerYear} onChange={(value) => update("batteryStorage", { equivalentFullCyclesPerYear: value })} />
        <NumberField label="Wirtschaftliche Lebensdauer" unit="Jahre" step={1} value={settings.batteryStorage.economicLifetimeYears} onChange={(value) => update("batteryStorage", { economicLifetimeYears: value })} />
      </Section>

      <Section title="Wärmepumpe">
        <NumberField label="Wärmepumpenstrom" unit="€/kWh" value={settings.heatPump.electricityPriceEuroPerKwh} onChange={(value) => update("heatPump", { electricityPriceEuroPerKwh: value })} />
        <NumberField label="Gaspreis" unit="€/kWh" value={settings.heatPump.gasPriceEuroPerKwh} onChange={(value) => update("heatPump", { gasPriceEuroPerKwh: value })} />
        <NumberField label="Gasheizung Wirkungsgrad" unit="%" value={settings.heatPump.gasHeatingEfficiencyPercent} onChange={(value) => update("heatPump", { gasHeatingEfficiencyPercent: value })} />
        <NumberField label="Heizölpreis" unit="€/Liter" value={settings.heatPump.oilPriceEuroPerLitre} onChange={(value) => update("heatPump", { oilPriceEuroPerLitre: value })} />
        <NumberField label="Heizöl Energieinhalt" unit="kWh/Liter" value={settings.heatPump.oilEnergyContentKwhPerLitre} onChange={(value) => update("heatPump", { oilEnergyContentKwhPerLitre: value })} />
        <NumberField label="Ölheizung Wirkungsgrad" unit="%" value={settings.heatPump.oilHeatingEfficiencyPercent} onChange={(value) => update("heatPump", { oilHeatingEfficiencyPercent: value })} />
        <details className="md:col-span-2 xl:col-span-3 rounded-xl border border-slate-200 p-4"><summary className="cursor-pointer font-semibold">Erweiterte Modellannahmen</summary><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <NumberField label="Warmwasserbedarf" unit="kWh/Person" value={settings.heatPump.hotWaterDemandKwhPerPersonYear} onChange={(value) => update("heatPump", { hotWaterDemandKwhPerPersonYear: value })} />
          <NumberField label="Volllaststunden" unit="h/Jahr" value={settings.heatPump.equivalentFullLoadHours} onChange={(value) => update("heatPump", { equivalentFullLoadHours: value })} />
          <NumberField label="Leistungsreserve" unit="%" value={settings.heatPump.capacityReservePercent} onChange={(value) => update("heatPump", { capacityReservePercent: value })} />
          <NumberField label="Standard-JAZ" unit="JAZ" value={settings.heatPump.defaultAnnualPerformanceFactor} onChange={(value) => update("heatPump", { defaultAnnualPerformanceFactor: value })} />
          <NumberField label="Gerätekosten" unit="€/kW" value={settings.heatPump.heatPumpCostEuroPerKw} onChange={(value) => update("heatPump", { heatPumpCostEuroPerKw: value })} />
          <NumberField label="Installationsbasis" unit="€" value={settings.heatPump.installationBaseCostEuro} onChange={(value) => update("heatPump", { installationBaseCostEuro: value })} />
          <NumberField label="Zusatzkosten" unit="€" value={settings.heatPump.fixedAdditionalCostEuro} onChange={(value) => update("heatPump", { fixedAdditionalCostEuro: value })} />
        </div></details>
      </Section>

      <Section title="Klimaanlage">
        <NumberField label="Strompreis" unit="€/kWh" value={settings.climate.electricityPriceEuroPerKwh} onChange={(value) => update("climate", { electricityPriceEuroPerKwh: value })} />
        <NumberField label="Volllaststunden" unit="h/Jahr" value={settings.climate.annualEquivalentFullLoadHours} onChange={(value) => update("climate", { annualEquivalentFullLoadHours: value })} />
        <NumberField label="Saisonaler Wirkungsgrad" unit="SEER" value={settings.climate.seasonalEfficiencySeer} onChange={(value) => update("climate", { seasonalEfficiencySeer: value })} />
        <NumberField label="Gerätekosten" unit="€/kW" value={settings.climate.equipmentCostEuroPerKw} onChange={(value) => update("climate", { equipmentCostEuroPerKw: value })} />
        <NumberField label="Innengerät" unit="€/Gerät" value={settings.climate.indoorUnitCostEuro} onChange={(value) => update("climate", { indoorUnitCostEuro: value })} />
        <NumberField label="Installationsbasis" unit="€" value={settings.climate.installationBaseCostEuro} onChange={(value) => update("climate", { installationBaseCostEuro: value })} />
        <NumberField label="Installation je Innengerät" unit="€/Gerät" value={settings.climate.installationCostPerIndoorUnitEuro} onChange={(value) => update("climate", { installationCostPerIndoorUnitEuro: value })} />
        <NumberField label="Zusatzkosten" unit="€" value={settings.climate.fixedAdditionalCostEuro} onChange={(value) => update("climate", { fixedAdditionalCostEuro: value })} />
      </Section>

      <Section title="Wallbox">
        <NumberField label="Netzstrompreis" unit="€/kWh" value={settings.wallbox.electricityPriceEuroPerKwh} onChange={(value) => update("wallbox", { electricityPriceEuroPerKwh: value })} />
        <NumberField label="Öffentliches Laden" unit="€/kWh" value={settings.wallbox.publicChargingPriceEuroPerKwh} onChange={(value) => update("wallbox", { publicChargingPriceEuroPerKwh: value })} />
        <NumberField label="PV-Stromwert" unit="€/kWh" value={settings.wallbox.pvElectricityValueEuroPerKwh} onChange={(value) => update("wallbox", { pvElectricityValueEuroPerKwh: value })} />
        <NumberField label="Ladewirkungsgrad" unit="%" value={settings.wallbox.defaultChargingEfficiencyPercent} onChange={(value) => update("wallbox", { defaultChargingEfficiencyPercent: value })} />
        <NumberField label="Wallbox" unit="€" value={settings.wallbox.wallboxCostEuro} onChange={(value) => update("wallbox", { wallboxCostEuro: value })} />
        <NumberField label="Installationsbasis" unit="€" value={settings.wallbox.installationBaseCostEuro} onChange={(value) => update("wallbox", { installationBaseCostEuro: value })} />
        <NumberField label="Zusatzkosten" unit="€" value={settings.wallbox.fixedAdditionalCostEuro} onChange={(value) => update("wallbox", { fixedAdditionalCostEuro: value })} />
      </Section>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-lg sm:sticky sm:bottom-4">
        <p className="text-sm leading-6 text-amber-950">Änderungen gelten für neu gestartete Konfigurationen. Bereits gestartete Projekte verwenden weiterhin ihre gespeicherte Modellversion.</p>
        <div className="mt-4 flex items-center justify-between gap-4"><span className="text-sm text-amber-900">Aktuelle Modellversion: {settings.version}</span><button type="submit" className="min-h-11 rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white hover:bg-emerald-800">Neue Version speichern</button></div>
      </div>
    </form>
  );
}
