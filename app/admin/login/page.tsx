import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-6">
        <h1 className="heading text-4xl leading-[0.95]">Admin</h1>
        <p className="mt-2 text-sm text-muted">Enter the admin password.</p>

        <Suspense fallback={<div className="mt-6 text-sm text-muted">Loading…</div>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </Container>
  );
}

