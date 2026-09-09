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
    group: "leadership",
    publiclyNamed: true,
    sortOrder: 10,
  },
  {
    id: "markus-oesterlein",
    name: "Markus Österlein",
    role: "Geschäftsführer",
    group: "leadership",
    publiclyNamed: true,
    sortOrder: 20,
  },
  {
    id: "stefan-pfnuer",
    name: "Stefan Pfnür",
    role: "Betriebsleitung",
    group: "leadership",
    publiclyNamed: true,
    sortOrder: 30,
  },
  {
    id: "michael-donnert",
    name: "Michael Donnert",
    role: "Vertriebsleitung",
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
    group: "service",
    publiclyNamed: false,
    sortOrder: 60,
  },
  {
    id: "dachmontage",
    role: "Leitung Dachmontage",
    group: "service",
    publiclyNamed: false,
    sortOrder: 70,
  },
  {
    id: "service",
    role: "Leitung Service-Abteilung",
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
    group: "service",
    publiclyNamed: false,
    sortOrder: 100,
  },
  {
    id: "verwaltung-2",
    role: "Verwaltung",
    group: "service",
    publiclyNamed: false,
    sortOrder: 110,
  },
] as const;

export const leadershipTeam = teamMembers.filter((member) => member.group === "leadership");
export const serviceTeamRoles = teamMembers.filter((member) => member.group === "service");
