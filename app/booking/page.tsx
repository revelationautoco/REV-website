import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { BookingForm } from "@/components/booking/BookingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking",
};

export default function BookingPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-5xl rounded-2xl border-2 border-border bg-white p-6">
        <h1 className="heading text-4xl leading-[0.95]">BOOK YOUR DETAIL</h1>
        <p className="mt-2 text-sm text-muted">
          Fill out the form below — we'll come to you and confirm within 24 hours.
        </p>
        <div className="mt-5">
          <Suspense fallback={<div className="py-12 text-center text-sm text-muted">Loading…</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
