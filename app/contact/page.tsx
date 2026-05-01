import { Container } from "@/components/ui/Container";
import { siteContact, telHref } from "@/lib/siteContact";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact / About" };

export default function ContactPage() {
  return (
    <div>
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h1 className="heading text-5xl leading-[0.95]">Contact / About</h1>
            <p className="mt-3 text-base text-muted">
              We specialize in high-end vehicle care for clients who expect the
              best. Every detail is handled with precision, premium products, and a
              commitment to results & convenience.
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
              <div className="heading text-2xl">Service area</div>
              <p className="mt-2 text-sm text-muted">
                Serving the local area within ~10–20 miles (varies by package and
                schedule). If you’re outside the area, reach out and we’ll confirm
                availability.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-muted">
                <li>
                  • Conveniently servicing your vehicle at any location you need!
                </li>
                <li>
                  • Special rates for businesses & groups of vehicles upon
                  request.
                </li>
                <li>• Fleet appointments available on request.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-border bg-white p-6 md:p-8">
            <h2 className="heading text-2xl">Get in touch</h2>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="text-sm text-muted">Phone</dt>
                <dd className="mt-1">
                  <a
                    href={telHref()}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {siteContact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${siteContact.email}`}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {siteContact.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </div>
  );
}
