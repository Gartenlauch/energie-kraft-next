import Image from "next/image";

export function BrandIntro() {
  return (
    <div className="brand-intro" aria-hidden="true">
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
