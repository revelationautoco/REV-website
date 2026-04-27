export type PackageTier = "exterior" | "interior" | "full" | "specialty";

export type VehicleCategory = "Sedan & Small SUV/Crossover" | "Large SUV & Truck";

export interface PriceTier {
  category: VehicleCategory;
  price: number;
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
}

