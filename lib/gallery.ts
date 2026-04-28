export type GalleryItem = {
  src: string;
  alt: string;
  service?: string;
};

export const GALLERY: GalleryItem[] = [
  { src: "/gallery/sedan-before-after.svg", alt: "Sedan before and after", service: "Full Detail" },
  { src: "/gallery/suv-before-after.svg", alt: "SUV before and after", service: "Interior Detail" },
  { src: "/gallery/coupe-before-after.svg", alt: "Coupe before and after", service: "Full Detail" },
  { src: "/gallery/van-before-after.svg", alt: "Van before and after", service: "Interior Detail" },
];