import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:brightness-110 border border-transparent",
  secondary:
    "bg-surface text-foreground hover:bg-surface-2 border border-border",
  ghost: "bg-transparent text-foreground hover:bg-white/5 border border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-accent/60 disabled:opacity-60",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  href,
  variant = "secondary",
  size = "md",
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-accent/60",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
}

