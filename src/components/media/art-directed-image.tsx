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
  return (
    <picture className="block h-full w-full">
      <source
        media="(min-width: 768px)"
        srcSet={desktopSrc}
        sizes={sizes}
        width={desktopWidth}
        height={desktopHeight}
      />
      <source
        media="(max-width: 767px)"
        srcSet={mobileSrc}
        sizes={sizes}
        width={mobileWidth}
        height={mobileHeight}
      />
      <img
        src={mobileSrc}
        width={mobileWidth}
        height={mobileHeight}
        alt={alt}
        sizes={sizes}
        className={className}
        fetchPriority={fetchPriority}
        loading={fetchPriority === "high" ? "eager" : "lazy"}
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </picture>
  );
}
