export interface AdminSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  issuedAt: number;
  expiresAt: number;
}