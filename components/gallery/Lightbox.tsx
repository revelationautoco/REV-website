"use client";

import { useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function Lightbox({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string;
  alt: string;
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/9] w-full">
          <Image src={src} alt={alt} fill className="object-contain" priority />
        </div>
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

