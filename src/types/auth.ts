export interface AdminSession {
  role: "admin" | "staff";
  photo: string | null;
  uid: string;
  email: string | null;
  displayName: string | null;
  issuedAt: number;
  expiresAt: number;
}
