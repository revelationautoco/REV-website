export type LeadStatus =
  | "New"
  | "Contacted"
  | "Booked"
  | "Completed"
  | "No-show";

export interface Lead {
  id: string;
  created_at: string;
  status: LeadStatus;

  first_name: string;
  last_name: string;
  phone: string;
  email: string;

  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  package_id: string;
  preferred_date: string;
  referral_source: string;
  message?: string | null;

  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  landing_path?: string | null;
}

