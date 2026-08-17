import { formatPrice } from "@/lib/packages";
import type { PriceTier } from "@/types/package";

/**
 * Marketing-only price display. Shows strikethrough base + offer when basePrice
 * is set on the tier. Booking form and emails use formatPrice(tier.price) directly.
 */
export function PackageMarketingPrice({
  tier,
  offerClassName = "font-bold text-accent",
  baseClassName = "text-[11px] text-muted line-through",
}: {
  tier: PriceTier;
  offerClassName?: string;
  baseClassName?: string;
}) {
  const hasPromo =
    tier.basePrice != null && tier.basePrice > tier.price;

  if (!hasPromo) {
    return <span className={offerClassName}>{formatPrice(tier.price)}</span>;
  }

  return (
    <span className="inline-flex max-w-full flex-wrap items-baseline justify-end gap-x-1.5 gap-y-0.5">
      <span className={baseClassName}>{formatPrice(tier.basePrice!)}</span>
      <span className={offerClassName}>{formatPrice(tier.price)}</span>
    </span>
  );
}
