import { Container } from "@/components/ui/Container";
import { LeadTable } from "@/components/admin/LeadTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <Container className="py-12">
      <div className="max-w-3xl">
        <h1 className="heading text-5xl leading-[0.95]">Admin Dashboard</h1>
        <p className="mt-3 text-base text-muted">
          Minimal lead pipeline. Status updates are saved to Supabase.
        </p>
      </div>
      <div className="mt-10">
        <LeadTable />
      </div>
    </Container>
  );
}

