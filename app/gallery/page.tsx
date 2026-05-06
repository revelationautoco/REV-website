import { Container } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <Container className="py-12">
      <div className="max-w-3xl">
        <h1 className="heading text-5xl leading-[0.95]">Gallery</h1>
        <p className="mt-3 text-base text-muted">
          Real cars, real results. Browse before-and-afters from recent jobs.
        </p>
      </div>

      <div className="mt-10">
        <GalleryGrid withFilter />
      </div>
    </Container>
  );
}

