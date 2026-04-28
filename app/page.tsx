import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { formatPrice, PACKAGES } from "@/lib/packages";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GoogleReviews } from "@/components/reviews/GoogleReviews";
import { HomeFinalCtas, HomeHeroCtas } from "@/components/home/HomeCtas";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/gallery/GMC-TERRAIN.JPG"
            alt="Detailed GMC Terrain"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <Container className="py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm text-muted">
                MOBILE DETAILING • WE COME TO YOUR HOME OR BUSINESS
              </p>
              <h1 className="heading mt-3 text-5xl leading-[0.95] md:text-6xl">
                Showroom-clean results.
                <br />
                Driveway convenience.
              </h1>
              <p className="mt-5 max-w-lg text-base text-muted md:text-lg">
                Complete vehicle care—with premium washes, deep interior cleaning, and
                lasting protection—built around your schedule.
              </p>

              <HomeHeroCtas />

              <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border-2 border-border bg-surface p-4 sm:grid-cols-3">
                <Stat label="" value="6+ Years of Experience" />
                <Stat label="Average rating" value="5.0★" />
                <Stat label="Service area" value="10-30 MI" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="services" className="border-t-2 border-border bg-surface">
        <Container className="py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="heading text-3xl">Packages built for your car</h2>
              <p className="mt-2 text-sm text-muted">
                Clear pricing. Simple booking. Upsells only when it makes sense.
              </p>
            </div>
            <Link className="hidden text-sm text-muted hover:text-foreground md:block" href="/packages">
              See all packages →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PACKAGES.map((p) => (
              <Link
                key={p.id}
                href={`/packages?package=${p.id}#book`}
                className="group rounded-2xl border-2 border-border bg-white p-6 transition hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="heading text-2xl">{p.name}</div>
                  </div>
                  <div className="text-right text-sm">
                    {p.prices?.length ? (
                      <>
                        <div className="text-muted">
                          Sedan/Small SUV:{" "}
                          <span className="font-medium text-foreground">
                            {formatPrice(p.prices[0].price)}
                          </span>
                        </div>
                        <div className="text-muted">
                          Large SUV/Truck:{" "}
                          <span className="font-medium text-foreground">
                            {formatPrice(p.prices[1].price)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="font-bold text-accent">Custom Quote</div>
                    )}
                  </div>
                </div>
                <ul className="mt-4 grid gap-2 text-sm text-muted">
                  {p.includes.slice(0, 4).map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 text-sm font-medium text-foreground underline-offset-4 group-hover:underline decoration-foreground">
                  Book this package →
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t-2 border-border bg-background">
        <Container className="py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="heading text-3xl">Before / After</h2>
              <p className="mt-2 text-sm text-muted">
                Tap any photo to view full-size.
              </p>
            </div>
            <Link className="hidden text-sm text-muted hover:text-foreground md:block" href="/gallery">
              View full gallery →
            </Link>
          </div>
          <div className="mt-8">
            <GalleryGrid />
          </div>
        </Container>
      </section>

      <GoogleReviews />

      <section className="border-t-2 border-border bg-background">
        <Container className="py-14">
          <div className="rounded-3xl border-2 border-border bg-surface p-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="heading text-4xl leading-[0.95]">
                  Ready for a clean you can feel?
                </h2>
                <p className="mt-3 text-sm text-muted">
                  Choose a package and submit your details. We’ll confirm pricing,
                  arrival window, and any add-ons (pet hair, heavy soil, etc.).
                </p>
              </div>
              <HomeFinalCtas />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const isLongValue = label === "";
  return (
    <div className="flex min-h-20 flex-col justify-center rounded-xl border-2 border-border bg-white p-3">
      <div
        className={
          isLongValue
            ? "heading text-lg font-bold leading-snug text-foreground md:text-xl"
            : "heading text-xl font-bold leading-snug text-foreground md:text-2xl"
        }
      >
        {value}
      </div>
      {label ? <div className="mt-1 text-xs text-muted">{label}</div> : null}
    </div>
  );
}
