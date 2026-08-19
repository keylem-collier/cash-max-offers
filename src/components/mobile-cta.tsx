"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { FunnelType } from "@/lib/lead-intake";

export function MobileCta({
  funnel = "seller",
}: {
  funnel?: FunnelType;
}) {
  const [isSafeZoneVisible, setIsSafeZoneVisible] = useState(false);

  useEffect(() => {
    const safeZones = Array.from(
      document.querySelectorAll<HTMLElement>("[data-mobile-cta-safe-zone]"),
    );
    const visibleZones = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleZones.add(entry.target);
          } else {
            visibleZones.delete(entry.target);
          }
        }

        setIsSafeZoneVisible(visibleZones.size > 0);
      },
      { threshold: 0.08 },
    );

    safeZones.forEach((zone) => observer.observe(zone));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={isSafeZoneVisible}
      className={`fixed inset-x-3 bottom-3 z-20 transition-[opacity,transform] duration-200 sm:hidden ${
        isSafeZoneVisible
          ? "pointer-events-none translate-y-4 opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <a
        href="#lead-form"
        tabIndex={isSafeZoneVisible ? -1 : undefined}
        className="flex min-h-13 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-[var(--accent)] bg-[var(--ink)] px-5 text-base font-semibold leading-5 tracking-[0.005em] text-[var(--panel)] shadow-[0_16px_40px_-18px_rgba(12,12,12,0.72)] active:translate-y-px"
      >
        {funnel === "buyer" ? "Find Fixer-Uppers" : "Get My Cash Offer"}
        <ArrowRight aria-hidden className="size-4" strokeWidth={1.8} />
      </a>
    </div>
  );
}
