import type { FaqRouteKey } from "@/config/routes";
import type { FirestoreAuditFields } from "@/types/firestore";

export type { FaqRouteKey } from "@/config/routes";
export type {
  FirestoreAuditFields,
  FirestoreTimestamp,
} from "@/types/firestore";

export interface FaqPlacement {
  routeKey: FaqRouteKey;
  sortOrder: number;
  showInSchema: boolean;
}

/**
 * Persistierte Felder eines Dokuments unter:
 * faqCategories/{categoryId}
 *
 * Die Dokument-ID wird nicht zusätzlich im Dokument gespeichert.
 */
export interface FaqCategoryDocument
  extends FirestoreAuditFields {
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

/**
 * Anwendungsobjekt nach dem Lesen aus Firestore.
 */
export interface FaqCategory
  extends FaqCategoryDocument {
  id: string;
}

/**
 * Persistierte Felder eines Dokuments unter:
 * faqs/{faqId}
 *
 * Die Dokument-ID wird nicht zusätzlich im Dokument gespeichert.
 */
export interface FaqEntryDocument
  extends FirestoreAuditFields {
  question: string;
  answer: string;
  categoryId: string;
  placements: FaqPlacement[];
  isPublished: boolean;
}

/**
 * Anwendungsobjekt nach dem Lesen aus Firestore.
 */
export interface FaqEntry extends FaqEntryDocument {
  id: string;
}

/**
 * Fachliche Eingabedaten zum Erstellen einer FAQ-Kategorie.
 *
 * Dokument-ID, Zeitstempel und Audit-Felder werden serverseitig ergänzt.
 */
export type FaqCategoryCreateInput = Pick<
  FaqCategoryDocument,
  "name" | "slug" | "sortOrder" | "isActive"
>;

/**
 * Fachliche Eingabedaten zum Aktualisieren einer FAQ-Kategorie.
 *
 * Die Runtime-Validierung verhindert später ein leeres Update.
 */
export type FaqCategoryUpdateInput =
  Partial<FaqCategoryCreateInput>;

/**
 * Fachliche Eingabedaten zum Erstellen eines FAQ-Eintrags.
 *
 * Dokument-ID, Zeitstempel und Audit-Felder werden serverseitig ergänzt.
 */
export type FaqEntryCreateInput = Pick<
  FaqEntryDocument,
  | "question"
  | "answer"
  | "categoryId"
  | "placements"
  | "isPublished"
>;

/**
 * Fachliche Eingabedaten zum Aktualisieren eines FAQ-Eintrags.
 *
 * Die Runtime-Validierung verhindert später ein leeres Update.
 */
export type FaqEntryUpdateInput =
  Partial<FaqEntryCreateInput>;

  /**
 * Im Admin änderbare Felder einer bestehenden FAQ-Kategorie.
 *
 * Der Slug und damit die Dokument-ID bleiben unveränderlich.
 */
export type FaqCategoryAdminUpdateInput = Pick<
  FaqCategoryCreateInput,
  "name" | "sortOrder" | "isActive"
>;