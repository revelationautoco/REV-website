"use client";

import { useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function Lightbox({
  open,
  src,
  alt,
  afterSrc,
  caption,
  onClose,
}: {
  open: boolean;
  /** Primary image (before when `afterSrc` is set). */
  src: string;
  alt: string;
  /** When set, opens as a before / after pair with `src` as before. */
  afterSrc?: string;
  caption?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const pair = !!afterSrc;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={pair ? `${alt} — before and after` : alt}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {pair ? (
          <div className="p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/20">
                <Image
                  src={src}
                  alt={`${alt} — before`}
                  fill
                  className="object-contain"
                  priority
                />
                <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-white">
                  Before
                </span>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/20">
                <Image
                  src={afterSrc}
                  alt={`${alt} — after`}
                  fill
                  className="object-contain"
                  priority
                />
                <span className="absolute right-2 top-2 rounded-full bg-accent px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-accent-foreground">
                  After
                </span>
              </div>
            </div>
            {caption ? (
              <p className="mt-3 text-center text-sm text-muted">{caption}</p>
            ) : null}
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full">
            <Image src={src} alt={alt} fill className="object-contain" priority />
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full border border-border bg-background/60 px-3 py-1 text-sm hover:bg-background"
        >
          Close
        </button>
      </div>
    </div>
  );
}
