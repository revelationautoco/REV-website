"use client";

import { Button } from "@/components/ui/Button";
import { PACKAGES } from "@/lib/packages";
import { track } from "@/lib/analytics";

export function PackageList({
  onBook,
}: {
  onBook: (packageId: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {PACKAGES.map((p) => (
        <div
          key={p.id}
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="heading text-2xl">{p.name}</h3>
                {p.popular ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    Most popular
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted">{p.description}</p>
            </div>
            <div className="text-sm text-muted">{p.priceLabel}</div>
          </div>

          <ul className="mt-4 grid gap-2 text-sm text-muted">
            {p.includes.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                <span>{x}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                track({ name: "package_click", params: { packageId: p.id } });
                onBook(p.id);
              }}
            >
              Book This Package
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

