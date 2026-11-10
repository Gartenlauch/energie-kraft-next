import "client-only";

import { httpsCallable } from "firebase/functions";

import { firebaseFunctions } from "@/lib/firebase/client";
import { trackGoogleAdsLead } from "@/lib/consent/google-ads";
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

  trackGoogleAdsLead({ ok: result.data.ok, leadId: result.data.leadId }, "contact");

  return result.data;
}
