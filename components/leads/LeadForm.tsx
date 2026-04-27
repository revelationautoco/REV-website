"use client";

import type { ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { formatPrice, PACKAGES } from "@/lib/packages";

type Props = {
  defaultPackageId?: string;
  className?: string;
  compact?: boolean;
};

export function LeadForm({ defaultPackageId, className, compact }: Props) {
  const pathname = usePathname();
  const search = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const utm = useMemo(() => {
    const get = (k: string) => search.get(k) ?? undefined;
    return {
      source: get("utm_source"),
      medium: get("utm_medium"),
      campaign: get("utm_campaign"),
      term: get("utm_term"),
      content: get("utm_content"),
    };
  }, [search]);

  const packages = PACKAGES;
  const initialPackage = defaultPackageId ?? packages.find((p) => p.popular)?.id ?? packages[0]?.id;

  async function onSubmit(formData: FormData) {
    setStatus("idle");
    setError(null);

    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      vehicleMake: String(formData.get("vehicleMake") ?? ""),
      vehicleModel: String(formData.get("vehicleModel") ?? ""),
      vehicleYear: String(formData.get("vehicleYear") ?? ""),
      packageId: String(formData.get("packageId") ?? ""),
      preferredDate: String(formData.get("preferredDate") ?? ""),
      referralSource: String(formData.get("referralSource") ?? ""),
      message: String(formData.get("message") ?? ""),
      utm,
      landingPath: pathname + (search.size ? `?${search.toString()}` : ""),
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { ok: boolean; error?: string };
        if (!res.ok || !data.ok) throw new Error(data.error ?? "Submission failed.");

        track({ name: "lead_submit", params: { packageId: payload.packageId } });
        setStatus("success");
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  return (
    <form
      action={onSubmit}
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 md:p-6",
        className,
      )}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="heading text-2xl">Request a booking</div>
          <p className="mt-1 text-sm text-muted">
            Tell us about your vehicle. We’ll confirm pricing and availability.
          </p>
        </div>
      </div>

      <div className={cn("mt-5 grid gap-4", compact ? "md:grid-cols-2" : "md:grid-cols-3")}>
        <Field label="First name">
          <input name="firstName" required className={inputClass} />
        </Field>
        <Field label="Last name">
          <input name="lastName" required className={inputClass} />
        </Field>
        <Field label="Phone">
          <input name="phone" required className={inputClass} inputMode="tel" />
        </Field>
        <Field label="Email">
          <input name="email" required className={inputClass} inputMode="email" />
        </Field>
        <Field label="Vehicle year">
          <input name="vehicleYear" required className={inputClass} placeholder="2020" />
        </Field>
        <Field label="Make">
          <input name="vehicleMake" required className={inputClass} placeholder="Toyota" />
        </Field>
        <Field label="Model">
          <input name="vehicleModel" required className={inputClass} placeholder="Camry" />
        </Field>
        <Field label="Package">
          <select name="packageId" required className={inputClass} defaultValue={initialPackage}>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.prices?.length
                  ? `${p.name} — Sedan/Small SUV ${formatPrice(p.prices[0].price)} • Large SUV/Truck ${formatPrice(p.prices[1].price)}`
                  : `${p.name} — ${p.pricingLabel ?? "Custom Quote"}`}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred date">
          <input name="preferredDate" required className={inputClass} type="date" />
        </Field>
        <Field label="How did you hear about us?">
          <select name="referralSource" required className={inputClass}>
            <option value="">Select…</option>
            <option value="Google">Google</option>
            <option value="Facebook/Instagram">Facebook / Instagram</option>
            <option value="Referral">Referral</option>
            <option value="Repeat customer">Repeat customer</option>
            <option value="Other">Other</option>
          </select>
        </Field>
      </div>

      <div className="mt-4">
        <label className="text-sm text-muted">Notes (optional)</label>
        <textarea name="message" className={cn(inputClass, "mt-1 min-h-24")} />
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm">
          {status === "success" ? (
            <span className="text-emerald-300">Submitted. We’ll reach out shortly.</span>
          ) : status === "error" ? (
            <span className="text-rose-300">{error ?? "Submission failed."}</span>
          ) : (
            <span className="text-muted">
              Prefer to call?{" "}
              <a className="text-foreground" href="tel:+15555555555">
                (555) 555-5555
              </a>
            </span>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={pending}>
          {pending ? "Submitting…" : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background/40 px-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:ring-2 focus:ring-accent/50";

