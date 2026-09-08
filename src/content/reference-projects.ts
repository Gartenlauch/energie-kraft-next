export interface ReferenceProject {
  slug: string;
  location: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
}

export const regionalReferenceProjects: readonly ReferenceProject[] = [
  {
    slug: "berchtesgaden-wohnhaus",
    location: "Berchtesgaden",
    category: "Photovoltaik am Wohngebäude",
    imageSrc: "/images/references/berchtesgaden-residential.webp",
    imageAlt: "Photovoltaikanlage auf einem Wohnhaus in Berchtesgaden",
  },
  {
    slug: "ainring-wohnhaus",
    location: "Ainring",
    category: "Regionale Photovoltaik-Referenz",
    imageSrc: "/images/references/ainring-residential.webp",
    imageAlt: "Photovoltaikmodule auf einem Wohnhaus in Ainring",
  },
  {
    slug: "freilassing-gewerbe",
    location: "Freilassing",
    category: "Photovoltaik auf einem Gewerbedach",
    imageSrc: "/images/references/freilassing-commercial.webp",
    imageAlt: "Photovoltaikanlage auf einem Gewerbedach in Freilassing",
  },
  {
    slug: "schoenram-petting-gewerbe",
    location: "Schönram-Petting",
    category: "Großflächige Photovoltaik-Referenz",
    imageSrc: "/images/references/schoenram-commercial.webp",
    imageAlt: "Großflächige Photovoltaikanlage auf einem Gewerbedach in Schönram-Petting",
  },
] as const;
