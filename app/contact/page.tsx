import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/leads/LeadForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Contact / About" };

export default function ContactPage() {
  return (
    <div>
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h1 className="heading text-5xl leading-[0.95]">Contact / About</h1>
            <p className="mt-3 text-base text-muted">
              Revelation Auto Detailing is owner-operated and focused on
              consistent, high-end results.
              We bring water + power where possible and work clean—your driveway
              stays tidy.
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
              <div className="heading text-2xl">Service area</div>
              <p className="mt-2 text-sm text-muted">
                Serving the local area within ~10–20 miles (varies by package and
                schedule). If you’re outside the area, submit the form and we’ll
                confirm.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-muted">
                <li>• Downtown + surrounding suburbs</li>
                <li>• Major neighborhoods within 20 minutes</li>
                <li>• Fleet appointments available on request</li>
              </ul>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <a
                href="tel:+15555555555"
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="text-sm text-muted">Phone</div>
                <div className="mt-1 font-medium">(555) 555-5555</div>
              </a>
              <a
                href="mailto:hello@revdetailing.com"
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="text-sm text-muted">Email</div>
                <div className="mt-1 font-medium">hello@revdetailing.com</div>
              </a>
            </div>
          </div>

          <div>
            <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
              <LeadForm compact />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}

