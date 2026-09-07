import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const sharedProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="m7 9 5 5 5-5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M7.2 3.5 9.6 8 7.9 9.7a15.2 15.2 0 0 0 6.4 6.4l1.7-1.7 4.5 2.4v2.7c0 .8-.7 1.5-1.5 1.5C10.2 21 3 13.8 3 5c0-.8.7-1.5 1.5-1.5h2.7Z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function BatteryIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <rect x="4" y="6" width="15" height="12" rx="2" />
      <path d="M19 10h2v4h-2M11 8.5 8.5 13H12l-1 2.5 4-5H12l1-2" />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M20 4C11 4 5 8 5 15c0 2.8 2.2 5 5 5 7 0 10-7 10-16Z" />
      <path d="M4 21c3-6 7-9 12-12" />
    </svg>
  );
}

export function SnowflakeIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M12 2v20M4.2 6.5l15.6 11M4.2 17.5l15.6-11M9 4l3 3 3-3M9 20l3-3 3 3" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="m13 2-8 12h6l-1 8 9-13h-6V2Z" />
    </svg>
  );
}
