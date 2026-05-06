export type GalleryItem = {
  src: string;
  alt: string;
  service?: string;
};

/** Real photos go here. Files live under /public/gallery/.
 *  Format: { src: "/gallery/your-photo.jpg", alt: "Card label", service: "Full Detail" }
 */
export const GALLERY: GalleryItem[] = [
  {
    src: "/gallery/TERRAIN-WEBSITE-PHOTO.JPG",
    alt: "GMC Terrain — Exterior Detail",
    service: "Exterior Detail",
  },
  {
    src: "/gallery/jaguar-full-detail.jpg",
    alt: "Jaguar — Full Detail, One Step Paint Correction",
    service: "Full Detail",
  },
  {
    src: "/gallery/F250-INTERIOR-BEFORE&AFTER.JPG",
    alt: "Interior Detail",
    service: "Interior Detail",
  },
  {
    src: "/gallery/RAPTOR-INTERIOR-BEFORE&AFTER.JPG",
    alt: "Interior Detail",
    service: "Interior Detail",
  },
];
