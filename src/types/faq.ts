export type FaqRouteKey =
  | "home"
  | "photovoltaik"
  | "stromspeicher"
  | "wallbox"
  | "klimaanlagen"
  | "waermepumpen"
  | "kontakt";

export interface FaqPlacement {
  routeKey: FaqRouteKey;
  sortOrder: number;
  showInSchema: boolean;
}

export interface FaqCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  placements: FaqPlacement[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}