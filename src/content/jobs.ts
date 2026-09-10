export interface JobOpening {
  id: string;
  slug: string;
  title: string;
  intro: string;
  tasks: readonly string[];
  requirements: readonly string[];
  benefits: readonly string[];
  location: string;
  employmentType: "Vollzeit" | "Ausbildung";
  active: boolean;
  sortOrder: number;
}

/**
 * Zentrale Quelle für die auf der öffentlichen Legacy-Jobs-Seite veröffentlichten Stellen.
 * Die veralteten Zusatzoptionen des alten Bewerbungsformulars sind bewusst nicht enthalten.
 */
export const jobOpenings: readonly JobOpening[] = [
  {
    id: "elektriker",
    slug: "elektriker",
    title: "Elektriker (w/m/d)",
    intro: "Für unseren Standort in Ainring suchen wir zum nächstmöglichen Zeitpunkt Verstärkung in der Elektrotechnik.",
    tasks: [
      "Wechselrichter, Batteriespeichersysteme und Wallboxen installieren",
      "Batteriespeichersysteme und Photovoltaikanlagen inspizieren und warten",
      "Reparaturen und Störungsbehebungen durchführen",
    ],
    requirements: [
      "Abgeschlossene Ausbildung als Elektriker:in oder Elektrofachkraft",
      "Erfahrung im Bereich Photovoltaik ist von Vorteil",
      "Teamfähigkeit, Motivation und Verantwortungsbewusstsein",
      "PKW-Führerschein",
    ],
    benefits: [
      "Moderne Arbeitsumgebung mit Begegnungszonen, Rückzugsorten und zeitgemäßen Arbeitsmitteln",
      "Vertrauen und Freiraum für selbstständiges Arbeiten",
      "Unterstützung bei der fachlichen und persönlichen Weiterentwicklung",
      "Gemeinsame Teamevents",
    ],
    location: "Ainring",
    employmentType: "Vollzeit",
    active: true,
    sortOrder: 10,
  },
  {
    id: "dachmonteur",
    slug: "dachmonteur",
    title: "Dachmonteur:in (w/m/d)",
    intro: "Für unseren Standort in Ainring suchen wir zum nächstmöglichen Zeitpunkt Unterstützung für die Montage auf regionalen Projekten.",
    tasks: ["Photovoltaikanlagen in der Region installieren"],
    requirements: [
      "Technisches Verständnis",
      "Einsatzbereitschaft und Teamfähigkeit",
      "Eine Ausbildung als Dachdecker:in oder Spengler:in ist von Vorteil",
    ],
    benefits: [
      "Schulungen und Weiterbildung",
      "Individuelle Gehaltsvereinbarung im Einstellungsgespräch",
      "Qualitativ hochwertige Arbeitskleidung und Arbeitsgeräte",
      "Langfristige Festanstellung in einer zukunftssicheren Branche",
    ],
    location: "Ainring",
    employmentType: "Vollzeit",
    active: true,
    sortOrder: 20,
  },
  {
    id: "ausbildung-elektroniker-gebaeudetechnik",
    slug: "ausbildung-elektroniker-gebaeudetechnik",
    title: "Ausbildung Elektroniker:in Gebäudetechnik (w/m/d)",
    intro: "Energie-Kraft Süd begleitet dich bei den ersten Schritten in deine berufliche Zukunft und möchte Talente für erneuerbare Energie nachhaltig fördern.",
    tasks: [
      "Im Team an nachhaltigen, intelligenten und erneuerbaren Energielösungen mitarbeiten",
    ],
    requirements: [
      "Schulabschluss",
      "Interesse an Zukunftsthemen und erneuerbarer Energie",
    ],
    benefits: [
      "Persönliche und berufliche Weiterentwicklung in einem vielseitigen, erfahrenen Team",
    ],
    location: "Ainring",
    employmentType: "Ausbildung",
    active: true,
    sortOrder: 30,
  },
] as const;

export const activeJobOpenings = jobOpenings
  .filter((job) => job.active)
  .sort((first, second) => first.sortOrder - second.sortOrder);

export function getActiveJobOpening(slug: string) {
  return activeJobOpenings.find((job) => job.slug === slug);
}
