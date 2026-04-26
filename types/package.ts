export type PackageTier = "basic" | "interior" | "full" | "premium";

export interface ServicePackage {
  id: PackageTier;
  name: string;
  description: string;
  includes: string[];
  priceLabel: string;
  popular?: boolean;
}

