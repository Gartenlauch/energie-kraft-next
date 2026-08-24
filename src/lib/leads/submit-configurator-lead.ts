import "client-only";

import { httpsCallable } from "firebase/functions";

import { firebaseFunctions } from "@/lib/firebase/client";
import type {
    SubmitConfiguratorLeadResult,
    SubmitPhotovoltaicConfiguratorLeadInput,
} from "@/types/configurator";

const submitConfiguratorLeadCallable =
    httpsCallable<
        SubmitPhotovoltaicConfiguratorLeadInput,
        SubmitConfiguratorLeadResult
    >(
        firebaseFunctions,
        "submitConfiguratorLead",
    );

export async function submitConfiguratorLead(
    input: SubmitPhotovoltaicConfiguratorLeadInput,
): Promise<SubmitConfiguratorLeadResult> {
    const result =
        await submitConfiguratorLeadCallable(
            input,
        );

    return result.data;
}