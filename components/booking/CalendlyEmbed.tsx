"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

export function CalendlyEmbed({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]',
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className={cn("rounded-2xl border-2 border-border bg-surface p-4", className)}>
      <div className="heading text-2xl">Book on the calendar</div>
      <p className="mt-1 text-sm text-muted">
        Prefer a confirmed appointment instantly? Use our scheduling link.
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border-2 border-border bg-white">
        <iframe
          title="Calendly booking"
          src={url}
          className="h-[760px] w-full"
        />
      </div>
    </div>
  );
}

