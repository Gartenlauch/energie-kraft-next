import Link from "next/link";

import type {
  ConfiguratorLandingProduct,
  ConfiguratorType,
} from "@/types/configurator";

interface ConfiguratorHouseNavigationProps {
  products: readonly ConfiguratorLandingProduct[];
}

const hotspotClasses = {
  photovoltaic:
    "top-0 left-1/2 -translate-x-1/2",
  battery_storage:
    "top-52 left-0",
  climate:
    "top-52 right-0",
  heat_pump:
    "bottom-0 left-[12%]",
  wallbox:
    "right-[12%] bottom-0",
} satisfies Record<ConfiguratorType, string>;

export function ConfiguratorHouseNavigation({
  products,
}: ConfiguratorHouseNavigationProps) {
  return (
    <div className="relative mx-auto hidden min-h-[560px] w-full max-w-5xl lg:block">
      <div
        className="absolute inset-x-[17%] top-24 bottom-16"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 720 440"
          className="h-full w-full text-brand-primary"
          focusable="false"
        >
          <path
            d="M145 205 360 58l215 147v190H145Z"
            fill="var(--surface)"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          <path
            d="M116 216 360 45l244 171"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <g
            fill="var(--brand-accent)"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="m252 126 86-55 45 30-88 57Z" />
            <path d="m302 162 88-57 47 32-90 58Z" />
            <path d="m359 198 90-58 45 31-91 60Z" />
          </g>

          <rect
            x="199"
            y="272"
            width="70"
            height="111"
            rx="8"
            fill="var(--surface-strong)"
            stroke="currentColor"
            strokeWidth="5"
          />

          <circle
            cx="234"
            cy="294"
            r="6"
            fill="var(--brand-accent)"
          />

          <rect
            x="442"
            y="234"
            width="91"
            height="55"
            rx="8"
            fill="var(--surface-strong)"
            stroke="currentColor"
            strokeWidth="5"
          />

          <path
            d="M458 251h59M458 264h59M458 277h36"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <rect
            x="311"
            y="265"
            width="104"
            height="130"
            rx="4"
            fill="var(--background)"
            stroke="currentColor"
            strokeWidth="5"
          />

          <path
            d="M363 265v130"
            stroke="currentColor"
            strokeWidth="4"
          />

          <rect
            x="91"
            y="330"
            width="92"
            height="65"
            rx="10"
            fill="var(--surface-strong)"
            stroke="currentColor"
            strokeWidth="5"
          />

          <circle
            cx="137"
            cy="362"
            r="19"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />

          <rect
            x="548"
            y="292"
            width="48"
            height="78"
            rx="8"
            fill="var(--surface-strong)"
            stroke="currentColor"
            strokeWidth="5"
          />

          <path
            d="M562 319h20M572 309v20"
            stroke="var(--brand-accent)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M596 349h28v44"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {products.map((product) => (
        <Link
          key={product.type}
          href={product.href}
          className={[
            "absolute z-10 w-44 rounded-2xl border border-border-default",
            "bg-background p-4 text-center shadow-sm",
            "transition hover:-translate-y-0.5 hover:border-brand-accent hover:shadow-md",
            hotspotClasses[product.type],
          ].join(" ")}
        >
          <span className="block text-xs font-semibold tracking-wide text-brand-secondary uppercase">
            {product.statusLabel}
          </span>

          <span className="mt-1 block font-semibold text-brand-primary">
            {product.shortLabel}
          </span>
        </Link>
      ))}
    </div>
  );
}