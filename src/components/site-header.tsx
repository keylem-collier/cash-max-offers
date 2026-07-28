import { Phone } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ContactLink } from "@/components/contact-link";
import { siteConfig, telHref } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--paper-alpha)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <BrandMark />
        <nav className="flex items-center gap-2" aria-label="Primary navigation">
          <a
            href="#options"
            className="hidden px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:inline-flex"
          >
            Compare options
          </a>
          {siteConfig.hasDirectPhone ? (
            <ContactLink
              kind="call"
              href={telHref()}
              className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-[6px] bg-[var(--ink)] px-4 text-[15px] font-semibold leading-5 tracking-[0.005em] text-[var(--panel)] transition-transform hover:-translate-y-0.5 active:translate-y-px"
              aria-label={`Call ${siteConfig.realtorName} at ${siteConfig.directPhoneDisplay}`}
            >
              <Phone aria-hidden className="size-4" strokeWidth={1.8} />
              <span className="hidden sm:inline">
                {siteConfig.directPhoneDisplay}
              </span>
              <span className="sm:hidden">Call now</span>
            </ContactLink>
          ) : (
            <a
              href="#lead-form"
              className="inline-flex min-h-11 items-center whitespace-nowrap rounded-[6px] bg-[var(--ink)] px-4 text-[15px] font-semibold leading-5 tracking-[0.005em] text-[var(--panel)] transition-transform hover:-translate-y-0.5 active:translate-y-px"
            >
              Get My Cash Offer
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
