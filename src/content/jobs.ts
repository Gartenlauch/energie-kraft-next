export interface JobOpening {
  id: string;
  slug: string;
  title: string;
  intro: string;
  tasks: readonly string[];
  requirements: readonly string[];
  benefits: readonly string[];
  location: string;
  employmentType?: "Vollzeit" | "Ausbildung";
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
    title: "Elektriker:in (w/m/d)",
    intro:
      "Für unseren Standort in Ainring suchen wir zum nächstmöglichen Zeitpunkt Verstärkung in der Elektrotechnik.",
    tasks: [
      "Wechselrichter, Batteriespeichersysteme und Wallboxen installieren",
      "Batteriespeichersysteme und Photovoltaikanlagen inspizieren und warten",
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
    intro:
      "Für unseren Standort in Ainring suchen wir zum nächstmöglichen Zeitpunkt Unterstützung für die Montage auf regionalen Projekten.",
    tasks: ["Photovoltaikanlagen in der Region installieren"],
    requirements: [
      "Technisches Verständnis",
      "Einsatzbereitschaft und Teamfähigkeit",
      "Eine Ausbildung als Dachdecker:in oder Spengler:in ist von Vorteil",
      "PKW-Führerschein (Klasse B)",
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
    id: "servicetechniker",
    slug: "servicetechniker",
    title: "Servicetechniker:in – Photovoltaik und Speichersysteme (m/w/d)",
    intro:
      "Für unseren Standort in Ainring suchen wir eine engagierte Fachkraft für den Service und die technische Betreuung von Photovoltaikanlagen, Batteriespeichern und Ladeinfrastruktur. Dein Schwerpunkt liegt auf Kundendienst, Störungsbehebung, Inbetriebnahme und Nachrüstung. Dachmontage und Dacharbeiten gehören nicht zu deinen Aufgaben.",
    tasks: [
      "Störmeldungen und Serviceanfragen bearbeiten",
      "Kundendienst, Fehlerdiagnose, Reparaturen und Nachrüstungen durchführen",
      "Photovoltaikanlagen, Speichersysteme und Ladestationen in Betrieb nehmen und Kund:innen einweisen",
    ],
    requirements: [
      "Abgeschlossene Berufsausbildung als Elektriker:in oder im elektrotechnischen Bereich",
      "Führerschein Klasse B",
      "Berufserfahrung",
      "Zuverlässige, selbstständige und lösungsorientierte Arbeitsweise",
      "Freude am kundenorientierten Arbeiten und ausgeprägtes Qualitätsbewusstsein",
    ],
    // Vergütung, Jobrad und gemeinsame Teamevents stehen bereits im allgemeinen Benefits-Bereich.
    benefits: [
      "Ein Umfeld, das Leistung wertschätzt und dir Vertrauen und Freiraum für eigenverantwortliches Arbeiten und die Übernahme von Verantwortung bietet",
      "Flexible Arbeitszeiten, damit Beruf und Privatleben gut zusammenpassen",
      "Ein moderner Firmenwagen und hochwertige IT-Ausstattung mit Smartphone und Tablet",
      "Wellpass und eine moderne Arbeitsumgebung mit Begegnungszonen, Rückzugsorten und zeitgemäßen Arbeitsmitteln",
      "Fachliche und persönliche Weiterbildung mit Raum, deinen eigenen Entwicklungsweg mitzugestalten",
    ],
    location: "Ainring",
    active: true,
    sortOrder: 25,
  },
  {
    id: "ausbildung-elektroniker-gebaeudetechnik",
    slug: "ausbildung-elektroniker-gebaeudetechnik",
    title: "Ausbildung Elektroniker:in Gebäudetechnik (w/m/d)",
    intro:
      "Energie-Kraft Süd begleitet dich bei den ersten Schritten in deine berufliche Zukunft und möchte Talente für erneuerbare Energie nachhaltig fördern.",
    tasks: ["Im Team an nachhaltigen, intelligenten und erneuerbaren Energielösungen mitarbeiten"],
    requirements: ["Schulabschluss", "Interesse an Zukunftsthemen und erneuerbarer Energie"],
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
export const sharedJobBenefits = [
  "Attraktives Gehalt und langfristige Perspektive",
  "Jobrad für Mitarbeitende; Firmenfahrzeug je nach Rolle und Vereinbarung",
  "Hochwertige Arbeitskleidung, Arbeitsgeräte und Getränke",
  "Arbeitgeberzuschüsse und vermögenswirksame Leistungen",
  "Zwei gemeinsame Firmenfeiern im Jahr",
] as const;
