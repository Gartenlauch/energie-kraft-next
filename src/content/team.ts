export type TeamGroup = "leadership" | "service";

export interface TeamMember {
  id: string;
  role: string;
  name?: string;
  area?: string;
  image?: string;
  imageAlt?: string;
  group: TeamGroup;
  publiclyNamed: boolean;
  sortOrder: number;
}

export const teamMembers: readonly TeamMember[] = [
  {
    id: "kai-stengle",
    name: "Kai Stengle",
    role: "Geschäftsführer",
    image: "/images/team/kai-stengle.webp",
    imageAlt: "Kai Stengle, Geschäftsführer bei Energie-Kraft Süd",
    group: "leadership",
    publiclyNamed: true,
    sortOrder: 10,
  },
  {
    id: "markus-oesterlein",
    name: "Markus Österlein",
    role: "Geschäftsführer",
    image: "/images/team/markus-oesterlein.webp",
    imageAlt: "Markus Österlein, Geschäftsführer bei Energie-Kraft Süd",
    group: "leadership",
    publiclyNamed: true,
    sortOrder: 20,
  },
  {
    id: "stefan-pfnuer",
    name: "Stefan Pfnür",
    role: "Betriebsleitung",
    image: "/images/team/stefan-pfnuer.webp",
    imageAlt: "Stefan Pfnür, Betriebsleitung bei Energie-Kraft Süd",
    group: "leadership",
    publiclyNamed: true,
    sortOrder: 30,
  },
  {
    id: "michael-donnert",
    name: "Michael Donnert",
    role: "Vertriebsleitung",
    image: "/images/team/michael-donnert.webp",
    imageAlt: "Michael Donnert, Vertriebsleitung bei Energie-Kraft Süd",
    group: "leadership",
    publiclyNamed: true,
    sortOrder: 40,
  },
  {
    id: "vertrieb-bgl",
    role: "Vertrieb",
    area: "Berchtesgadener Land",
    group: "service",
    publiclyNamed: false,
    sortOrder: 50,
  },
  {
    id: "vertrieb-region",
    role: "Vertrieb",
    area: "Berchtesgadener Land, Traunstein und Waging",
    image: "/images/team/vertrieb-region.webp",
    imageAlt: "Ansprechpartner aus dem Vertrieb für Berchtesgadener Land, Traunstein und Waging",
    group: "service",
    publiclyNamed: false,
    sortOrder: 60,
  },
  {
    id: "dachmontage",
    role: "Leitung Dachmontage",
    image: "/images/team/dachmontage.webp",
    imageAlt: "Ansprechpartner aus der Leitung Dachmontage",
    group: "service",
    publiclyNamed: false,
    sortOrder: 70,
  },
  {
    id: "service",
    role: "Leitung Service-Abteilung",
    image: "/images/team/service.webp",
    imageAlt: "Ansprechpartner aus der Leitung der Service-Abteilung",
    group: "service",
    publiclyNamed: false,
    sortOrder: 80,
  },
  {
    id: "verwaltung-leitung",
    role: "Leitung Verwaltung",
    group: "service",
    publiclyNamed: false,
    sortOrder: 90,
  },
  {
    id: "verwaltung-1",
    role: "Verwaltung",
    image: "/images/team/verwaltung-1.webp",
    imageAlt: "Ansprechpartnerin aus der Verwaltung",
    group: "service",
    publiclyNamed: false,
    sortOrder: 100,
  },
  {
    id: "verwaltung-2",
    role: "Verwaltung",
    image: "/images/team/verwaltung-2.webp",
    imageAlt: "Ansprechpartnerin aus der Verwaltung",
    group: "service",
    publiclyNamed: false,
    sortOrder: 110,
  },
] as const;

export const leadershipTeam = teamMembers.filter((member) => member.group === "leadership");
export const serviceTeamRoles = teamMembers.filter((member) => member.group === "service");
