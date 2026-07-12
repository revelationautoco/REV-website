import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { PACKAGES, ADD_ONS, formatPrice, getPackagePrice } from "@/lib/packages";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const BookingSchema = z.object({
  vehicleSize: z.enum(["sedan-small", "large-suv-truck"]),
  vehicleYear: z
    .string()
    .min(4)
    .max(4)
    .regex(/^\d{4}$/),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  packageId: z.enum(["bronze-exterior", "interior", "silver", "gold"]),
  addOns: z.array(z.string()).optional().default([]),
  date: z.string().min(1),
  time: z.string().min(1),
  fullName: z.string().min(1),
  phone: z
    .string()
    .min(7)
    .regex(/^\+?[\d\s\-(). ]{7,}$/),
  email: z.string().email(),
  address: z.string().min(1),
  notes: z.string().optional(),
});

type BookingInput = z.infer<typeof BookingSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Converts a display time slot ("9:00 AM", "1:30 PM") to "HH:MM" for the DB. */
function timeSlotToHHMM(slot: string): string {
  const [time, period] = slot.split(" ");
  const [h, m] = time.split(":");
  let hour = parseInt(h, 10);
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${m}`;
}

function buildEmailText(data: BookingInput): string {
  const pkg = PACKAGES.find((p) => p.id === data.packageId);
  const pkgPrice = pkg ? getPackagePrice(pkg, data.vehicleSize) : null;

  const vehicleSizeLabel =
    data.vehicleSize === "sedan-small"
      ? "Sedan / Small SUV"
      : "Large SUV / Truck / Van";

  const addOnLines =
    data.addOns && data.addOns.length > 0
      ? data.addOns
          .map((id) => {
            const addon = ADD_ONS.find((a) => a.id === id);
            return addon ? `  • ${addon.name} (+${addon.priceLabel})` : null;
          })
          .filter(Boolean)
          .join("\n")
      : "  None";

  const addOnsTotal = (data.addOns ?? []).reduce((sum, id) => {
    const addon = ADD_ONS.find((a) => a.id === id);
    return sum + (addon?.priceLow ?? 0);
  }, 0);
  const estimatedTotal = pkgPrice !== null ? pkgPrice + addOnsTotal : null;
  const hasRangeAddOns = (data.addOns ?? []).some((id) => {
    const addon = ADD_ONS.find((a) => a.id === id);
    return addon?.priceHigh !== undefined;
  });

  return `
NEW BOOKING REQUEST — Revelation Auto Detailing
================================================

VEHICLE
  ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}
  Size: ${vehicleSizeLabel}

PACKAGE
  ${pkg?.name ?? data.packageId}${pkgPrice !== null ? ` — ${formatPrice(pkgPrice)}` : ""}

ADD-ONS
${addOnLines}

APPOINTMENT
  Date: ${data.date}
  Time: ${data.time}

CONTACT
  Name:    ${data.fullName}
  Phone:   ${data.phone}
  Email:   ${data.email}
  Address: ${data.address}

NOTES
  ${data.notes?.trim() || "None"}

${
  estimatedTotal !== null
    ? `ESTIMATED TOTAL: ${hasRangeAddOns ? "Starting at " : ""}${formatPrice(estimatedTotal)}${hasRangeAddOns ? " (some add-ons are range-priced)" : ""}`
    : ""
}

--
This request was submitted via the booking form at revelationauto.com
`.trim();
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Validate
  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Validation failed.";
    return NextResponse.json({ error: firstError }, { status: 422 });
  }

  const data = parsed.data;
  const requestedTime = timeSlotToHHMM(data.time);

  // ── Server-side conflict check + DB insert ───────────────────────────────
  // Wrapping in try/catch so a Supabase outage never silently breaks booking.
  try {
    console.log("[booking] Attempting Supabase init, URL:", process.env.SUPABASE_URL?.slice(0, 30));
    const supabase = getSupabaseAdmin();

    // Re-check for conflicts (client-side check may be stale)
    const { data: existing, error: checkErr } = await supabase
      .from("bookings")
      .select("id")
      .eq("requested_date", data.date)
      .eq("requested_time", requestedTime)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (checkErr) throw checkErr;

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please choose a different time." },
        { status: 409 },
      );
    }

    // Build add-ons payload for the jsonb column
    const addonsData = (data.addOns ?? [])
      .map((id) => {
        const addon = ADD_ONS.find((a) => a.id === id);
        return addon ? { id, name: addon.name, priceLabel: addon.priceLabel } : null;
      })
      .filter(Boolean);

    const pkg = PACKAGES.find((p) => p.id === data.packageId);
    const pkgPrice = pkg ? getPackagePrice(pkg, data.vehicleSize) : null;
    const addonsTotal = (data.addOns ?? []).reduce((sum, id) => {
      const addon = ADD_ONS.find((a) => a.id === id);
      return sum + (addon?.priceLow ?? 0);
    }, 0);

    const { error: insertErr } = await supabase.from("bookings").insert({
      requested_date: data.date,
      requested_time: requestedTime,
      vehicle_size: data.vehicleSize,
      vehicle_year: data.vehicleYear,
      vehicle_make: data.vehicleMake,
      vehicle_model: data.vehicleModel,
      package_id: data.packageId,
      package_name: pkg?.name ?? data.packageId,
      addons: addonsData,
      estimated_total: pkgPrice !== null ? pkgPrice + addonsTotal : null,
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      notes: data.notes ?? null,
      status: "pending",
    });

    if (insertErr) {
      // Unique constraint violation = race condition: another request won the slot
      if (insertErr.code === "23505") {
        return NextResponse.json(
          { error: "This time slot was just booked. Please choose a different time." },
          { status: 409 },
        );
      }
      // Any other DB error: log it but continue to email so the customer isn't blocked
      console.error("[booking] Supabase insert error:", insertErr);
    }
  } catch (dbErr) {
    console.error("[booking] Supabase unavailable, continuing without DB:", dbErr);
  }

  // Send email
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY — booking email not sent.");
    return NextResponse.json(
      { error: "Server configuration error. Please call us directly." },
      { status: 500 },
    );
  }

  const ownerEmail = process.env.OWNER_EMAIL ?? "revelationauto.co@gmail.com";
  const fromEmail =
    process.env.FROM_EMAIL ?? "REV Detailing <no-reply@revelationauto.com>";

  // DEBUG — remove after confirming email works
  console.log("[booking] FROM_EMAIL env:", process.env.FROM_EMAIL);
  console.log("[booking] using fromEmail:", fromEmail);
  console.log("[booking] using ownerEmail:", ownerEmail);

  const resend = new Resend(apiKey);
  const { data: sendData, error } = await resend.emails.send({
    from: fromEmail,
    to: [ownerEmail],
    subject: `New Booking Request — ${data.fullName} (${data.date} @ ${data.time})`,
    text: buildEmailText(data),
  });

  if (error) {
    console.error("[booking] Resend error raw:", error);
    console.error("[booking] Resend error JSON:", JSON.stringify(error, null, 2));
    console.error("[booking] Resend error name:", (error as { name?: unknown }).name);
    console.error("[booking] Resend error message:", (error as { message?: unknown }).message);
    console.error("[booking] Resend error statusCode:", (error as { statusCode?: unknown }).statusCode);
    return NextResponse.json(
      { error: "Could not send booking request. Please try again." },
      { status: 500 },
    );
  }

  console.log("[booking] Resend success, email id:", sendData?.id);

  return NextResponse.json({ ok: true }, { status: 200 });
}
