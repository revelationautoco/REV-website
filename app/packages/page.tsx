import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/leads/LeadForm";
import { PackageBooking } from "@/components/packages/PackageBooking";
import { Suspense } from "react";

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const selected = typeof sp.package === "string" ? sp.package : undefined;

  return (
    <Container className="py-12">
      <div id="packages" className="max-w-3xl">
        <h1 className="heading text-5xl leading-[0.95]">Packages & Booking</h1>
        <p className="mt-3 text-base text-muted">
          Choose a package below. If you’re unsure, submit your details and we’ll
          recommend the best fit based on your vehicle condition and goals.
        </p>
      </div>

      <div className="mt-10">
        <PackageBooking defaultPackageId={selected} />
      </div>

      <div id="book" className="mt-12">
        <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
          <LeadForm defaultPackageId={selected} />
        </Suspense>
      </div>
    </Container>
  );
}

