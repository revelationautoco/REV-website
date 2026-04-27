"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PackageList } from "@/components/packages/PackageList";

export function PackagesGrid() {
  const router = useRouter();
  const sp = useSearchParams();

  const onBook = useCallback(
    (packageId: string) => {
      const params = new URLSearchParams(sp.toString());
      params.set("package", packageId);
      router.push(`/booking?${params.toString()}`);
    },
    [router, sp],
  );

  return <PackageList onBook={onBook} />;
}

