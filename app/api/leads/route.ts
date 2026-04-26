import { NextResponse } from "next/server";
import { z } from "zod";
import { PACKAGES } from "@/lib/packages";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendLeadEmails } from "@/lib/email";

const LeadInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email(),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  vehicleYear: z.string().min(2),
  packageId: z.string().min(1),
  preferredDate: z.string().min(1),
  referralSource: z.string().min(1),
  message: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
  landingPath: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = LeadInputSchema.parse(json);
    const pkg = PACKAGES.find((p) => p.id === input.packageId);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        status: "New",
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
        email: input.email,
        vehicle_make: input.vehicleMake,
        vehicle_model: input.vehicleModel,
        vehicle_year: input.vehicleYear,
        package_id: input.packageId,
        preferred_date: input.preferredDate,
        referral_source: input.referralSource,
        message: input.message ?? null,
        utm_source: input.utm?.source ?? null,
        utm_medium: input.utm?.medium ?? null,
        utm_campaign: input.utm?.campaign ?? null,
        utm_term: input.utm?.term ?? null,
        utm_content: input.utm?.content ?? null,
        landing_path: input.landingPath ?? null,
      })
      .select("id")
      .single();

    if (error) throw error;

    const ownerEmail = process.env.OWNER_EMAIL;
    const fromEmail = process.env.FROM_EMAIL;
    if (!ownerEmail || !fromEmail) {
      throw new Error("Missing OWNER_EMAIL or FROM_EMAIL.");
    }

    const subject = pkg ? `${pkg.name} (${pkg.priceLabel})` : `Package ${input.packageId}`;
    const customerName = `${input.firstName} ${input.lastName}`.trim();

    await sendLeadEmails({
      toCustomer: input.email,
      customerName,
      ownerEmail,
      fromEmail,
      subject,
      textCustomer: `Thanks ${customerName} — we received your request.\n\nPackage: ${subject}\nPreferred date: ${input.preferredDate}\nVehicle: ${input.vehicleYear} ${input.vehicleMake} ${input.vehicleModel}\n\nWe’ll reach out shortly to confirm and schedule.\n`,
      textOwner:
        `New lead (${data.id})\n\n` +
        `Name: ${customerName}\n` +
        `Phone: ${input.phone}\n` +
        `Email: ${input.email}\n` +
        `Vehicle: ${input.vehicleYear} ${input.vehicleMake} ${input.vehicleModel}\n` +
        `Package: ${subject}\n` +
        `Preferred date: ${input.preferredDate}\n` +
        `Heard about us: ${input.referralSource}\n` +
        `Message: ${input.message ?? "(none)"}\n\n` +
        `UTM: ${JSON.stringify(input.utm ?? {}, null, 2)}\n` +
        `Landing: ${input.landingPath ?? ""}\n`,
    });

    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

