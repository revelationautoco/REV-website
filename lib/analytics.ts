export type AnalyticsEvent =
  | { name: "cta_click"; params: { location: string; label: string } }
  | { name: "package_click"; params: { packageId: string } }
  | { name: "lead_submit"; params: { packageId: string } };

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", event.name, event.params);
}

