import { Container } from "@/components/ui/Container";
import { JobberWorkRequestEmbed } from "@/components/booking/JobberWorkRequestEmbed";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking",
};

export default function BookingPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-[800px] rounded-2xl border-2 border-border bg-white p-6">
        <h1 className="heading text-4xl leading-[0.95]">BOOK YOUR DETAIL</h1>
        <p className="mt-2 text-sm text-muted">
          Select a time that works for you — we'll come to you.
        </p>
        <div className="mt-5 min-h-[600px]">
          <JobberWorkRequestEmbed />
        </div>
      </div>
    </Container>
  );
}

