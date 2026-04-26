import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { adminCookieName, expectedAdminToken } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const QuerySchema = z.object({
  status: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

async function assertAdmin() {
  const store = await cookies();
  const token = store.get(adminCookieName())?.value;
  if (!token || token !== expectedAdminToken()) {
    return false;
  }
  return true;
}

export async function GET(req: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    status: url.searchParams.get("status") ?? undefined,
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid query" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  let q = supabase
    .from("leads")
    .select(
      "id,created_at,status,first_name,last_name,phone,email,vehicle_make,vehicle_model,vehicle_year,package_id,preferred_date,referral_source,message",
    )
    .order("created_at", { ascending: false });

  if (parsed.data.status && parsed.data.status !== "All") {
    q = q.eq("status", parsed.data.status);
  }
  if (parsed.data.from) q = q.gte("created_at", parsed.data.from);
  if (parsed.data.to) q = q.lte("created_at", parsed.data.to);

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, leads: data ?? [] });
}

