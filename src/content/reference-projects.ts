export type ReferenceCustomerType = "Privat" | "Gewerbe";

export interface ReferenceProject {
  id: string;
  location: string;
  locationSlug: string;
  district?: string;
  category: string;
  customerType: ReferenceCustomerType;
  image: string;
  imageAlt: string;
  capacityKwp?: number;
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
  featured?: boolean;
}

function numberedFiles(
  locationSlug: string,
  customerType: ReferenceCustomerType,
  count: number,
  featured = false,
): ReferenceFile[] {
  return Array.from({ length: count }, (_, index) => ({
    customerType,
    file: `${locationSlug}-${customerType.toLowerCase()}-${String(index + 1).padStart(2, "0")}.webp`,
    featured: featured && index === 0,
  }));
}

const referenceFiles: Record<string, readonly ReferenceFile[]> = {
  ainring: [
    ...numberedFiles("ainring", "Gewerbe", 1, true),
    ...numberedFiles("ainring", "Privat", 3),
  ],
  "bad-reichenhall": numberedFiles("bad-reichenhall", "Privat", 4, true),
  berchtesgaden: numberedFiles("berchtesgaden", "Privat", 4, true),
  freilassing: [
    ...numberedFiles("freilassing", "Gewerbe", 3, true),
    ...numberedFiles("freilassing", "Privat", 6),
  ],
  kirchanschoering: [
    ...numberedFiles("kirchanschoering", "Gewerbe", 2, true),
    ...numberedFiles("kirchanschoering", "Privat", 1),
  ],
  laufen: [...numberedFiles("laufen", "Gewerbe", 1, true), ...numberedFiles("laufen", "Privat", 2)],
  "saaldorf-surheim": [
    ...numberedFiles("saaldorf-surheim", "Gewerbe", 2, true),
    ...numberedFiles("saaldorf-surheim", "Privat", 3),
  ],
};

export const referenceProjects: readonly ReferenceProject[] = referenceLocations.flatMap(
  (location, locationIndex) =>
    (referenceFiles[location.slug] ?? []).map((entry, projectIndex) => ({
      id: `${location.slug}-${entry.customerType.toLowerCase()}-${projectIndex + 1}`,
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
      source: "Legacy-Referenzarchiv" as const,
      featured: entry.featured ?? false,
      sortOrder: locationIndex * 100 + projectIndex,
    })),
);

export const regionalReferenceProjects = referenceProjects.filter((project) => project.featured);

export function getReferenceProjectsByLocation(locationSlug: string) {
  return referenceProjects.filter((project) => project.locationSlug === locationSlug);
}

export function getReferenceLocation(locationSlug: string) {
  return referenceLocations.find((location) => location.slug === locationSlug);
}
