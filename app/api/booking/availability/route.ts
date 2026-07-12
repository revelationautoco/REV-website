import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * GET /api/booking/availability?date=YYYY-MM-DD&time=HH:MM
 *
 * Returns { available: boolean }.
 * Fails open (returns available: true) if Supabase is unreachable so that
 * a database hiccup never silently blocks customers from booking.
 * The server-side check in /api/booking/route.ts is the authoritative gate.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  // Validate param shapes before hitting the DB
  if (
    !date ||
    !time ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^\d{2}:\d{2}$/.test(time)
  ) {
    return NextResponse.json({ available: true });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("requested_date", date)
      .eq("requested_time", time)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ available: data.length === 0 });
  } catch {
    // Fail open — the POST route re-checks authoritatively
    return NextResponse.json({ available: true });
  }
}
