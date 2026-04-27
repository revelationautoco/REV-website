import type { ServicePackage } from "@/types/package";

export const PACKAGES: ServicePackage[] = [
  {
    id: "exterior",
    name: "EXTERIOR WASH",
    description: "Swirl-free wash with wheels and finishing touches.",
    includes: [
      "High-pressure pre-rinse + foam pre-soak",
      "Two-bucket hand wash (swirl-free)",
      "Wheels, tires & wheel wells deep cleaned",
      "Tire dressing applied",
      "Exterior glass & mirrors cleaned streak-free",
      "Door jambs & fuel door wiped down",
      "Final quality inspection",
    ],
    prices: [
      { category: "Sedan & Small SUV/Crossover", price: 85 },
      { category: "Large SUV & Truck", price: 110 },
    ],
  },
  {
    id: "interior",
    name: "INTERIOR DETAIL",
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
      { category: "Sedan & Small SUV/Crossover", price: 175 },
      { category: "Large SUV & Truck", price: 225 },
    ],
  },
  {
    id: "full",
    name: "FULL DETAIL (Interior + Exterior)",
    description: "The complete top-to-bottom transformation.",
    includes: [
      "Everything in Exterior Wash",
      "Everything in Interior Detail",
      "Complete top to bottom transformation",
    ],
    prices: [
      { category: "Sedan & Small SUV/Crossover", price: 240 },
      { category: "Large SUV & Truck", price: 299 },
    ],
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

export const ADD_ONS = [
  { name: "Pet Hair Removal", price: 50 },
  { name: "Heavy Soiling", price: 50 },
  { name: "Odor Treatment", price: 50 },
  { name: "Clay Bar Paint Decontamination", price: 60 },
] as const;

export function formatPrice(n: number) {
  return `$${n}`;
}


