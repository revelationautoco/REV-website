"use client";

import { Button } from "@/components/ui/Button";
import { formatPrice, PACKAGES } from "@/lib/packages";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { ServicePackage } from "@/types/package";

export function PackageList({
  onBook,
}: {
  onBook: (packageId: string) => void;
}) {
  const exterior = PACKAGES.find((p) => p.id === "exterior");
  const interior = PACKAGES.find((p) => p.id === "interior");
  const full = PACKAGES.find((p) => p.id === "full");
  const specialty = PACKAGES.find((p) => p.id === "specialty");

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 md:flex-row w-full">
        {exterior ? <PackageCard pkg={exterior} onBook={onBook} /> : null}
        {interior ? <PackageCard pkg={interior} onBook={onBook} /> : null}
      </div>
      <div className="flex flex-col gap-4 md:flex-row w-full">
        {full ? <PackageCard pkg={full} onBook={onBook} /> : null}
        {specialty ? <PackageCard pkg={specialty} onBook={onBook} /> : null}
      </div>
    </div>
  );
}

function PackageCard({
  pkg,
  onBook,
}: {
  pkg: ServicePackage;
  onBook: (packageId: string) => void;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border-2 border-border bg-surface p-6 flex flex-col",
        "md:flex-1",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="heading text-2xl">{pkg.name}</h3>
          </div>
          <p className="mt-1 text-sm text-muted">{pkg.description}</p>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 text-sm text-muted flex-1">
        {pkg.includes.map((x) => (
          <li key={x} className="flex gap-2">
            <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{x}</span>
          </li>
        ))}
      </ul>

      {pkg.prices?.length ? (
        <div className="mt-5 rounded-xl border-2 border-border bg-white px-4 py-3 text-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="text-muted whitespace-nowrap">Sedan / Small SUV —</div>
            <div className="whitespace-nowrap font-bold text-accent">
              {formatPrice(pkg.prices[0].price)}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="text-muted whitespace-nowrap">Large SUV / Truck —</div>
            <div className="whitespace-nowrap font-bold text-accent">
              {formatPrice(pkg.prices[1].price)}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border-2 border-border bg-white px-4 py-3 text-xs">
          <div className="whitespace-nowrap font-bold text-accent">
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

