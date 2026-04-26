import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { adminCookieName, expectedAdminToken } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const BodySchema = z.object({
  status: z.enum(["New", "Contacted", "Booked", "Completed", "No-show"]),
});

async function assertAdmin() {
  const store = await cookies();
  const token = store.get(adminCookieName())?.value;
  if (!token || token !== expectedAdminToken()) {
    return false;
  }
  return true;
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("leads").update({ status: parsed.data.status }).eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

