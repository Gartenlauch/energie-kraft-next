import "client-only";

import { httpsCallable } from "firebase/functions";

import { firebaseFunctions } from "@/lib/firebase/client";
import type {
  ContactLeadInput,
  SubmitContactLeadResult,
} from "@/types/contact-lead";

const submitContactLeadCallable = httpsCallable<
  ContactLeadInput,
  SubmitContactLeadResult
>(
  firebaseFunctions,
  "submitContactLead",
);

export async function submitContactLead(
  input: ContactLeadInput,
): Promise<SubmitContactLeadResult> {
  const result = await submitContactLeadCallable(input);

  return result.data;
}