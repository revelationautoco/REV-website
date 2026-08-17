import Link from "next/link";
import { cn } from "@/lib/cn";

export function ContactQuotePackageCard({
  title,
  body,
  ctaLabel = "Contact Us",
  compact = false,
  accentBorder = false,
  className,
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  compact?: boolean;
  accentBorder?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/contact"
      className={cn(
        "group flex flex-col text-left transition focus:outline-none focus:ring-2 focus:ring-accent/40",
        compact
          ? cn(
              "rounded-xl border-2 bg-white p-4",
              accentBorder
                ? "border-accent hover:border-accent/80"
                : "border-dashed border-border hover:border-foreground/40",
            )
          : cn(
              "w-full rounded-2xl border-2 bg-surface p-6 md:flex-1",
              accentBorder
                ? "border-accent hover:border-accent/80"
                : "border-dashed border-border hover:border-foreground/40",
            ),
        className,
      )}
    >
      <h3
        className={cn(
          "heading leading-tight text-foreground",
          compact ? "text-sm" : "text-2xl",
        )}
      >
        {title}
      </h3>
      <p className={cn("mt-2 text-muted", compact ? "text-xs" : "text-sm")}>{body}</p>
      <div
        className={cn(
          "mt-auto font-medium text-foreground underline-offset-4 group-hover:underline",
          compact ? "mt-3 text-[11px]" : "mt-5 text-sm",
        )}
      >
        {ctaLabel} →
      </div>
    </Link>
  );
}
