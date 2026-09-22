"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export interface GalleryProject {
  id: string;
  actualLocation: string;
  customerType: "Privat" | "Gewerbe";
  capacityKwp: number;
  image: string;
  width: number;
  height: number;
  alt: string;
}

const capacityFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 3 });
export function galleryCaption(project: GalleryProject) {
  return `${project.actualLocation} · ${capacityFormat.format(project.capacityKwp)} kWp · ${project.customerType}`;
}

export function ReferenceGallery({ projects }: { projects: readonly GalleryProject[] }) {
  const [openIndex, setOpenIndex] = useState(-1);
  const photos = useMemo(() => projects.map((project, index) => ({
    src: project.image, width: project.width, height: project.height,
    alt: project.alt, index,
  })), [projects]);
  const slides = useMemo(() => projects.map((project) => ({
    src: project.image, width: project.width, height: project.height, alt: project.alt,
  })), [projects]);
  const only = projects[0];

  return (
    <>
      {projects.length === 1 && only ? (
        <figure className="max-w-4xl">
          <button type="button" onClick={() => setOpenIndex(0)} aria-label={`${only.alt} – Bild vergrößern`} className="group block w-full cursor-zoom-in overflow-hidden rounded-[0.35rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-primary)]">
            <Image src={only.image} alt={only.alt} width={only.width} height={only.height} sizes="(max-width: 900px) calc(100vw - 40px), 900px" className="h-auto w-full transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.015]" />
          </button>
          <figcaption className="mt-3 text-sm font-medium text-[var(--text-muted)]">{galleryCaption(only)}</figcaption>
        </figure>
      ) : (
        <RowsPhotoAlbum
          photos={photos}
          spacing={16}
          targetRowHeight={(width) => width < 600 ? 300 : width < 950 ? 270 : 315}
          defaultContainerWidth={1200}
          render={{ photo: ({ onClick }, { photo, width, height }) => {
            const project = projects[photo.index]!;
            return (
              <figure className="min-w-0" style={{ width }}>
                <button type="button" onClick={onClick} aria-label={`${project.alt} – Bild vergrößern`} className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[0.3rem] bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-primary)]" style={{ height }}>
                  <Image src={project.image} alt={project.alt} fill sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 950px) 50vw, 33vw" className="object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.02]" />
                </button>
                <figcaption className="mt-2 text-sm font-medium text-[var(--text-muted)]">{galleryCaption(project)}</figcaption>
              </figure>
            );
          } }}
          onClick={({ index }) => setOpenIndex(index)}
        />
      )}
      <Lightbox
        open={openIndex >= 0}
        close={() => setOpenIndex(-1)}
        index={Math.max(0, openIndex)}
        slides={slides}
        on={{ view: ({ index }) => setOpenIndex(index) }}
        render={{ slideFooter: ({ slide }) => {
          if (!("src" in slide)) return null;
          const index = projects.findIndex((project) => project.image === slide.src);
          if (index < 0) return null;
          return <div className="reference-lightbox-caption">{galleryCaption(projects[index]!)}<span aria-hidden="true">{index + 1} / {projects.length}</span></div>;
        } }}
      />
    </>
  );
}
