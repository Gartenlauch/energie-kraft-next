

export const FIRESTORE_COLLECTIONS = {
  faqCategories: "faqCategories",
  faqs: "faqs",
  leads: "leads",
  applications: "applications",
  referrals: "referrals",
  adminRealtime: "adminRealtime",
  configuratorSettings: "configuratorSettings",
  configuratorSettingsVersions: "configuratorSettingsVersions",
  systemCounters: "systemCounters",
} as const;

export type FirestoreCollectionName =
  (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS];
