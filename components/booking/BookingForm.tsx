"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
  PACKAGES,
  ADD_ONS,
  formatPrice,
  getPackagePrice,
  getPackageDuration,
  URL_PARAM_TO_PACKAGE_ID,
} from "@/lib/packages";
import { cn } from "@/lib/cn";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const bookingSchema = z.object({
  vehicleSize: z.enum(["sedan-small", "large-suv-truck"], {
    message: "Please select a vehicle size",
  }),
  vehicleYear: z
    .string()
    .min(4, "Enter a valid 4-digit year")
    .max(4, "Enter a valid 4-digit year")
    .regex(/^\d{4}$/, "Year must be 4 digits"),
  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  packageId: z.enum(["bronze-exterior", "interior", "silver", "gold"], {
    message: "Please select a package",
  }),
  addOns: z.array(z.string()).optional().default([]),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .regex(/^\+?[\d\s\-(). ]{7,}$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  address: z.string().min(1, "Service address is required"),
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// Custom resolver — zodResolver from @hookform/resolvers throws with Zod v4
const zodV4Resolver: Resolver<BookingFormData> = async (values) => {
  const result = bookingSchema.safeParse(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  const errors: Record<string, { type: string; message: string }> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (path && !errors[path]) {
      errors[path] = { type: issue.code, message: issue.message };
    }
  }
  // react-hook-form requires values:{} (Record<string,never>) in the error case
  return { values: {} as never, errors };
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BOOKING_PACKAGES = PACKAGES.filter(
  (p) =>
    p.id === "bronze-exterior" ||
    p.id === "interior" ||
    p.id === "silver" ||
    p.id === "gold",
);

const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === 18 && min > 0) break;
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour > 12 ? hour - 12 : hour;
      const displayMin = min === 0 ? "00" : "30";
      slots.push(`${displayHour}:${displayMin} ${period}`);
    }
  }
  return slots;
})();

