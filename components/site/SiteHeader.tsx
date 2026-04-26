import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const nav = [
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="heading text-2xl leading-none">Revelation</span>
          <span className="text-sm text-muted">Auto Detailing</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/packages" variant="primary" size="sm">
            Book Now
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}

