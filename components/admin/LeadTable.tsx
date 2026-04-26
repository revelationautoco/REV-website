"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { LeadStatus } from "@/types/lead";

type LeadRow = {
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
};

const statuses: Array<"All" | LeadStatus> = [
  "All",
  "New",
  "Contacted",
  "Booked",
  "Completed",
  "No-show",
];

export function LeadTable() {
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (status && status !== "All") p.set("status", status);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    return p.toString();
  }, [status, from, to]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads?${query}`);
      const data = (await res.json()) as { ok: boolean; error?: string; leads?: LeadRow[] };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to load leads");
      setRows(data.leads ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function updateStatus(id: string, next: LeadStatus) {
    startTransition(async () => {
      const prev = rows;
      setRows((r) => r.map((x) => (x.id === id ? { ...x, status: next } : x)));
      try {
        const res = await fetch(`/api/admin/leads/${id}/status`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        const data = (await res.json()) as { ok: boolean; error?: string };
        if (!res.ok || !data.ok) throw new Error(data.error ?? "Update failed");
      } catch (e) {
        setRows(prev);
        setError(e instanceof Error ? e.message : "Update failed");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="heading text-2xl">Leads</div>
          <p className="mt-1 text-sm text-muted">Update status inline.</p>
        </div>

        <div className="grid gap-2 md:grid-cols-4">
          <label className="grid gap-1">
            <span className="text-xs text-muted">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as (typeof statuses)[number])}
              className={inputClass}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-muted">From</span>
            <input value={from} onChange={(e) => setFrom(e.target.value)} type="date" className={inputClass} />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-muted">To</span>
            <input value={to} onChange={(e) => setTo(e.target.value)} type="date" className={inputClass} />
          </label>
          <div className="flex items-end">
            <Button onClick={() => void load()} disabled={pending || loading}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

      <div className="mt-5 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-background/30 text-muted">
            <tr>
              {["Created", "Name", "Contact", "Vehicle", "Package", "Date", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={7}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={7}>
                  No leads found.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 text-muted">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {r.first_name} {r.last_name}
                    </div>
                    {r.referral_source ? (
                      <div className="text-xs text-muted">{r.referral_source}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <div>{r.phone}</div>
                    <div className="text-xs text-muted">{r.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {r.vehicle_year} {r.vehicle_make} {r.vehicle_model}
                  </td>
                  <td className="px-4 py-3 text-muted">{r.package_id}</td>
                  <td className="px-4 py-3 text-muted">{r.preferred_date}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value as LeadStatus)}
                      className={cn(inputClass, "h-9")}
                    >
                      {statuses.filter((s) => s !== "All").map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-background/40 px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50";

