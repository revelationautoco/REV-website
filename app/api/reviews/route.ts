import { NextResponse } from "next/server";
import type { GoogleReview } from "@/types/review";

export const revalidate = 86400; // 24h

type PlacesResponse = {
  result?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: Array<{
      author_name: string;
      rating: number;
      text: string;
      time?: number;
      relative_time_description?: string;
    }>;
  };
  status?: string;
  error_message?: string;
};

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!key || !placeId) {
    return NextResponse.json({
      ok: true,
      business: { name: "Revelation Auto Detailing", rating: 5, total: 0 },
      reviews: [] satisfies GoogleReview[],
      note: "Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID to enable live reviews.",
    });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,rating,user_ratings_total,reviews");
  url.searchParams.set("reviews_sort", "newest");
  url.searchParams.set("key", key);

  const res = await fetch(url.toString(), { next: { revalidate } });
  const json = (await res.json()) as PlacesResponse;

  if (!res.ok || json.status !== "OK") {
    return NextResponse.json(
      { ok: false, error: json.error_message ?? json.status ?? "Places API error" },
      { status: 500 },
    );
  }

  const all = (json.result?.reviews ?? []) as GoogleReview[];
  const reviews = all.filter((r) => r.rating === 5).slice(0, 8);

  return NextResponse.json({
    ok: true,
    business: {
      name: json.result?.name ?? "Revelation Auto Detailing",
      rating: json.result?.rating ?? 5,
      total: json.result?.user_ratings_total ?? 0,
    },
    reviews,
  });
}

