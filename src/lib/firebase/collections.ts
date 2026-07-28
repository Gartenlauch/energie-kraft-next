

export const FIRESTORE_COLLECTIONS = {
  faqCategories: "faqCategories",
  faqs: "faqs",
  leads: "leads",
  jobApplications: "jobApplications",
} as const;

export type FirestoreCollectionName =
  (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS];