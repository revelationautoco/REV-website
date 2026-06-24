"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
  IconCar,
  IconTruck,
  IconCheck,
  IconLock,
  IconX,
} from "@tabler/icons-react";
import {
  PACKAGES,
  ADD_ONS,
  formatPrice,
  getPackagePrice,
  getPackageDuration,
  URL_PARAM_TO_PACKAGE_ID,
} from "@/lib/packages";
import { cn } from "@/lib/cn";
import type { ServicePackage } from "@/types/package";

// ---------------------------------------------------------------------------
// Schema — UNCHANGED
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
  return { values: {} as never, errors };
};

// ---------------------------------------------------------------------------
// Constants — UNCHANGED
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
// Main component
// ---------------------------------------------------------------------------

export function BookingForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const packageParam = searchParams.get("package") ?? "";
  const defaultPackageId = URL_PARAM_TO_PACKAGE_ID[packageParam] ?? undefined;

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

  // Package + pricing
  const selectedPkg = BOOKING_PACKAGES.find((p) => p.id === watchAll.packageId);
  const packagePrice =
    selectedPkg && watchAll.vehicleSize
      ? getPackagePrice(selectedPkg, watchAll.vehicleSize)
      : null;
  const duration =
    selectedPkg && watchAll.vehicleSize
      ? getPackageDuration(selectedPkg, watchAll.vehicleSize)
      : null;

  // Add-ons
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

  // Labels for summary
  const vehicleSizeLabel =
    watchAll.vehicleSize === "sedan-small"
      ? "Sedan / Small SUV"
      : watchAll.vehicleSize === "large-suv-truck"
        ? "Large SUV / Truck / Van"
        : null;

  const addOnsLabel =
    selectedAddOns.length > 0
      ? `${selectedAddOns.length} add-on${selectedAddOns.length > 1 ? "s" : ""}`
      : null;

  // Step completion states
  // Step 3 (add-ons) is optional — mark answered once user starts Step 4
  const step3Answered =
    selectedAddOns.length > 0 ||
    !!(watchAll.vehicleYear || watchAll.vehicleMake || watchAll.vehicleModel);

  // Step 4 (vehicle details)
  const step4Done =
    !!watchAll.vehicleYear &&
    /^\d{4}$/.test(watchAll.vehicleYear) &&
    !!watchAll.vehicleMake &&
    !!watchAll.vehicleModel;

  const completedSteps = [
    !!watchAll.vehicleSize,    // step 1
    !!watchAll.packageId,      // step 2
    step3Answered,             // step 3
    step4Done,                 // step 4
  ].filter(Boolean).length;

  // Submit handler — UNCHANGED
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
      setIsModalOpen(false);
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
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl font-bold text-accent">
          ✓
        </div>
        <h2 className="heading text-3xl">Request Received!</h2>
        <p className="mt-3 max-w-sm text-muted">
          We'll text or call you within 24 hours to confirm your appointment.
        </p>
      </div>
    );
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ---------------------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------------------

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">

        {/* ══ LEFT COLUMN ════════════════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* ── STEP 1: Vehicle Size ──────────────────────────────────────── */}
          <StepCard step={1} label="SELECT VEHICLE" isAnswered={!!watchAll.vehicleSize}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <VehicleTile
                icon={<IconCar size={38} />}
                label="Sedan / Small SUV"
                subtitle="Sedans, coupes, small & mid crossovers"
                selected={watchAll.vehicleSize === "sedan-small"}
                onClick={() => setValue("vehicleSize", "sedan-small")}
              />
              <VehicleTile
                icon={<IconTruck size={38} />}
                label="Large SUV / Truck / Van"
                subtitle="Full-size SUVs, pickups, minivans"
                selected={watchAll.vehicleSize === "large-suv-truck"}
                onClick={() => setValue("vehicleSize", "large-suv-truck")}
              />
            </div>
            <FieldError message={errors.vehicleSize?.message} />
          </StepCard>

          {/* ── STEP 2: Package ───────────────────────────────────────────── */}
          <StepCard
            step={2}
            label="CHOOSE PACKAGE"
            isAnswered={!!watchAll.packageId}
            dimmed={!watchAll.vehicleSize}
          >
            {!watchAll.vehicleSize && (
              <p className="mb-3 text-xs text-muted">
                Select a vehicle size above to see your pricing.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {BOOKING_PACKAGES.map((pkg) => {
                const price = watchAll.vehicleSize
                  ? getPackagePrice(pkg, watchAll.vehicleSize)
                  : null;
                return (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    price={price}
                    selected={watchAll.packageId === pkg.id}
                    onSelect={() =>
                      setValue("packageId", pkg.id as BookingFormData["packageId"])
                    }
                  />
                );
              })}
            </div>
            <FieldError message={errors.packageId?.message} />
          </StepCard>

          {/* ── STEPS 3 + 4: locked until package chosen ──────────────────── */}
          {!watchAll.packageId ? (
            <>
              <LockedStep
                step={3}
                label="ADD-ONS"
                description="Optional add-ons — unlocks after package is chosen"
              />
              <LockedStep
                step={4}
                label="YOUR VEHICLE"
                description="Vehicle details — unlocks after package is chosen"
              />
            </>
          ) : (
            <>
              {/* ── STEP 3: Add-Ons ─────────────────────────────────────── */}
              <StepCard step={3} label="ADD-ONS" isAnswered={step3Answered}>
                <p className="mb-3 text-xs text-muted">
                  Optional — select any add-ons or skip to continue.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ADD_ONS.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={cn(
                          "flex cursor-pointer items-start justify-between gap-3 rounded-xl border-2 px-4 py-3 transition",
                          isChecked
                            ? "border-accent bg-accent/5"
                            : "border-border bg-white hover:border-accent/50",
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <input
                            type="checkbox"
                            value={addon.id}
                            {...register("addOns")}
                            className="h-4 w-4 cursor-pointer rounded accent-[#FF6B00]"
                          />
                          <span className="text-sm font-medium">{addon.name}</span>
                        </div>
                        <span className="text-right text-xs text-muted">
                          +{addon.priceLabel}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </StepCard>

              {/* ── STEP 4: Your Vehicle ────────────────────────────────── */}
              <StepCard step={4} label="YOUR VEHICLE" isAnswered={step4Done}>
                <div className="grid grid-cols-3 gap-3">
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
              </StepCard>

              {/* ── Book This Detail button ──────────────────────────────── */}
              <button
                type="button"
                onClick={step4Done ? openModal : undefined}
                disabled={!step4Done}
                className={cn(
                  "w-full rounded-full py-4 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent/60",
                  step4Done
                    ? "bg-accent text-white hover:brightness-110 cursor-pointer"
                    : "cursor-not-allowed bg-muted/15 text-muted",
                )}
              >
                {step4Done ? "Book This Detail →" : "Complete your vehicle details to continue"}
              </button>
            </>
          )}

          {/* ── Mobile summary bar (lg:hidden) ────────────────────────────── */}
          <div className="lg:hidden">
            <MobileSummaryBar
              vehicleSizeLabel={vehicleSizeLabel}
              pkgName={selectedPkg?.name ?? null}
              addOnsLabel={addOnsLabel}
              estimatedTotal={estimatedTotal}
              hasRangeAddOns={hasRangeAddOns}
              completedSteps={completedSteps}
              duration={duration}
              step4Done={step4Done}
              onBookClick={openModal}
            />
          </div>
        </div>

        {/* ══ RIGHT COLUMN — sticky sidebar (desktop only) ════════════════ */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <SummarySidebar
              vehicleSizeLabel={vehicleSizeLabel}
              pkgName={selectedPkg?.name ?? null}
              packagePrice={packagePrice}
              addOnsLabel={addOnsLabel}
              estimatedTotal={estimatedTotal}
              hasRangeAddOns={hasRangeAddOns}
              completedSteps={completedSteps}
              duration={duration}
              step4Done={step4Done}
              onBookClick={openModal}
            />
          </div>
        </div>
      </div>

      {/* ══ BOOKING MODAL ════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b-2 border-border bg-white px-6 py-4">
              <div>
                <h2 className="heading text-2xl">Book Your Detail</h2>
                <p className="mt-0.5 text-xs text-muted">
                  No payment required — we'll confirm by text
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="ml-4 mt-0.5 rounded-lg p-1.5 transition hover:bg-surface"
                aria-label="Close"
              >
                <IconX size={18} className="text-muted" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* ── Summary block ───────────────────────────────────────── */}
              <div className="rounded-xl border-2 border-border bg-surface p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted">
                  Booking Summary
                </p>
                <div className="space-y-2 text-sm">
                  {vehicleSizeLabel && (
                    <ModalSummaryRow
                      label="Vehicle"
                      value={
                        [watchAll.vehicleYear, watchAll.vehicleMake, watchAll.vehicleModel]
                          .filter(Boolean)
                          .join(" ") +
                        (vehicleSizeLabel ? ` · ${vehicleSizeLabel}` : "")
                      }
                    />
                  )}
                  {selectedPkg && (
                    <ModalSummaryRow
                      label="Package"
                      value={selectedPkg.name}
                      accent={packagePrice !== null ? formatPrice(packagePrice) : undefined}
                    />
                  )}
                  {selectedAddOns.length > 0 && (
                    <ModalSummaryRow
                      label="Add-ons"
                      value={selectedAddOns
                        .map((id) => ADD_ONS.find((a) => a.id === id)?.name)
                        .filter(Boolean)
                        .join(", ")}
                    />
                  )}
                  {duration && <ModalSummaryRow label="Est. time" value={duration} />}
                </div>
                {estimatedTotal !== null && (
                  <div className="mt-3 flex items-center justify-between border-t-2 border-border pt-3">
                    <span className="text-xs font-semibold text-muted">
                      Estimated Total{hasRangeAddOns ? "*" : ""}
                    </span>
                    <span className="text-xl font-bold text-accent">
                      {hasRangeAddOns ? "From " : ""}
                      {formatPrice(estimatedTotal)}
                    </span>
                  </div>
                )}
                {hasRangeAddOns && (
                  <p className="mt-1.5 text-[10px] text-muted">
                    * Some add-on prices confirmed at time of service.
                  </p>
                )}
              </div>

              {/* ── Date & Time ─────────────────────────────────────────── */}
              <div>
                <SubSectionLabel>Preferred Date & Time</SubSectionLabel>
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
              </div>

              {/* ── Contact Info ────────────────────────────────────────── */}
              <div className="border-t border-border pt-6">
                <SubSectionLabel>Contact Info</SubSectionLabel>
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
                  <div className="grid grid-cols-2 gap-3">
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
              </div>

              {/* ── Notes ───────────────────────────────────────────────── */}
              <div className="border-t border-border pt-6">
                <FieldLabel>Additional Notes</FieldLabel>
                <textarea
                  {...register("notes")}
                  placeholder="Anything we should know? (gate code, pets, specific stains, etc.)"
                  rows={3}
                  className={cn(inputClass, "mt-1 resize-none")}
                />
              </div>

              {/* ── Submit error ─────────────────────────────────────────── */}
              {submitError && (
                <div className="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              {/* ── Submit button ────────────────────────────────────────── */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-accent py-4 text-base font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent/60 disabled:opacity-60"
              >
                {isSubmitting ? "Sending Request…" : "Request Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step card wrapper
// ---------------------------------------------------------------------------

function StepCard({
  step,
  label,
  isAnswered,
  dimmed,
  children,
}: {
  step: number;
  label: string;
  isAnswered?: boolean;
  dimmed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-border">
      <div className="flex items-center justify-between bg-foreground px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {step}
          </div>
          <span className="heading text-sm tracking-widest text-white">{label}</span>
        </div>
        {isAnswered && (
          <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
            <IconCheck size={11} strokeWidth={3} />
            Selected
          </span>
        )}
      </div>
      <div
        className={cn(
          "bg-surface p-5 transition-opacity duration-300",
          dimmed && "opacity-50",
        )}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Locked step placeholder
// ---------------------------------------------------------------------------

function LockedStep({
  step,
  label,
  description,
}: {
  step: number;
  label: string;
  description: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-dashed border-border/50">
      <div className="flex items-center justify-between bg-foreground/5 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/20 text-sm font-bold text-muted">
            {step}
          </div>
          <span className="heading text-sm tracking-widest text-muted">{label}</span>
        </div>
        <IconLock size={15} className="text-muted/50" />
      </div>
      <div className="bg-surface px-5 py-4">
        <p className="text-sm text-muted/60">{description}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vehicle tile
// ---------------------------------------------------------------------------

function VehicleTile({
  icon,
  label,
  subtitle,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-1 flex-col items-center gap-3 rounded-xl border-2 px-6 py-6 text-center transition focus:outline-none focus:ring-2 focus:ring-accent/40",
        selected
          ? "border-foreground bg-foreground text-white"
          : "border-border bg-white text-foreground hover:border-foreground/50",
      )}
    >
      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
          <IconCheck size={11} strokeWidth={3} className="text-white" />
        </div>
      )}
      <div className={cn(selected ? "text-accent" : "text-muted")}>{icon}</div>
      <div>
        <div className="text-sm font-semibold leading-tight">{label}</div>
        <div className={cn("mt-0.5 text-xs", selected ? "text-white/60" : "text-muted")}>
          {subtitle}
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Package card
// ---------------------------------------------------------------------------

function PackageCard({
  pkg,
  price,
  selected,
  onSelect,
}: {
  pkg: ServicePackage;
  price: number | null;
  selected: boolean;
  onSelect: () => void;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const closePopup = () => setIsPopupOpen(false);

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopupOpen((prev) => !prev);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative rounded-xl border-2 p-4 text-left transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40",
        selected
          ? "border-foreground bg-foreground text-white"
          : "border-border bg-white text-foreground hover:border-foreground/50",
      )}
    >
      {selected && (
        <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
          <IconCheck size={11} strokeWidth={3} className="text-white" />
        </div>
      )}
      <div
        className={cn(
          "heading text-sm leading-tight",
          selected ? "text-white" : "text-foreground",
        )}
      >
        {pkg.name}
      </div>
      <div className="mt-1.5 text-lg font-bold text-accent">
        {price !== null ? formatPrice(price) : "—"}
      </div>
      <p
        className={cn(
          "mt-1 line-clamp-2 text-xs",
          selected ? "text-white/60" : "text-muted",
        )}
      >
        {pkg.description}
      </p>

      {/* "See what's included" trigger */}
      <button
        type="button"
        onClick={handleLinkClick}
        className={cn(
          "mt-2 text-[11px] underline underline-offset-2 transition focus:outline-none",
          selected ? "text-white/50 hover:text-white/80" : "text-muted/60 hover:text-muted",
        )}
      >
        See what&apos;s included
      </button>

      {isPopupOpen && (
        <InclusionsPopup
          pkg={pkg}
          onClose={closePopup}
          onConfirm={() => { onSelect(); closePopup(); }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inclusions popup (hover tooltip on desktop, bottom-sheet modal on mobile)
// ---------------------------------------------------------------------------

function InclusionsPopup({
  pkg,
  onClose,
  onConfirm,
}: {
  pkg: ServicePackage;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel — bottom sheet on mobile, centered card on sm+ */}
      <div
        className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-sm sm:rounded-2xl"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between bg-foreground px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              What&apos;s Included
            </p>
            <h3 className="heading mt-0.5 text-xl text-white">{pkg.name}</h3>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="ml-3 mt-0.5 rounded-lg p-1.5 transition hover:bg-white/10 focus:outline-none"
            aria-label="Close"
          >
            <IconX size={16} className="text-white/70" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {pkg.description && (
            <p className="mb-4 text-sm text-muted">{pkg.description}</p>
          )}
          {pkg.bestFor && (
            <div className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-xs">
              <span className="font-semibold text-foreground">Best for:</span>{" "}
              <span className="text-muted">{pkg.bestFor}</span>
            </div>
          )}
          <ul className="space-y-2.5">
            {pkg.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <IconCheck
                  size={14}
                  strokeWidth={3}
                  className="mt-0.5 shrink-0 text-accent"
                />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t-2 border-border bg-surface px-5 py-4">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onConfirm(); }}
            className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent/60"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop summary sidebar
// ---------------------------------------------------------------------------

function SummarySidebar({
  vehicleSizeLabel,
  pkgName,
  packagePrice,
  addOnsLabel,
  estimatedTotal,
  hasRangeAddOns,
  completedSteps,
  duration,
  step4Done,
  onBookClick,
}: {
  vehicleSizeLabel: string | null;
  pkgName: string | null;
  packagePrice: number | null;
  addOnsLabel: string | null;
  estimatedTotal: number | null;
  hasRangeAddOns: boolean;
  completedSteps: number;
  duration: string | null;
  step4Done: boolean;
  onBookClick: () => void;
}) {
  const progressPct = Math.round((completedSteps / 4) * 100);

  return (
    <div className="rounded-2xl bg-foreground p-6 text-white">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
        Live Estimate
      </div>
      <h3 className="heading mt-1 text-2xl text-white">Your Detail Summary</h3>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">Build progress</span>
          <span className="text-white/50">{completedSteps}/4 steps</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Summary rows */}
      <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
        <SidebarRow label="Vehicle" value={vehicleSizeLabel} />
        <SidebarRow
          label="Package"
          value={pkgName}
          subValue={packagePrice !== null ? formatPrice(packagePrice) : null}
        />
        <SidebarRow label="Add-ons" value={addOnsLabel} />
        {duration && <SidebarRow label="Est. time" value={duration} />}
      </div>

      {/* Total */}
      <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
        <div>
          <div className="text-xs text-white/50">Estimated total</div>
          {hasRangeAddOns && (
            <div className="text-[10px] text-white/30">starting at</div>
          )}
        </div>
        {estimatedTotal !== null ? (
          <span className="text-3xl font-bold text-accent">
            {formatPrice(estimatedTotal)}
          </span>
        ) : (
          <span className="text-xl text-white/20">—</span>
        )}
      </div>

      {/* Book This Detail button */}
      <button
        type="button"
        onClick={step4Done ? onBookClick : undefined}
        disabled={!step4Done}
        className={cn(
          "mt-5 w-full rounded-full py-3.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent/60",
          step4Done
            ? "cursor-pointer bg-accent text-white hover:brightness-110"
            : "cursor-not-allowed bg-white/10 text-white/30",
        )}
      >
        Book This Detail
      </button>
      <p className="mt-2 text-center text-xs text-white/30">
        No payment required — confirm by text
      </p>
    </div>
  );
}

function SidebarRow({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string | null;
  subValue?: string | null;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-xs text-white/40">{label}</span>
      <div className="text-right">
        {value ? (
          <>
            <span className="text-xs font-medium text-white">{value}</span>
            {subValue && (
              <span className="ml-1.5 text-xs font-bold text-accent">{subValue}</span>
            )}
          </>
        ) : (
          <span className="text-xs text-white/25">Not selected</span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile summary bar
// ---------------------------------------------------------------------------

function MobileSummaryBar({
  vehicleSizeLabel,
  pkgName,
  addOnsLabel,
  estimatedTotal,
  hasRangeAddOns,
  completedSteps,
  duration,
  step4Done,
  onBookClick,
}: {
  vehicleSizeLabel: string | null;
  pkgName: string | null;
  addOnsLabel: string | null;
  estimatedTotal: number | null;
  hasRangeAddOns: boolean;
  completedSteps: number;
  duration: string | null;
  step4Done: boolean;
  onBookClick: () => void;
}) {
  return (
    <div className="rounded-2xl bg-foreground p-5 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Your Summary
          </div>
          <div className="mt-0.5 text-xs text-white/50">
            {completedSteps}/4 steps complete
          </div>
          <div className="mt-2 h-1 w-28 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${Math.round((completedSteps / 4) * 100)}%` }}
            />
          </div>
        </div>
        {estimatedTotal !== null && (
          <div className="text-right">
            <div className="text-[10px] text-white/40">
              {hasRangeAddOns ? "Starting at" : "Estimated"}
            </div>
            <div className="text-2xl font-bold text-accent">
              {formatPrice(estimatedTotal)}
            </div>
          </div>
        )}
      </div>

      {(vehicleSizeLabel || pkgName || addOnsLabel || duration) && (
        <div className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
          {vehicleSizeLabel && (
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Vehicle</span>
              <span className="text-white">{vehicleSizeLabel}</span>
            </div>
          )}
          {pkgName && (
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Package</span>
              <span className="text-white">{pkgName}</span>
            </div>
          )}
          {addOnsLabel && (
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Add-ons</span>
              <span className="text-white">{addOnsLabel}</span>
            </div>
          )}
          {duration && (
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Est. time</span>
              <span className="text-white">{duration}</span>
            </div>
          )}
        </div>
      )}

      {/* Book This Detail button */}
      <button
        type="button"
        onClick={step4Done ? onBookClick : undefined}
        disabled={!step4Done}
        className={cn(
          "mt-4 w-full rounded-full py-3 text-sm font-semibold transition",
          step4Done
            ? "cursor-pointer bg-accent text-white hover:brightness-110"
            : "cursor-not-allowed bg-white/10 text-white/30",
        )}
      >
        Book This Detail
      </button>
      {step4Done && (
        <p className="mt-1.5 text-center text-xs text-white/30">
          No payment required — confirm by text
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal summary row helper
// ---------------------------------------------------------------------------

function ModalSummaryRow({
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
        {accent && <span className="ml-2 font-bold text-accent">{accent}</span>}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared field helpers
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="heading text-xl">{children}</h2>;
}

function SubSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wider text-muted">{children}</p>
  );
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

// SectionLabel is kept for potential future use
void SectionLabel;
