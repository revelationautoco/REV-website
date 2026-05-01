import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteContact, telHref } from "@/lib/siteContact";

export function SiteFooter() {
  return (
    <footer className="bg-[#111111] text-white">
      <Container className="py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="heading text-2xl">Revelation Auto Detailing</div>
            <p className="text-sm text-white/70">
              Mobile detailing for busy people. We come to you.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link className="text-white/70 hover:text-white" href="/packages">
              Packages
            </Link>
            <Link className="text-white/70 hover:text-white" href="/gallery">
              Gallery
            </Link>
            <Link className="text-white/70 hover:text-white" href="/contact">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Revelation Auto Detailing. All rights
            reserved.
          </p>
          <p>
            Call or text{" "}
            <a className="text-white" href={telHref()}>
              {siteContact.phoneDisplay}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

