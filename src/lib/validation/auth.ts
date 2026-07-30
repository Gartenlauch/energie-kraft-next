import { z } from "zod";

export const adminSessionRequestSchema = z
  .object({
    idToken: z
      .string()
      .trim()
      .min(1, "Das Firebase-ID-Token fehlt.")
      .max(
        20_000,
        "Das Firebase-ID-Token ist ungültig.",
      ),
  })
  .strict();

export type AdminSessionRequest = z.infer<
  typeof adminSessionRequestSchema
>;