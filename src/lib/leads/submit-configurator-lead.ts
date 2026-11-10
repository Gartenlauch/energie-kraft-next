import "client-only";

import { httpsCallable } from "firebase/functions";

import { firebaseFunctions } from "@/lib/firebase/client";
import { trackGoogleAdsLead } from "@/lib/consent/google-ads";
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

  trackGoogleAdsLead(
    { ok: result.data.ok, leadId: result.data.leadId },
    input.configurators.some(({ type }) => type === "heat_pump") ? "heatPump" : "contact",
  );

  return result.data;
}
