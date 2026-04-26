import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef } from "react";

export function Container({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)}
      {...props}
    />
  );
}

