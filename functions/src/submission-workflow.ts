export interface MailAttemptResult {
  status: "accepted" | "failed";
  messageId: string | null;
}

export async function attemptMailDelivery(
  deliver: () => Promise<{ id: string }>,
  onError: (error: unknown) => void,
): Promise<MailAttemptResult> {
  try {
    const result = await deliver();
    return { status: "accepted", messageId: result.id || null };
  } catch (error) {
    onError(error);
    return { status: "failed", messageId: null };
  }
}

export function isAlreadyExistsError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  const code = (error as { code?: unknown }).code;
  return code === 6 || code === "6" || code === "already-exists";
}
