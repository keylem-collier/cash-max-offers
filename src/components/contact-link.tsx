"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackFunnelEvent } from "@/lib/analytics";

type ContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  kind: "call" | "email";
  children: ReactNode;
};

export function ContactLink({
  kind,
  children,
  onClick,
  ...props
}: ContactLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackFunnelEvent(kind === "call" ? "call_clicked" : "email_clicked");
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
