export type PackageTier =
  | "bronze-exterior"
  | "interior"
  | "silver"
  | "gold"
  | "specialty"
  | "paint-correction";

export type VehicleCategory = "Sedan & Small SUV/Crossover" | "Large SUV & Truck";

export interface PriceTier {
  category: VehicleCategory;
  /** Transactional price — used for booking, emails, and DB totals */
  price: number;
  /** Optional display-only strikethrough price for marketing promos */
  basePrice?: number;
}

export interface AddOn {
  id: string;
  name: string;
  /** Display string, e.g. "$35" or "$25-$50, based on inspection" */
  priceLabel: string;
  /** Low-end price for total estimates */
  priceLow: number;
  /** High-end price; defined only when the price is a range */
  priceHigh?: number;
}

export interface ServicePackage {
  id: PackageTier;
  name: string;
  description: string;
  includes: string[];
  prices?: PriceTier[];
  pricingLabel?: string;
  ctaLabel?: string;
  popular?: boolean;
  /** Contact-only offering — no booking; routes to /contact */
  contactOnly?: boolean;
  /** Short "best for" context line, shown in the inclusions popup */
  bestFor?: string;
  /** Estimated service duration for Sedan / Small SUV */
  durationSedan?: string;
  /** Estimated service duration for Large SUV / Truck / Van */
  durationLarge?: string;
}
