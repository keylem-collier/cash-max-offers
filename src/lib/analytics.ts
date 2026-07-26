"use client";

type FunnelEvent =
  | "form_started"
  | "address_completed"
  | "lead_submitted"
  | "call_clicked"
  | "email_clicked";

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackFunnelEvent(event: FunnelEvent) {
  window.dataLayer?.push({ event });
  window.gtag?.("event", event);
  window.fbq?.("trackCustom", event);

  if (event === "call_clicked" || event === "email_clicked") {
    window.fbq?.("track", "Contact");
  }
}

export function trackLeadConversion() {
  trackFunnelEvent("lead_submitted");
  window.fbq?.("track", "Lead");

  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;

  if (adsId && label) {
    window.gtag?.("event", "conversion", {
      send_to: `${adsId}/${label}`,
    });
  }
}
