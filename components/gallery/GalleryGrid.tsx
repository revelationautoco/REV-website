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
      {withFilter && services.length > 1 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {services.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm",
                filter === s
                  ? "border-transparent bg-accent text-accent-foreground"
                  : "border-2 border-border bg-surface text-muted hover:text-foreground",
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
            type="button"
            className="group relative overflow-hidden rounded-2xl border-2 border-border bg-surface text-left"
            onClick={() => setLightbox({ src: item.src, alt: item.alt })}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/30">
                <span className="rounded-full border border-white/30 bg-black/30 p-3 opacity-0 backdrop-blur-sm transition-opacity duration-300 ease-out group-hover:opacity-100">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                    aria-hidden="true"
                  >
                    <path
                      d="M10.5 4.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M15.5 15.5 20 20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.5 8v5M8 10.5h5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-3 text-left">
              <div className="text-sm">{item.alt}</div>
              {item.service ? (
                <span
                  className={cn(
                    "whitespace-nowrap rounded-full border-2 border-border bg-white px-2 py-0.5 text-xs text-muted",
                    item.service === "Full Detail" ? "px-3" : "",
                  )}
                >
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
