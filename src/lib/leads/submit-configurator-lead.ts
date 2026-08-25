import "client-only";

import { httpsCallable } from "firebase/functions";

import { firebaseFunctions } from "@/lib/firebase/client";
import type {
  SubmitConfiguratorLeadInput,
  SubmitConfiguratorLeadResult,
} from "@/types/configurator";

const submitConfiguratorLeadCallable =
  httpsCallable<
    SubmitConfiguratorLeadInput,
    SubmitConfiguratorLeadResult
  >(
    firebaseFunctions,
    "submitConfiguratorLead",
  );

export async function submitConfiguratorLead(
  input: SubmitConfiguratorLeadInput,
): Promise<SubmitConfiguratorLeadResult> {
  const result =
    await submitConfiguratorLeadCallable(
      input,
    );

  return result.data;
}