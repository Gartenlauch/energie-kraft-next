/**
 * Gemeinsame strukturelle Schnittstelle für Firestore-Timestamps.
 *
 * Sie ist sowohl mit dem Timestamp des Firebase Web SDK als auch
 * mit dem Timestamp des Firebase Admin SDK kompatibel, ohne hier
 * eines der beiden SDKs importieren zu müssen.
 */
export interface FirestoreTimestamp {
  toDate(): Date;
  toMillis(): number;
}

export interface FirestoreAuditFields {
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  createdBy: string;
  updatedBy: string;
}