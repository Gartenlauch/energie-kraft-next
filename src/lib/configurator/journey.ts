import type {
    ConfiguratorInterests,
    ConfiguratorJourneyState,
    ConfiguratorResults,
    ConfiguratorType,
} from "@/types/configurator";
import { CONFIGURATOR_PRODUCT_ORDER } from "../../../functions/src/configurator-product-order";

export const CONFIGURATOR_JOURNEY_ORDER: readonly ConfiguratorType[] = CONFIGURATOR_PRODUCT_ORDER;

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
    additionalSolutionsReviewed = false,
): ConfiguratorJourneyState {
  const selectedProducts = sortProducts([
    ...(entryPoint ? [entryPoint] : []),
    ...getInterestProducts(interests),
  ]);

  const completedProducts = selectedProducts.filter((product) =>
    hasConfiguratorResult(product, results),
        );

    return {
        entryPoint,
        selectedProducts,
        completedProducts,
        additionalSolutionsReviewed,
    };
}

export function shouldReviewAdditionalEnergySolutions(
  journey: ConfiguratorJourneyState,
  currentProduct: ConfiguratorType,
): boolean {
  return (
    !journey.additionalSolutionsReviewed &&
    (currentProduct === "heat_pump" || currentProduct === "climate")
  );
}

export function getNextConfiguratorProduct(
    journey: ConfiguratorJourneyState,
    currentProduct: ConfiguratorType,
): ConfiguratorType | null {
  return journey.selectedProducts.find(
    (product) => product !== currentProduct && !journey.completedProducts.includes(product),
  ) ?? null;
}

export function getFirstIncompleteConfiguratorProduct(
    journey: ConfiguratorJourneyState,
): ConfiguratorType | null {
    return (
    journey.selectedProducts.find((product) => !journey.completedProducts.includes(product)) ?? null
    );
}
