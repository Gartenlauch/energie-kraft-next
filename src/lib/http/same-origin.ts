function getFirstHeaderValue(
  value: string | null,
): string | null {
  const firstValue = value
    ?.split(",")
    .map((item) => item.trim())
    .find(Boolean);

  return firstValue ?? null;
}

export function isTrustedSameOriginRequest(
  request: Request,
): boolean {
  const originHeader = request.headers.get("origin");

  if (!originHeader || originHeader === "null") {
    return false;
  }

  const fetchSite =
    request.headers.get("sec-fetch-site");

  if (
    fetchSite &&
    fetchSite !== "same-origin"
  ) {
    return false;
  }

  const requestUrl = new URL(request.url);

  const forwardedHost = getFirstHeaderValue(
    request.headers.get("x-forwarded-host"),
  );

  const forwardedProtocol = getFirstHeaderValue(
    request.headers.get("x-forwarded-proto"),
  );

  const host =
    forwardedHost ??
    getFirstHeaderValue(
      request.headers.get("host"),
    ) ??
    requestUrl.host;

  const protocol = (
    forwardedProtocol ??
    requestUrl.protocol
  ).replace(/:$/, "");

  const expectedOrigin = `${protocol}://${host}`;

  try {
    return (
      new URL(originHeader).origin === expectedOrigin
    );
  } catch {
    return false;
  }
}