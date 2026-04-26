"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AdminLoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/admin";
  const [pending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const data = (await res.json()) as { ok: boolean; error?: string };
        if (!res.ok || !data.ok) throw new Error(data.error ?? "Login failed");
        router.replace(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Login failed");
      }
    });
  }

  return (
    <>
      <label className="mt-6 flex flex-col gap-1">
        <span className="text-sm text-muted">Password</span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="h-11 rounded-xl border border-border bg-background/40 px-3 text-sm outline-none focus:ring-2 focus:ring-accent/50"
        />
      </label>

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

      <div className="mt-6">
        <Button
          variant="primary"
          size="lg"
          disabled={pending || password.length === 0}
          onClick={submit}
        >
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </div>
    </>
  );
}

