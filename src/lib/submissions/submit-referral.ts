import "client-only";

import { httpsCallable } from "firebase/functions";

import { firebaseFunctions } from "@/lib/firebase/client";
import type { ReferralInput, SubmitReferralResult } from "@/types/referral";

const submitReferralCallable = httpsCallable<ReferralInput, SubmitReferralResult>(
  firebaseFunctions,
  "submitReferral",
);

export async function submitReferral(input: ReferralInput) {
  const result = await submitReferralCallable(input);
  return result.data;
}
