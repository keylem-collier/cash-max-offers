"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackFunnelEvent } from "@/lib/analytics";
import type { FunnelType } from "@/lib/lead-intake";

type ContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  kind: "call" | "email";
  funnel?: FunnelType;
  children: ReactNode;
};

export function ContactLink({
  kind,
  funnel = "seller",
  children,
  onClick,
  ...props
}: ContactLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackFunnelEvent(
          kind === "call" ? "call_clicked" : "email_clicked",
          funnel,
        );
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
