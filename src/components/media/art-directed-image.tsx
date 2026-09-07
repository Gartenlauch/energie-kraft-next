import { getImageProps } from "next/image";

interface ArtDirectedImageProps {
  desktopSrc: string;
  mobileSrc: string;
  desktopWidth: number;
  desktopHeight: number;
  mobileWidth: number;
  mobileHeight: number;
  alt: string;
  sizes: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
}

export function ArtDirectedImage({
  desktopSrc,
  mobileSrc,
  desktopWidth,
  desktopHeight,
  mobileWidth,
  mobileHeight,
  alt,
  sizes,
  className,
  fetchPriority,
}: ArtDirectedImageProps) {
  const common = {
    alt,
    sizes,
    quality: 84,
  } as const;

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: desktopSrc,
    width: desktopWidth,
    height: desktopHeight,
  });

  const {
    props: { srcSet: mobileSrcSet, ...mobileProps },
  } = getImageProps({
    ...common,
    src: mobileSrc,
    width: mobileWidth,
    height: mobileHeight,
    fetchPriority,
  });

  return (
    <picture className="block h-full w-full">
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
      {/* getImageProps supplies intrinsic dimensions and an optimized fallback URL. */}
      <img
        {...mobileProps}
        alt={alt}
        className={className}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </picture>
  );
}
