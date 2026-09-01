import type {
    ConfiguratorType,
} from "@/types/configurator";

interface ConfiguratorProductBadgeProps {
    product: ConfiguratorType;
}

interface ProductBadgeTheme {
    label: string;
    className: string;
}

export const CONFIGURATOR_PRODUCT_BADGES:
    Record<
        ConfiguratorType,
        ProductBadgeTheme
    > = {
    photovoltaic: {
        label: "Photovoltaik",
        className:
            "border-amber-300 bg-amber-50 text-amber-900",
    },

    battery_storage: {
        label: "Stromspeicher",
        className:
            "border-emerald-300 bg-emerald-50 text-emerald-900",
    },

    wallbox: {
        label: "Wallbox",
        className:
            "border-indigo-300 bg-indigo-50 text-indigo-900",
    },

    heat_pump: {
        label: "Wärmepumpe",
        className:
            "border-rose-300 bg-rose-50 text-rose-900",
    },

    climate: {
        label: "Klimaanlage",
        className:
            "border-sky-300 bg-sky-50 text-sky-900",
    },
};

export function ConfiguratorProductBadge({
    product,
}: ConfiguratorProductBadgeProps) {
    const theme =
        CONFIGURATOR_PRODUCT_BADGES[
        product
        ];

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${theme.className}`}
        >
            {theme.label}
        </span>
    );
}