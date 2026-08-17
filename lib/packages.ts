import type { PackageTier, ServicePackage, AddOn } from "@/types/package";

export const PACKAGES: ServicePackage[] = [
  {
    id: "gold",
    name: "Revelation Premium Detail",
    description: "The complete transformation — restoration-level clean.",
    includes: [
      "Everything in the Revelation Complete Detail",
      "Clay bar decontamination",
      "Iron deposit remover treatment",
      "3-Month paint sealant applied over decontaminated paint",
      "Steam sanitization on all interior panels and seats",
      "Minor carpet & seat stain extraction",
      "Leather & plastic conditioner/protectant",
    ],
    prices: [
      { category: "Sedan & Small SUV/Crossover", price: 310 },
      { category: "Large SUV & Truck", price: 350 },
    ],
    durationSedan: "2–4 hrs",
    durationLarge: "2–4 hrs",
  },
  {
    id: "silver",
    name: "Revelation Complete Detail",
    description: "A full reset, inside and out. Best value for first-timers.",
    includes: [
      "Pre-rinse, foam bath & soft hand wash",
      "Wheels, tires & wheel wells deep cleaned",
      "Tire dressing applied",
      "3-Month paint sealant for gloss & protection",
      "Door jambs, fuel door & exterior trim detailed",
      "Full interior vacuum (seats, carpets, mats)",
      "All hard surfaces cleaned (dash, console, vents, panels, cup holders)",
      "Interior windows cleaned",
      "Final quality inspection",
    ],
    prices: [
      { category: "Sedan & Small SUV/Crossover", price: 179, basePrice: 210 },
      { category: "Large SUV & Truck", price: 199, basePrice: 235 },
    ],
    durationSedan: "2–3.5 hrs",
    durationLarge: "2–4 hrs",
    popular: true,
  },
  {
    id: "bronze-exterior",
    name: "Exterior Only Detail",
    description: "The perfect upkeep wash. Fast, thorough, gentle on paint.",
    bestFor: "Weekly/bi-weekly maintenance",
    includes: [
      "Pre-rinse + foam bath",
      "Soft hand wash (microfiber wash mitt)",
      "Wheels + tires detailed (wheel face & barrels)",
      "3-Month paint sealant for added gloss & protection",
      "Tire dressing applied",
      "Door jambs & fuel door detailed",
      "Final quality inspection",
    ],
    prices: [
      { category: "Sedan & Small SUV/Crossover", price: 65 },
      { category: "Large SUV & Truck", price: 95 },
    ],
    durationSedan: "45 min – 1.5 hrs",
    durationLarge: "45 min – 1.5 hrs",
  },
  {
    id: "interior",
    name: "Interior Only Detail",
    description: "Deep interior cleaning for a fresh, reset cabin.",
    includes: [
      "Full interior vacuum (seats, carpets, mats, crevices)",
      "All hard surfaces cleaned (dash, console, vents, panels, cup holders)",
      "Interior glass & mirrors cleaned streak-free",
      "Door jambs cleaned",
      "Final quality inspection",
    ],
    prices: [
      { category: "Sedan & Small SUV/Crossover", price: 99 },
      { category: "Large SUV & Truck", price: 135 },
    ],
    durationSedan: "1–2 hrs",
    durationLarge: "1.5–2.5 hrs",
  },
  {
    id: "paint-correction",
    name: "Paint Correction & Ceramic Coatings",
    description: "Call for a free custom quote today!",
    includes: [],
    contactOnly: true,
    ctaLabel: "Contact Us",
  },
  {
    id: "specialty",
    name: "SPECIALTY VEHICLES",
    description: "Motorcycles, RVs, campers, trailers & more",
    includes: [
      "Motorcycles & sport bikes",
      "RVs & camper vans",
      "Trailers & work vehicles",
      "Boats & recreational vehicles",
    ],
    pricingLabel: "Custom Quote",
    ctaLabel: "Request a Quote",
  },
];

/** Display order for package cards on /packages and the booking form */
export const PACKAGE_CARD_ORDER = [
  "gold",
  "silver",
  "bronze-exterior",
  "interior",
  "paint-correction",
] as const satisfies readonly PackageTier[];

/** Bookable packages in display order (excludes contact-only cards) */
export const BOOKING_PACKAGE_IDS = [
  "gold",
  "silver",
  "bronze-exterior",
  "interior",
] as const satisfies readonly PackageTier[];

export function getPackageCardPackages(): ServicePackage[] {
  return PACKAGE_CARD_ORDER.map((id) => PACKAGES.find((p) => p.id === id)).filter(
    (p): p is ServicePackage => p != null,
  );
}

export function getBookingPackages(): ServicePackage[] {
  return BOOKING_PACKAGE_IDS.map((id) => PACKAGES.find((p) => p.id === id)).filter(
    (p): p is ServicePackage => p != null,
  );
}

export const ADD_ONS: AddOn[] = [
  {
    id: "pet-hair",
    name: "Pet Hair Removal",
    priceLabel: "$25–$50, based on inspection",
    priceLow: 25,
    priceHigh: 50,
  },
  {
    id: "odor-elimination",
    name: "Odor Elimination",
    priceLabel: "$35",
    priceLow: 35,
  },
  {
    id: "headlight-restoration",
    name: "Headlight Restoration",
    priceLabel: "$99",
    priceLow: 99,
  },
  {
    id: "engine-bay",
    name: "Engine bay detail",
    priceLabel: "$50",
    priceLow: 50,
  },
  {
    id: "stain-removal",
    name: "Stain Removal",
    priceLabel: "$25–$50, based on inspection",
    priceLow: 25,
    priceHigh: 50,
  },
  {
    id: "steam-sanitization",
    name: "Steam sanitization",
    priceLabel: "$25 per row",
    priceLow: 25,
  },
  {
    id: "leather-conditioner",
    name: "Leather conditioner/protectant",
    priceLabel: "$25 per row",
    priceLow: 25,
  },
];

export function formatPrice(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

export function getPackagePrice(
  pkg: ServicePackage,
  vehicleSize: "sedan-small" | "large-suv-truck",
): number | null {
  if (!pkg.prices) return null;
  const idx = vehicleSize === "sedan-small" ? 0 : 1;
  return pkg.prices[idx]?.price ?? null;
}

export function getPackageDuration(
  pkg: ServicePackage,
  vehicleSize: "sedan-small" | "large-suv-truck",
): string | null {
  if (vehicleSize === "sedan-small" && pkg.durationSedan) return pkg.durationSedan;
  if (vehicleSize === "large-suv-truck" && pkg.durationLarge) return pkg.durationLarge;
  return null;
}

/** Maps ?package= URL param values to internal package IDs */
export const URL_PARAM_TO_PACKAGE_ID: Record<
  string,
  "bronze-exterior" | "interior" | "silver" | "gold"
> = {
  "bronze-exterior": "bronze-exterior",
  interior: "interior",
  silver: "silver",
  gold: "gold",
};
