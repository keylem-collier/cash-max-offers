import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ContactLink } from "@/components/contact-link";
import { mailHref, siteConfig, telHref } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer
      data-mobile-cta-safe-zone
      className="border-t border-[var(--line)] pb-16 pt-12 sm:pb-12"
    >
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--muted)]">
            Clear selling options for Georgia homeowners, with direct guidance
            from {siteConfig.realtorName}, a licensed local realtor.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-bold text-[var(--ink)]">Contact</p>
            <div className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
              {siteConfig.hasDirectPhone ? (
                <ContactLink
                  kind="call"
                  href={telHref()}
                  className="w-fit hover:text-[var(--ink)] hover:underline"
                >
                  {siteConfig.directPhoneDisplay}
                </ContactLink>
              ) : (
                <span>Direct phone publishes after launch approval</span>
              )}
              {siteConfig.hasContactEmail ? (
                <ContactLink
                  kind="email"
                  href={mailHref()}
                  className="w-fit hover:text-[var(--ink)] hover:underline"
                >
                  {siteConfig.contactEmail}
                </ContactLink>
              ) : (
                <span>Contact email publishes after launch approval</span>
              )}
              <Link href="/privacy" className="w-fit hover:text-[var(--ink)] hover:underline">
                Privacy notice
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--ink)]">
              Brokerage disclosure
            </p>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-[var(--muted)]">
              <p>{siteConfig.brokerageName}</p>
              {siteConfig.licenseNumber ? (
                <p>Georgia Real Estate License #{siteConfig.licenseNumber}</p>
              ) : (
                <p>Georgia license information pending broker approval</p>
              )}
              {siteConfig.brokeragePhone ? (
                <p>Brokerage phone: {siteConfig.brokeragePhone}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <p className="border-t border-[var(--line)] pt-6 text-xs leading-5 text-[var(--muted)]">
          Max Cash Offers does not guarantee that every property will receive a
          cash offer. Available options, timing, costs, and proceeds depend on
          the property and the transaction. There is no obligation to accept an
          offer or enter a brokerage agreement.
        </p>
      </div>
    </footer>
  );
}