const inputClass =
  "w-full rounded-xl border-2 border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none transition";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BookingForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const packageParam = searchParams.get("package") ?? "";
  const defaultPackageId =
    URL_PARAM_TO_PACKAGE_ID[packageParam] ?? undefined;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodV4Resolver,
    defaultValues: {
      packageId: defaultPackageId,
      addOns: [],
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      date: "",
      time: "",
    },
  });

  const watchAll = watch();

  const selectedPkg = BOOKING_PACKAGES.find((p) => p.id === watchAll.packageId);
  const packagePrice =
    selectedPkg && watchAll.vehicleSize
      ? getPackagePrice(selectedPkg, watchAll.vehicleSize)
      : null;
  const duration =
    selectedPkg && watchAll.vehicleSize
      ? getPackageDuration(selectedPkg, watchAll.vehicleSize)
      : null;

  const selectedAddOns = watchAll.addOns ?? [];
  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const addon = ADD_ONS.find((a) => a.id === id);
    return sum + (addon?.priceLow ?? 0);
  }, 0);
  const estimatedTotal =
    packagePrice !== null ? packagePrice + addOnsTotal : null;
  const hasRangeAddOns = selectedAddOns.some((id) => {
    const addon = ADD_ONS.find((a) => a.id === id);
    return addon?.priceHigh !== undefined;
  });

  const showSummary =
    !!watchAll.vehicleSize || !!watchAll.packageId;

  const onSubmit = async (data: BookingFormData) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(json?.error ?? "Something went wrong. Please try again.");
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  // ---------------------------------------------------------------------------
  // Confirmation screen
  // ---------------------------------------------------------------------------

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent text-3xl font-bold">
          ✓
        </div>
        <h2 className="heading text-3xl">Request Received!</h2>
        <p className="mt-3 max-w-sm text-muted">
          We'll text or call you within 24 hours to confirm your appointment.
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------------------

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-2">
      {/* ── 1. Vehicle Size ─────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Vehicle Size</SectionLabel>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          {(["sedan-small", "large-suv-truck"] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setValue("vehicleSize", size)}
              className={cn(
                "flex-1 rounded-xl border-2 px-5 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-accent/40",
                watchAll.vehicleSize === size
                  ? "border-accent bg-accent/10"
                  : "border-border bg-white hover:border-accent/50",
              )}
            >
              <div className="text-sm font-semibold">
                {size === "sedan-small"
                  ? "Sedan / Small SUV"
                  : "Large SUV / Truck / Van"}
              </div>
              <div className="mt-0.5 text-xs text-muted">
                {size === "sedan-small"
                  ? "Sedans, coupes, small & mid-size crossovers"
                  : "Full-size SUVs, pickup trucks, minivans"}
              </div>
            </button>
          ))}
        </div>
        <FieldError message={errors.vehicleSize?.message} />
      </section>

      {/* ── 2. Vehicle Details ─────────────────────────────────────────── */}
      <section>
        <SectionLabel>Vehicle Details</SectionLabel>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <FieldLabel required>Year</FieldLabel>
            <input
              {...register("vehicleYear")}
              placeholder="2020"
              maxLength={4}
              inputMode="numeric"
              className={inputClass}
            />
            <FieldError message={errors.vehicleYear?.message} />
          </div>
          <div>
            <FieldLabel required>Make</FieldLabel>
            <input
              {...register("vehicleMake")}
              placeholder="Toyota"
              className={inputClass}
            />
            <FieldError message={errors.vehicleMake?.message} />
          </div>
          <div>
            <FieldLabel required>Model</FieldLabel>
            <input
              {...register("vehicleModel")}
              placeholder="Camry"
              className={inputClass}
            />
            <FieldError message={errors.vehicleModel?.message} />
          </div>
        </div>
      </section>

      {/* ── 3. Package Selection ───────────────────────────────────────── */}
      <section>
        <SectionLabel>Select a Package</SectionLabel>
        {!watchAll.vehicleSize && (
          <p className="mt-1 text-xs text-muted">
            Select a vehicle size above to see pricing.
          </p>
        )}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {BOOKING_PACKAGES.map((pkg) => {
            const price = watchAll.vehicleSize
              ? getPackagePrice(pkg, watchAll.vehicleSize)
              : null;
            const isSelected = watchAll.packageId === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() =>
                  setValue("packageId", pkg.id as BookingFormData["packageId"])
                }
                className={cn(
                  "rounded-xl border-2 px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-accent/40",
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-border bg-white hover:border-accent/50",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold leading-tight">
                    {pkg.name}
                  </span>
                  {price !== null ? (
                    <span className="shrink-0 font-bold text-accent">
                      {formatPrice(price)}
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-muted">
                      {watchAll.vehicleSize ? "—" : "Select size"}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                  {pkg.description}
                </p>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.packageId?.message} />
      </section>

      {/* ── 4. Add-Ons ─────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Add-Ons</SectionLabel>
        <p className="mt-1 text-xs text-muted">
          Optional — added to your service at time of booking.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {ADD_ONS.map((addon) => {
            const isChecked = selectedAddOns.includes(addon.id);
            return (
              <label
                key={addon.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 transition",
                  isChecked
                    ? "border-accent bg-accent/5"
                    : "border-border bg-white hover:border-accent/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    value={addon.id}
                    {...register("addOns")}
                    className="h-4 w-4 cursor-pointer rounded accent-[#FF6B00]"
                  />
                  <span className="text-sm font-medium">{addon.name}</span>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  +{addon.priceLabel}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* ── 5. Date & Time ─────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Preferred Date & Time</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Date</FieldLabel>
            <input
              type="date"
              min={minDate}
              {...register("date")}
              className={inputClass}
            />
            <FieldError message={errors.date?.message} />
          </div>
          <div>
            <FieldLabel required>Time</FieldLabel>
            <select {...register("time")} className={inputClass}>
              <option value="">Select a time…</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <FieldError message={errors.time?.message} />
          </div>
        </div>
      </section>

      {/* ── 6. Contact Info ────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Contact Info</SectionLabel>
        <div className="mt-3 grid gap-3">
          <div>
            <FieldLabel required>Full Name</FieldLabel>
            <input
              {...register("fullName")}
              placeholder="Jane Doe"
              className={inputClass}
            />
            <FieldError message={errors.fullName?.message} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel required>Phone Number</FieldLabel>
              <input
                {...register("phone")}
                type="tel"
                placeholder="(555) 555-5555"
                className={inputClass}
              />
              <FieldError message={errors.phone?.message} />
            </div>
            <div>
              <FieldLabel required>Email</FieldLabel>
              <input
                {...register("email")}
                type="email"
                placeholder="jane@example.com"
                className={inputClass}
              />
              <FieldError message={errors.email?.message} />
            </div>
          </div>
          <div>
            <FieldLabel required>Service Address (Home or Business)</FieldLabel>
            <input
              {...register("address")}
              placeholder="123 Main St, City, State ZIP"
              className={inputClass}
            />
            <FieldError message={errors.address?.message} />
          </div>
        </div>
      </section>

      {/* ── 7. Notes ───────────────────────────────────────────────────── */}
      <section>
        <FieldLabel>Additional Notes</FieldLabel>
        <textarea
          {...register("notes")}
          placeholder="Anything we should know? (gate code, pets, specific stains, etc.)"
          rows={3}
          className={cn(inputClass, "mt-1 resize-none")}
        />
      </section>

      {/* ── 8. Live Summary ────────────────────────────────────────────── */}
      {showSummary && (
        <section className="rounded-2xl border-2 border-border bg-surface p-5">
          <h2 className="heading text-2xl">Booking Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            {(watchAll.vehicleYear ||
              watchAll.vehicleMake ||
              watchAll.vehicleModel ||
              watchAll.vehicleSize) && (
              <SummaryRow
                label="Vehicle"
                value={[
                  [watchAll.vehicleYear, watchAll.vehicleMake, watchAll.vehicleModel]
                    .filter(Boolean)
                    .join(" ") || null,
                  watchAll.vehicleSize
                    ? watchAll.vehicleSize === "sedan-small"
                      ? "Sedan / Small SUV"
                      : "Large SUV / Truck / Van"
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            )}
            {selectedPkg && (
              <SummaryRow
                label="Package"
                value={selectedPkg.name}
                accent={packagePrice !== null ? formatPrice(packagePrice) : undefined}
              />
            )}
            {selectedAddOns.length > 0 && (
              <SummaryRow
                label="Add-ons"
                value={selectedAddOns
                  .map((id) => ADD_ONS.find((a) => a.id === id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              />
            )}
            {duration && <SummaryRow label="Est. Duration" value={duration} />}
          </div>

          {estimatedTotal !== null && (
            <div className="mt-4 flex items-center justify-between border-t-2 border-border pt-4">
              <span className="font-semibold">
                Estimated Total{hasRangeAddOns ? "*" : ""}
              </span>
              <span className="text-2xl font-bold text-accent">
                {hasRangeAddOns ? "From " : ""}
                {formatPrice(estimatedTotal)}
              </span>
            </div>
          )}
          {hasRangeAddOns && (
            <p className="mt-2 text-xs text-muted">
              * Some add-on prices vary based on vehicle condition and will be
              confirmed before service begins.
            </p>
          )}
        </section>
      )}

      {/* ── Submit Error ───────────────────────────────────────────────── */}
      {submitError && (
        <div className="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* ── 9. Submit ──────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-accent py-4 text-base font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent/60 disabled:opacity-60"
      >
        {isSubmitting ? "Sending Request…" : "Request Booking"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="heading text-xl">{children}</h2>;
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1 block text-xs font-medium text-muted">
      {children}
      {required && <span className="ml-0.5 text-accent">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-muted">{label}:</span>
      <span className="text-right font-medium">
        {value}
        {accent && (
          <span className="ml-2 font-bold text-accent">{accent}</span>
        )}
      </span>
    </div>
  );
}
