"use client";

import { ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

export function HomeHeroCtas() {
  return (
    <div className="mt-7 flex flex-row flex-wrap items-center gap-2 md:gap-3">
      <ButtonLink
        href="/packages"
        variant="primary"
        size="lg"
        className="w-auto shrink-0 max-md:h-11 max-md:px-4 max-md:text-sm"
        onClick={() => track({ name: "cta_click", params: { location: "hero", label: "Book Now" } })}
      >
        Book Now
      </ButtonLink>
      <ButtonLink
        href="/packages#packages"
        variant="secondary"
        size="lg"
        className="w-auto shrink-0 max-md:h-11 max-md:px-4 max-md:text-sm"
        onClick={() =>
          track({ name: "cta_click", params: { location: "hero", label: "View Packages" } })
        }
      >
        View Packages
      </ButtonLink>
    </div>
  );
}

export function HomeFinalCtas() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <ButtonLink
        href="/packages"
        variant="primary"
        size="lg"
        onClick={() => track({ name: "cta_click", params: { location: "final", label: "Book Now" } })}
      >
        Book Now
      </ButtonLink>
      <ButtonLink
        href="/contact"
        variant="secondary"
        size="lg"
        onClick={() =>
          track({ name: "cta_click", params: { location: "final", label: "Ask a Question" } })
        }
      >
        Ask a Question
      </ButtonLink>
    </div>
  );
}

