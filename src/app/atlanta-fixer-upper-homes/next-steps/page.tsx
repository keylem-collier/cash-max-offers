import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { CalEmbed } from "@/components/cal-embed";
import { ContactLink } from "@/components/contact-link";
import { mailHref, siteConfig, telHref } from "@/lib/site-config";

const buyerPath = "/atlanta-fixer-upper-homes";

export const metadata: Metadata = {
  title: "Your Buyer Criteria Are In | Max Cash Offers",
  description: "Next steps for your Metro Atlanta property search.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BuyerNextStepsPage() {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-[var(--paper)] px-4 py-6 text-[var(--ink)] sm:px-6 sm:py-9">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.14),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--ink)]/8 via-transparent to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-[1120px]">
        <header className="flex items-center justify-between">
          <BrandMark href={buyerPath} />
          <Link
            href={buyerPath}
            className="inline-flex min-h-11 items-center gap-2 border-2 border-[var(--ink)] bg-[var(--panel)] px-4 text-sm font-semibold transition-colors hover:bg-[var(--surface)]"
          >
            <ArrowLeft aria-hidden className="size-4" strokeWidth={1.8} />
            Back to search
          </Link>
        </header>

        <section className="mx-auto mt-10 flex w-full max-w-5xl flex-col items-center gap-8 border-2 border-[var(--ink)] bg-[var(--panel)] p-5 text-center sm:mt-14 sm:p-9 md:p-12">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
              {siteConfig.name}
            </p>
            <h1 className="text-balance text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-6xl">
              Your criteria are in.
              <span className="mt-2 block text-[var(--accent)]">
                Talk with {siteConfig.realtorName}.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Pick a time below, or reach {siteConfig.realtorName} directly.
              He will review your Metro Atlanta search and follow up about
              properties that may fit.
            </p>
          </div>

          <div className="grid w-full gap-4 md:grid-cols-2">
            {siteConfig.hasDirectPhone ? (
              <ContactLink
                kind="call"
                funnel="buyer"
                href={telHref()}
                className="group border-2 border-[var(--ink)] bg-[var(--ink)] p-6 text-left text-[var(--panel)] transition-transform hover:-translate-y-0.5 active:translate-y-px"
              >
                <span className="mb-8 grid size-11 place-items-center bg-[var(--panel)] text-[var(--ink)]">
                  <Phone aria-hidden className="size-5" strokeWidth={1.7} />
                </span>
                <span className="block text-2xl font-black tracking-[-0.04em]">
                  Call or text
                </span>
                <span className="mt-3 block text-sm leading-6 text-[var(--on-dark-copy)]">
                  Prefer to talk now? Reach {siteConfig.realtorName} at{" "}
                  {siteConfig.directPhoneDisplay}.
                </span>
              </ContactLink>
            ) : (
              <div className="border-2 border-[var(--ink)] bg-[var(--surface)] p-6 text-left">
                <span className="mb-8 grid size-11 place-items-center border border-[var(--ink)] bg-[var(--panel)] text-[var(--accent-strong)]">
                  <Phone aria-hidden className="size-5" strokeWidth={1.7} />
                </span>
                <p className="text-2xl font-black tracking-[-0.04em]">
                  Call or text
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Direct phone is being finalized before launch.
                </p>
              </div>
            )}

            {siteConfig.hasContactEmail ? (
              <ContactLink
                kind="email"
                funnel="buyer"
                href={mailHref("My Metro Atlanta property search")}
                className="group border-2 border-[var(--ink)] bg-[var(--panel)] p-6 text-left transition-transform hover:-translate-y-0.5 active:translate-y-px"
              >
                <span className="mb-8 grid size-11 place-items-center bg-[var(--ink)] text-[var(--panel)]">
                  <Mail aria-hidden className="size-5" strokeWidth={1.7} />
                </span>
                <span className="block text-2xl font-black tracking-[-0.04em]">
                  Email
                </span>
                <span className="mt-3 block break-all text-sm leading-6 text-[var(--muted)]">
                  Prefer email? Reach {siteConfig.realtorName} at{" "}
                  {siteConfig.contactEmail}.
                </span>
              </ContactLink>
            ) : (
              <div className="border-2 border-[var(--ink)] bg-[var(--surface)] p-6 text-left">
                <span className="mb-8 grid size-11 place-items-center border border-[var(--ink)] bg-[var(--panel)] text-[var(--accent-strong)]">
                  <Mail aria-hidden className="size-5" strokeWidth={1.7} />
                </span>
                <p className="text-2xl font-black tracking-[-0.04em]">Email</p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Direct email is being finalized before launch.
                </p>
              </div>
            )}
          </div>

          <div className="w-full border-2 border-[var(--ink)] text-left">
            <div className="border-b-2 border-[var(--ink)] bg-[var(--ink)] px-5 py-4 text-[var(--panel)]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-on-dark)]">
                Review your search
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
                Book 30 minutes with {siteConfig.realtorName}
              </h2>
            </div>
            <CalEmbed
              calLink={siteConfig.calLink}
              realtorName={siteConfig.realtorName}
            />
          </div>

          <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Property matches, discounts, financing, and availability are not
            guaranteed. Verify condition and repair costs before proceeding.
          </p>

          <Link
            href={buyerPath}
            className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
          >
            Back to Metro Atlanta fixer-uppers
          </Link>
        </section>
      </div>
    </main>
  );
}
