import { Container } from "@/components/ui/Container";
import { ADD_ONS, formatPrice } from "@/lib/packages";
import { PackagesGrid } from "@/components/packages/PackagesGrid";

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;

  return (
    <Container className="py-12">
      <div id="packages" className="max-w-3xl">
        <h1 className="heading text-5xl leading-[0.95]">Packages & Booking</h1>
        <p className="mt-3 text-base text-muted">
          Choose your package below. Then book a time that works for you.
        </p>
      </div>

      <div className="mt-10">
        <PackagesGrid />
      </div>

      <section className="mt-10 rounded-2xl border-2 border-border bg-surface p-6">
        <h2 className="heading text-3xl">ADD-ONS</h2>
        <p className="mt-2 text-sm text-muted">
          Add-ons are optional and depend on vehicle condition.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {ADD_ONS.map((a) => (
            <div
              key={a.name}
              className="flex items-center justify-between rounded-xl border-2 border-border bg-white p-4"
            >
              <div className="font-medium">{a.name}</div>
              <div className="text-muted">+{formatPrice(a.price)}</div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}

