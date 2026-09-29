import Image from "next/image";

export type BrandIntroVariant = "white" | "brand";

interface BrandIntroProps {
  variant?: BrandIntroVariant;
}

export function BrandIntro({ variant = "brand" }: BrandIntroProps) {
  return (
    <div className={`brand-intro brand-intro--${variant}`} aria-hidden="true">
      <span className="brand-intro__mark">
        <Image
          src="/brand/energie-kraft/energie-kraft-supersign.svg"
          alt=""
          width={106}
          height={103}
        />
      </span>
    </div>
  );
}
