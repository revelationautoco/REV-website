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
          A few before/after examples. Updating photos is easy—drop new files into{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5">public/gallery</code>.
        </p>
      </div>

      <div className="mt-10">
        <GalleryGrid withFilter />
      </div>
    </Container>
  );
}

