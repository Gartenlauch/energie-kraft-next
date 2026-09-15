import type {
    ConfiguratorInterests,
    ConfiguratorJourneyState,
    ConfiguratorResults,
    ConfiguratorType,
} from "@/types/configurator";

export const CONFIGURATOR_JOURNEY_ORDER = [
        "photovoltaic",
        "battery_storage",
        "wallbox",
        "heat_pump",
        "climate",
    ] as const satisfies readonly ConfiguratorType[];

function sortProducts(products: readonly ConfiguratorType[]): ConfiguratorType[] {
  const uniqueProducts = new Set(products);

  return CONFIGURATOR_JOURNEY_ORDER.filter((product) => uniqueProducts.has(product));
}

function getInterestProducts(interests: ConfiguratorInterests): ConfiguratorType[] {
  const products: ConfiguratorType[] = [];

  if (interests.photovoltaic) {
    products.push("photovoltaic");
  }

    if (interests.batteryStorage) {
        products.push("battery_storage");
    }

    if (interests.wallbox) {
        products.push("wallbox");
    }

    if (interests.heatPump) {
        products.push("heat_pump");
    }

    if (interests.climate) {
        products.push("climate");
    }

    return products;
}

function hasConfiguratorResult(product: ConfiguratorType, results: ConfiguratorResults): boolean {
    switch (product) {
        case "photovoltaic":
            return results.photovoltaic !== undefined;

        case "battery_storage":
            return results.batteryStorage !== undefined;

        case "wallbox":
            return results.wallbox !== undefined;

        case "heat_pump":
            return results.heatPump !== undefined;

        case "climate":
            return results.climate !== undefined;
    }
}

export function buildConfiguratorJourney(
    entryPoint: ConfiguratorType | null,
    interests: ConfiguratorInterests,
    results: ConfiguratorResults,
): ConfiguratorJourneyState {
  const remainingProducts = sortProducts(getInterestProducts(interests)).filter(
    (product) => product !== entryPoint,
  );
  const selectedProducts = entryPoint ? [entryPoint, ...remainingProducts] : remainingProducts;

  const completedProducts = selectedProducts.filter((product) =>
    hasConfiguratorResult(product, results),
        );

    return {
        entryPoint,
        selectedProducts,
        completedProducts,
    };
}

export function getNextConfiguratorProduct(
    journey: ConfiguratorJourneyState,
    currentProduct: ConfiguratorType,
): ConfiguratorType | null {
  const currentIndex = journey.selectedProducts.indexOf(currentProduct);

  for (let index = currentIndex + 1; index < journey.selectedProducts.length; index += 1) {
    const product = journey.selectedProducts[index];

        if (!product) {
            continue;
        }

    if (!journey.selectedProducts.includes(product)) {
            continue;
        }

    if (journey.completedProducts.includes(product)) {
            continue;
        }

        return product;
    }

    return null;
}

export function getFirstIncompleteConfiguratorProduct(
    journey: ConfiguratorJourneyState,
): ConfiguratorType | null {
    return (
    journey.selectedProducts.find((product) => !journey.completedProducts.includes(product)) ?? null
    );
}