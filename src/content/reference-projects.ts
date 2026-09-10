export type ReferenceCustomerType = "Privat" | "Gewerbe";
export type ReferenceDataStatus = "placeholder" | "verified";

export interface ReferenceProject {
  id: string;
  location: string;
  locationSlug: string;
  district?: string;
  category: string;
  customerType: ReferenceCustomerType;
  image: string;
  imageAlt: string;
  capacityKwp: number;
  hasBatteryStorage: boolean;
  dataStatus: ReferenceDataStatus;
  projectName?: string;
  publicCustomerName?: string;
  source: "Legacy-Referenzarchiv";
  featured: boolean;
  sortOrder: number;
}

export interface ReferenceLocation {
  name: string;
  slug: string;
  district: string;
  intro: string;
  context: string;
}

export const referenceLocations: readonly ReferenceLocation[] = [
  {
    name: "Ainring",
    slug: "ainring",
    district: "Berchtesgadener Land",
    intro:
      "In Ainring zeigen private und gewerbliche Dachflächen, wie unterschiedlich Photovoltaik vor Ort geplant werden kann.",
    context:
      "Als Unternehmensstandort ist Ainring für Energie-Kraft Süd Ausgangspunkt für Beratung, Planung, Montage und Service in der Region.",
  },
  {
    name: "Bad Reichenhall",
    slug: "bad-reichenhall",
    district: "Berchtesgadener Land",
    intro:
      "Unsere Referenzen in Bad Reichenhall dokumentieren verschiedene Photovoltaiklösungen auf bestehenden Wohngebäuden.",
    context:
      "Unterschiedliche Dachformen und das alpine Umfeld verlangen eine Planung, die Gebäude, Verbrauch und technische Komponenten gemeinsam betrachtet.",
  },
  {
    name: "Berchtesgaden",
    slug: "berchtesgaden",
    district: "Berchtesgadener Land",
    intro:
      "Mehrere Wohnhausprojekte geben einen konkreten Einblick in Photovoltaiklösungen in Berchtesgaden.",
    context:
      "Die gezeigten Anlagen stehen für individuelle Planung im regionalen Gebäudebestand – ohne pauschale Lösung für jedes Dach.",
  },
  {
    name: "Freilassing",
    slug: "freilassing",
    district: "Berchtesgadener Land",
    intro:
      "In Freilassing umfasst unser dokumentierter Bestand sowohl private Anlagen als auch Photovoltaik auf Gewerbedächern.",
    context:
      "Die Bandbreite der realisierten Dachflächen macht sichtbar, wie Lösungen für Haushalte und Unternehmen jeweils anders ausgerichtet werden.",
  },
  {
    name: "Kirchanschöring",
    slug: "kirchanschoering",
    district: "Traunstein",
    intro:
      "Referenzen aus Kirchanschöring zeigen Photovoltaik auf privaten und gewerblich genutzten Gebäuden.",
    context:
      "Die Projekte ergänzen unseren regionalen Bestand im nördlichen Rupertiwinkel und bilden verschiedene Nutzungsprofile ab.",
  },
  {
    name: "Laufen",
    slug: "laufen",
    district: "Berchtesgadener Land",
    intro:
      "In Laufen sind im Referenzbestand sowohl Wohngebäude als auch eine gewerblich genutzte Dachfläche vertreten.",
    context:
      "Die Beispiele zeigen, wie Photovoltaik an Gebäudetyp und Nutzung angepasst wird, statt nur nach verfügbarer Fläche geplant zu werden.",
  },
  {
    name: "Saaldorf-Surheim",
    slug: "saaldorf-surheim",
    district: "Berchtesgadener Land",
    intro:
      "Die Referenzen aus Saaldorf-Surheim verbinden private Dachanlagen mit größeren gewerblichen Anwendungen.",
    context:
      "Mehrere reale Projekte aus beiden Ortsteilen schaffen eine belastbare Grundlage für den lokalen Einblick.",
  },
] as const;

interface ReferenceFile {
  customerType: ReferenceCustomerType;
  file: string;
  capacityKwp: number;
  hasBatteryStorage: boolean;
  dataStatus: ReferenceDataStatus;
  featured?: boolean;
}

