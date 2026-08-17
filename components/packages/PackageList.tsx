"use client";

import { Button } from "@/components/ui/Button";
import { ContactQuotePackageCard } from "@/components/packages/ContactQuotePackageCard";
import { PackageMarketingPrice } from "@/components/packages/PackageMarketingPrice";
import { getPackageCardPackages } from "@/lib/packages";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { ServicePackage } from "@/types/package";

export function PackageList({
  onBook,
}: {
  onBook: (packageId: string) => void;
}) {
  const packages = getPackageCardPackages();
  const bookable = packages.filter((p) => !p.contactOnly);
  const paintCorrection = packages.find((p) => p.id === "paint-correction");

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 md:flex-row w-full">
        {bookable.slice(0, 2).map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onBook={onBook} />
        ))}
      </div>
      <div className="flex flex-col gap-4 md:flex-row w-full">
        {bookable.slice(2, 4).map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onBook={onBook} />
        ))}
      </div>
      {paintCorrection ? (
        <ContactQuotePackageCard
          title={paintCorrection.name}
          body={paintCorrection.description}
          ctaLabel={paintCorrection.ctaLabel}
          accentBorder
          className="md:max-w-[calc(50%-8px)]"
        />
      ) : null}
    </div>
  );
}

function PackageCard({
  pkg,
  onBook,
  className,
}: {
  pkg: ServicePackage;
  onBook: (packageId: string) => void;
  className?: string;
}) {
  const showDuration = pkg.durationSedan || pkg.durationLarge;
  const sameDuration =
    pkg.durationSedan && pkg.durationSedan === pkg.durationLarge;
  const durationText = sameDuration
    ? pkg.durationSedan
    : [
        pkg.durationSedan ? `Sedan: ${pkg.durationSedan}` : null,
        pkg.durationLarge ? `Large: ${pkg.durationLarge}` : null,
      ]
        .filter(Boolean)
        .join(" · ");

  return (
    <div
      className={cn(
        "w-full rounded-2xl border-2 border-border bg-surface p-6 flex flex-col",
        "md:flex-1",
        pkg.popular && "ring-2 ring-accent ring-offset-2",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="heading text-2xl">{pkg.name}</h3>
            {pkg.popular && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Most Popular
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">{pkg.description}</p>
        </div>
      </div>

      {pkg.includes.length > 0 && (
        <ul className="mt-4 grid gap-2 text-sm text-muted flex-1">
          {pkg.includes.map((x) => (
            <li key={x} className="flex gap-2">
              <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      )}

      {pkg.prices?.length ? (
        <div className="mt-5 rounded-xl border-2 border-border bg-white px-4 py-3 text-xs">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="text-muted">Sedan / Small SUV —</div>
            <div className="sm:text-right">
              <PackageMarketingPrice tier={pkg.prices[0]} />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="text-muted">Large SUV / Truck / Van —</div>
            <div className="sm:text-right">
              <PackageMarketingPrice tier={pkg.prices[1]} />
            </div>
          </div>
          {showDuration && (
            <div className="mt-2 border-t border-border pt-2 text-muted">
              ⏱ {durationText}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border-2 border-border bg-white px-4 py-3 text-xs">
          <div className="font-bold text-accent">
            {pkg.pricingLabel ?? "Custom Quote"}
          </div>
        </div>
      )}

      <div className="mt-5">
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            track({ name: "package_click", params: { packageId: pkg.id } });
            onBook(pkg.id);
          }}
        >
          {pkg.ctaLabel ?? "Book This Package"}
        </Button>
      </div>
    </div>
  );
}
