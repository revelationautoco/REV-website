"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { GALLERY } from "@/lib/gallery";
import { cn } from "@/lib/cn";
import { Lightbox } from "@/components/gallery/Lightbox";

export function GalleryGrid({ withFilter }: { withFilter?: boolean }) {
  const services = useMemo(() => {
    const set = new Set(GALLERY.map((g) => g.service).filter(Boolean) as string[]);
    return ["All", ...Array.from(set)];
  }, []);

  const [filter, setFilter] = useState<string>("All");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const items = useMemo(() => {
    if (!withFilter || filter === "All") return GALLERY;
    return GALLERY.filter((g) => g.service === filter);
  }, [filter, withFilter]);

  return (
    <div>
      {withFilter ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {services.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm",
                filter === s
                  ? "border-transparent bg-accent text-accent-foreground"
                  : "border-border bg-surface text-muted hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.src}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface"
            onClick={() => setLightbox({ src: item.src, alt: item.alt })}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-3 text-left">
              <div className="text-sm">{item.alt}</div>
              {item.service ? (
                <span className="rounded-full border border-border bg-background/30 px-2 py-0.5 text-xs text-muted">
                  {item.service}
                </span>
              ) : null}
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={!!lightbox}
        src={lightbox?.src ?? ""}
        alt={lightbox?.alt ?? ""}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}

