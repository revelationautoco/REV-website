import type { ServicePackage } from "@/types/package";

export const PACKAGES: ServicePackage[] = [
  {
    id: "basic",
    name: "Basic Wash",
    description: "Quick refresh for a clean, glossy finish.",
    includes: [
      "Foam pre-soak + hand wash",
      "Wheel faces cleaned",
      "Tire shine",
      "Quick interior wipe-down",
      "Windows (inside + out)",
    ],
    priceLabel: "Starting at $79",
  },
  {
    id: "interior",
    name: "Interior Detail",
    description: "Deep-clean your cabin—seats, carpets, and plastics.",
    includes: [
      "Thorough vacuum",
      "Steam + brush agitation (as needed)",
      "Seats cleaned (cloth/leather safe)",
      "Dashboard/trim cleaned + protected",
      "Streak-free interior glass",
    ],
    priceLabel: "Starting at $149",
    popular: true,
  },
  {
    id: "full",
    name: "Full Detail",
    description: "Inside + out detail for maximum impact.",
    includes: [
      "Complete exterior wash + decon (as needed)",
      "Clay bar (as needed)",
      "Sealant for gloss + protection",
      "Full interior detail",
      "Door jambs cleaned",
    ],
    priceLabel: "Starting at $249",
  },
  {
    id: "premium",
    name: "Premium Protection Detail",
    description: "Top-tier clean + long-lasting protection for daily drivers.",
    includes: [
      "Enhanced exterior decon (as needed)",
      "Premium sealant for durability + gloss",
      "Wheels + tires deep clean",
      "Trim + glass protection",
      "Final-touch detail + inspection",
    ],
    priceLabel: "Starting at $399",
  },
];

