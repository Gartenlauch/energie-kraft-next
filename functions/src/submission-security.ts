const MINIMUM_FORM_DURATION_MS = 1_500;
const MAXIMUM_FORM_DURATION_MS = 86_400_000;

export function hasInvalidSubmissionSignals(
  input: { website?: string; formStartedAt?: number },
  now = Date.now(),
): boolean {
  if (input.website) return true;
  if (input.formStartedAt === undefined) return false;
  const duration = now - input.formStartedAt;
  return duration < MINIMUM_FORM_DURATION_MS || duration > MAXIMUM_FORM_DURATION_MS;
}
