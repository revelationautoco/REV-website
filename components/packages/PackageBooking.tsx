"use client";

import { useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PackageList } from "@/components/packages/PackageList";
import { CalendlyEmbed } from "@/components/booking/CalendlyEmbed";

export function PackageBooking({ defaultPackageId }: { defaultPackageId?: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const bookRef = useRef<HTMLDivElement | null>(null);

  const selected = sp.get("package") ?? defaultPackageId ?? undefined;

  const calendlyUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_CALENDLY_URL;
    return base ?? "";
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div>
        <PackageList
          onBook={(packageId) => {
            const params = new URLSearchParams(sp.toString());
            params.set("package", packageId);
            router.replace(`/packages?${params.toString()}#book`);
            bookRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      </div>

      <div className="space-y-6" ref={bookRef}>
        {calendlyUrl ? <CalendlyEmbed url={calendlyUrl} /> : null}
      </div>
    </div>
  );
}

