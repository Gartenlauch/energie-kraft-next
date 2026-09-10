import "client-only";

import { httpsCallable } from "firebase/functions";

import { firebaseFunctions } from "@/lib/firebase/client";
import type { ApplicationInput, SubmitApplicationResult } from "@/types/application";

const submitApplicationCallable = httpsCallable<ApplicationInput, SubmitApplicationResult>(
  firebaseFunctions,
  "submitApplication",
);

export async function submitApplication(input: ApplicationInput) {
  const result = await submitApplicationCallable(input);
  return result.data;
}
