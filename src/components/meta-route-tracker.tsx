"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function MetaRouteTracker() {
  const pathname = usePathname();
  const isInitialPage = useRef(true);

  useEffect(() => {
    if (isInitialPage.current) {
      isInitialPage.current = false;
      return;
    }

    window.fbq?.("track", "PageView");

    if (pathname === "/") {
      window.fbq?.("track", "ViewContent");
    }
  }, [pathname]);

  return null;
}
