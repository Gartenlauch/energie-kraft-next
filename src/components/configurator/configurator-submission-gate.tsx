"use client";

import type { ReactNode } from "react";

import { ConfiguratorShell } from "@/components/configurator/configurator-shell";
import { ConfiguratorSubmitSuccess } from "@/components/configurator/configurator-submit-success";
import { useConfigurator } from "@/lib/configurator/configurator-context";

export function ConfiguratorSubmissionGate({ children }: { children: ReactNode }) {
  const { state, isHydrated } = useConfigurator();
  const submission = state.submission;

  if (isHydrated && submission.status === "submitted" && submission.publicReference) {
    return (
      <ConfiguratorShell>
        <ConfiguratorSubmitSuccess
          publicReference={submission.publicReference}
          reportStatus={submission.reportStatus}
          customerMailStatus={submission.customerMailStatus}
        />
      </ConfiguratorShell>
    );
  }

  return children;
}
