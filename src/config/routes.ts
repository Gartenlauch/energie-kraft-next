export const FAQ_ROUTE_KEYS = [
  "home",
  "photovoltaik",
  "stromspeicher",
  "wallbox",
  "klimaanlagen",
  "waermepumpen",
  "kontakt",
] as const;

export type FaqRouteKey =
  (typeof FAQ_ROUTE_KEYS)[number];

export function isFaqRouteKey(
  value: string,
): value is FaqRouteKey {
  return FAQ_ROUTE_KEYS.some(
    (routeKey) => routeKey === value,
  );
}