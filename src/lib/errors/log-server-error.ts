interface ServerErrorLogContext {
  scope: string;
  operation: string;
  context?: Record<string, string>;
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    const errorWithCode = error as Error & {
      code?: unknown;
      details?: unknown;
    };

    return {
      name: error.name,
      message: error.message,
      code:
        typeof errorWithCode.code === "string" || typeof errorWithCode.code === "number"
          ? errorWithCode.code
          : undefined,
      details: typeof errorWithCode.details === "string" ? errorWithCode.details : undefined,
    };
  }

  return {
    name: "UnknownError",
    message: String(error),
  };
}

export function logServerError(
  error: unknown,
  { scope, operation, context = {} }: ServerErrorLogContext,
): void {
  console.error("[server-error]", {
    scope,
    operation,
    context,
    error: getErrorDetails(error),
  });
}
