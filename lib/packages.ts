import type { ServicePackage, AddOn } from "@/types/package";

export const PACKAGES: ServicePackage[] = [
  {
    id: "bronze-exterior",
    name: "BRONZE EXTERIOR ONLY",
    description: "A thorough exterior wash — swirl-free with wheels and finishing touches.",
    includes: [
      "High-pressure pre-rinse + foam pre-soak",
      "Two-bucket hand wash (swirl-free method)",
      "Wheels, tires & wheel wells deep cleaned",
      "Tire dressing applied",
      "Exterior glass & mirrors cleaned streak-free",
      "Door jambs & fuel door wiped down",
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
    name: "INTERIOR ONLY",
    description: "Deep interior cleaning for a fresh, reset cabin.",
    includes: [
      "Full interior vacuum (seats, carpets, mats, crevices)",
      "All hard surfaces cleaned (dash, console, vents, panels, cup holders)",
      "Interior glass & mirrors cleaned streak-free",
      "Door jambs cleaned",
      "High-traffic area spot treatment",
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
    id: "silver",
    name: "SILVER FULL DETAIL",
    description: "The complete interior + exterior transformation.",
    includes: [
      "Everything in Bronze Exterior Only",
      "Everything in Interior Only",
      "Complete top-to-bottom transformation",
    ],
    prices: [
      { category: "Sedan & Small SUV/Crossover", price: 165 },
      { category: "Large SUV & Truck", price: 225 },
    ],
    durationSedan: "2–3.5 hrs",
    durationLarge: "2–4 hrs",
  },
  {
    id: "gold",
    name: "GOLD PREMIUM FULL DETAIL",
    description: "Our most thorough detail — premium products, premium results.",
    includes: [
      "Everything in Silver Full Detail",
      "Steam cleaning",
      "Stain removal",
      "Leather conditioning",
      "Plastic trim conditioning",
      "Protectant seal",
      "Tire shine",
    ],
    prices: [
      { category: "Sedan & Small SUV/Crossover", price: 235 },
      { category: "Large SUV & Truck", price: 315 },
    ],
    durationSedan: "2–4 hrs",
    durationLarge: "2–4 hrs",
    popular: true,
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
    priceLabel: "$69.99",
    priceLow: 69.99,
  },
  {
    id: "engine-bay",
    name: "Engine Bay Cleaning",
    priceLabel: "$49.99",
    priceLow: 49.99,
  },
  {
    id: "stain-removal",
    name: "Stain Removal",
    priceLabel: "$25–$50, based on inspection",
    priceLow: 25,
    priceHigh: 50,
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
