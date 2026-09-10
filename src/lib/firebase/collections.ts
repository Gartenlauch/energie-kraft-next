

export const FIRESTORE_COLLECTIONS = {
  faqCategories: "faqCategories",
  faqs: "faqs",
  leads: "leads",
  applications: "applications",
  referrals: "referrals",
  adminRealtime: "adminRealtime",
} as const;

export type FirestoreCollectionName =
  (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS];
