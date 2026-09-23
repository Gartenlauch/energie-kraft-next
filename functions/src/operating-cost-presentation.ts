export function showPvOperatingCosts(annualOperatingCostEuro: number | null | undefined): boolean {
  return typeof annualOperatingCostEuro === "number" && annualOperatingCostEuro > 0;
}

export function pvBenefitCopy(annualOperatingCostEuro: number | null | undefined): string {
  return showPvOperatingCosts(annualOperatingCostEuro)
    ? "Ersparnis und Einspeisung abzüglich modellierter Betriebskosten."
    : "Ersparnis und Einspeisung im ersten Jahr.";
}

export function pvOperatingCostRows(value: number, assumptions = false) {
  return showPvOperatingCosts(value)
    ? [
        {
          label: assumptions ? "PV-Betriebskosten" : "Betriebskosten",
          value: assumptions ? value : -value,
        },
      ]
    : [];
}