function numberedFiles(
  locationSlug: string,
  customerType: ReferenceCustomerType,
  capacitiesKwp: readonly number[],
  batteryStorage: readonly boolean[],
  featured = false,
): ReferenceFile[] {
  return capacitiesKwp.map((capacityKwp, index) => ({
    customerType,
    file: `${locationSlug}-${customerType.toLowerCase()}-${String(index + 1).padStart(2, "0")}.webp`,
    capacityKwp,
    hasBatteryStorage: batteryStorage[index] ?? false,
    // MUST_VERIFY_BEFORE_GO_LIVE: Leistung und Speicherstatus fachlich bestätigen.
    dataStatus: "placeholder",
    featured: featured && index === 0,
  }));
}

const referenceFiles: Record<string, readonly ReferenceFile[]> = {
  ainring: [
    ...numberedFiles("ainring", "Gewerbe", [424.5], [false], true),
    ...numberedFiles("ainring", "Privat", [19.24, 7, 9.72], [true, false, true]),
  ],
  "bad-reichenhall": numberedFiles(
    "bad-reichenhall",
    "Privat",
    [24.36, 8.28, 12.75, 13.485],
    [true, false, true, true],
    true,
  ),
  berchtesgaden: numberedFiles(
    "berchtesgaden",
    "Privat",
    [18.75, 19.74, 43, 7],
    [true, true, false, true],
    true,
  ),
  freilassing: [
    ...numberedFiles("freilassing", "Gewerbe", [24.3, 99.75, 29.64], [false, true, false], true),
    ...numberedFiles("freilassing", "Privat", [10, 11, 15.3, 18, 6, 7.56], [true, true, true, false, false, true]),
  ],
  kirchanschoering: [
    ...numberedFiles("kirchanschoering", "Gewerbe", [54.375, 60.03], [false, true], true),
    ...numberedFiles("kirchanschoering", "Privat", [10], [true]),
  ],
  laufen: [
    ...numberedFiles("laufen", "Gewerbe", [21.44], [false], true),
    ...numberedFiles("laufen", "Privat", [10, 21], [true, true]),
  ],
  "saaldorf-surheim": [
    ...numberedFiles("saaldorf-surheim", "Gewerbe", [300.15, 99.66], [true, false], true),
    ...numberedFiles("saaldorf-surheim", "Privat", [10.2, 10, 9.24], [true, true, false]),
  ],
};

export const referenceProjects: readonly ReferenceProject[] = referenceLocations.flatMap(
  (location, locationIndex) =>
    (referenceFiles[location.slug] ?? []).map((entry, projectIndex) => ({
      id: entry.file.replace(/\.webp$/, ""),
      location: location.name,
      locationSlug: location.slug,
      district: location.district,
      category:
        entry.customerType === "Gewerbe"
          ? "Photovoltaik auf einem Gewerbedach"
          : "Photovoltaik am Wohngebäude",
      customerType: entry.customerType,
      image: `/images/references/projects/${entry.file}`,
      imageAlt: `Photovoltaikanlage auf einem ${
        entry.customerType === "Gewerbe" ? "Gewerbegebäude" : "Wohngebäude"
      } in ${location.name}, Ansicht ${projectIndex + 1}`,
      capacityKwp: entry.capacityKwp,
      hasBatteryStorage: entry.hasBatteryStorage,
      dataStatus: entry.dataStatus,
      source: "Legacy-Referenzarchiv" as const,
      featured: entry.featured ?? false,
      sortOrder: locationIndex * 100 + projectIndex,
    })),
);

export const regionalReferenceProjects = referenceProjects.filter((project) => project.featured);

const capacityFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
});

export function getReferenceTechnicalLabel(project: ReferenceProject) {
  return `${capacityFormatter.format(project.capacityKwp)} kWp · ${
    project.hasBatteryStorage ? "mit Stromspeicher" : "ohne Stromspeicher"
  }`;
}

export function getReferenceProjectsByLocation(locationSlug: string) {
  return referenceProjects.filter((project) => project.locationSlug === locationSlug);
}

export function getReferenceLocation(locationSlug: string) {
  return referenceLocations.find((location) => location.slug === locationSlug);
}
