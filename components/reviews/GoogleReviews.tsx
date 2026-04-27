import { Container } from "@/components/ui/Container";

type ReviewsPayload = {
  ok: boolean;
  business?: { name: string; rating: number; total: number };
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    relative_time_description?: string;
    time?: number;
  }>;
};

export async function GoogleReviews() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  let data: ReviewsPayload = { ok: true, reviews: [] };

  if (key && placeId) {
    type PlacesResponse = {
      result?: {
        name?: string;
        rating?: number;
        user_ratings_total?: number;
        reviews?: ReviewsPayload["reviews"];
      };
      status?: string;
      error_message?: string;
    };

    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "name,rating,user_ratings_total,reviews");
    url.searchParams.set("reviews_sort", "newest");
    url.searchParams.set("key", key);

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    const json = (await res.json()) as PlacesResponse;

    if (res.ok && json?.status === "OK") {
      const all = json?.result?.reviews ?? [];
      data = {
        ok: true,
        business: {
          name: json?.result?.name ?? "Revelation Auto Detailing",
          rating: json?.result?.rating ?? 5,
          total: json?.result?.user_ratings_total ?? 0,
        },
        reviews: (all ?? []).filter((r) => r.rating === 5).slice(0, 8),
      };
    } else {
      data = { ok: false, reviews: [] };
    }
  }

  const reviews = (data.ok ? data.reviews ?? [] : []).slice(0, 8);

  return (
    <section className="border-t-2 border-border bg-surface">
      <Container className="py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="heading text-3xl">5-star Google Reviews</h2>
            <p className="mt-2 text-sm text-muted">
              Real feedback from local drivers. Updated daily.
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-8 rounded-2xl border-2 border-border bg-white p-6 text-sm text-muted">
            Reviews will appear here once Google Places is connected.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, idx) => (
              <div
                key={`${r.author_name}-${idx}`}
                className="rounded-2xl border-2 border-border bg-white p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{r.author_name}</div>
                  <div className="text-sm text-muted">★★★★★</div>
                </div>
                <p className="mt-3 text-sm text-muted">{r.text}</p>
                <div className="mt-3 text-xs text-muted">
                  {r.relative_time_description ?? ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

