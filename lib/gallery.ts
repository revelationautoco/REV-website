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
    src: "/gallery/jaguar-full-detail.jpg",
    alt: "Jaguar — Inside & Out",
    service: "Full Detail",
  },
];
