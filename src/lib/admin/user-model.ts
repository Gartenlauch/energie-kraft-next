import { z } from "zod";
import type { AdminRole } from "../../../functions/src/admin-role.ts";

export const managedUserIdSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/);
export const managedUserSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    displayName: z.string().trim().min(1).max(160),
    email: z.string().trim().email().max(254),
    phone: z
      .string()
      .trim()
      .max(40)
      .regex(/^[+()\d\s./-]*$/),
    jobTitle: z.string().trim().max(120),
    role: z.enum(["admin", "staff"]),
    active: z.boolean(),
  })
  .strict();
export type ManagedUserInput = z.infer<typeof managedUserSchema>;
export interface ManagedUser extends ManagedUserInput {
  uid: string;
  photo: string | null;
  lastLogin: string | null;
  archived: boolean;
  pending: boolean;
}
export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  admin: "Administrator",
  staff: "Mitarbeiter",
};
export function userInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return (
    words.length > 1 ? `${words[0]![0]}${words.at(-1)![0]}` : (words[0]?.slice(0, 2) ?? "?")
  ).toLocaleUpperCase("de-DE");
}

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
export function validateAvatar(bytes: Uint8Array, contentType: string) {
  if (!bytes.length || bytes.length > MAX_AVATAR_BYTES)
    throw new Error("Profilbilder dürfen höchstens 2 MB groß sein.");
  const match =
    (contentType === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) ||
    (contentType === "image/png" &&
      [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) ||
    (contentType === "image/webp" &&
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP");
  if (!match) throw new Error("Bitte ein gültiges JPEG-, PNG- oder WebP-Bild auswählen.");
}
