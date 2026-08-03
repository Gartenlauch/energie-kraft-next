export type PublicDataResource = "faq";

interface PublicDataErrorOptions {
  resource: PublicDataResource;
  operation: string;
  context?: Record<string, string>;
  cause: unknown;
}

export class PublicDataError extends Error {
  readonly resource: PublicDataResource;
  readonly operation: string;
  readonly context: Record<string, string>;

  constructor({ resource, operation, context = {}, cause }: PublicDataErrorOptions) {
    super(`Öffentliche Daten konnten nicht geladen werden: ${resource}/${operation}`, {
      cause,
    });

    this.name = "PublicDataError";
    this.resource = resource;
    this.operation = operation;
    this.context = context;
  }
}
