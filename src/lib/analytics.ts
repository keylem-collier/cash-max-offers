"use client";

import type { FunnelType } from "@/lib/lead-intake";

type FunnelEvent =
  | "form_started"
  | "address_completed"
  | "area_completed"
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

export function trackFunnelEvent(
  event: FunnelEvent,
  funnel: FunnelType = "seller",
) {
  const dimensions = { funnel_type: funnel };

  window.dataLayer?.push({ event, ...dimensions });
  window.gtag?.("event", event, dimensions);
  window.fbq?.("trackCustom", event, dimensions);

  if (event === "call_clicked" || event === "email_clicked") {
    window.fbq?.("track", "Contact", dimensions);
  }
}

export function trackLeadConversion(funnel: FunnelType = "seller") {
  const dimensions = { funnel_type: funnel };

  trackFunnelEvent("lead_submitted", funnel);
  window.fbq?.("track", "Lead", dimensions);

  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;

  if (adsId && label) {
    window.gtag?.("event", "conversion", {
      send_to: `${adsId}/${label}`,
      ...dimensions,
    });
  }
}
