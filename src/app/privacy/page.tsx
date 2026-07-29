import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Notice | Max Cash Offers",
  description:
    "How Max Cash Offers handles information submitted through the property request form.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] bg-[var(--paper)] px-4 py-6 text-[var(--ink)] sm:px-6 sm:py-9">
      <div className="mx-auto max-w-[900px]">
        <header className="flex items-center justify-between">
          <BrandMark />
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line-strong)] px-4 text-sm font-bold transition-colors hover:bg-[var(--surface)]"
          >
            <ArrowLeft aria-hidden className="size-4" strokeWidth={1.8} />
            Back
          </Link>
        </header>

        <article className="py-14 sm:py-20">
          <p className="text-sm font-bold text-[var(--accent-strong)]">
            Last updated July 26, 2026
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.065em] sm:text-7xl">
            Privacy notice
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            This notice explains how Max Cash Offers handles information you
            submit while asking about selling a Georgia property.
          </p>

          <div className="mt-12 grid gap-10">
            <PrivacySection title="Information we collect">
              We collect the property address, phone number, email address,
              desired selling timeline, property condition, page source, and
              campaign parameters included with your request. We may also
              collect routine technical information needed to operate and
              secure the website.
            </PrivacySection>
            <PrivacySection title="How we use it">
              We use the information to review the property, respond to your
              request, discuss possible selling paths, deliver confirmation
              messages, measure campaign performance without sending your
              contact details to advertising platforms, and protect the form
              from misuse.
            </PrivacySection>
            <PrivacySection title="How information is shared">
              Information may be shared with the licensed real-estate
              professional, supervising brokerage, service providers that
              deliver the website or transactional email, and a potential buyer
              only when needed to evaluate a selling option. Information is not
              sold as an unrelated marketing list.
            </PrivacySection>
            <PrivacySection title="Calls, texts, and email">
              By submitting the property form, you ask Max Cash Offers to
              contact you about that property. The first release does not use
              the form for recurring automated marketing texts. Consent to
              contact is not a condition of choosing a selling option.
            </PrivacySection>
            <PrivacySection title="Retention and security">
              Information is kept only as long as reasonably needed to respond,
              maintain transaction or brokerage records when required, protect
              the service, and meet legal obligations. Reasonable safeguards
              are used, but no online transmission can be guaranteed completely
              secure.
            </PrivacySection>
            <PrivacySection title="Your choices">
              You may ask to review, correct, or delete information, subject to
              legal and brokerage recordkeeping requirements. You may also ask
              to stop non-essential follow-up.
            </PrivacySection>
            <PrivacySection title="Contact">
              {siteConfig.privacyEmail ? (
                <>
                  Send privacy questions to{" "}
                  <a
                    href={`mailto:${siteConfig.privacyEmail}`}
                    className="font-bold text-[var(--ink)] underline underline-offset-2"
                  >
                    {siteConfig.privacyEmail}
                  </a>
                  .
                </>
              ) : (
                "A verified privacy contact must be configured before launch."
              )}
            </PrivacySection>
          </div>
        </article>
      </div>
    </main>
  );
}

function PrivacySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[var(--line-strong)] pt-7">
      <h2 className="text-2xl font-black tracking-[-0.035em]">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)]">
        {children}
      </p>
    </section>
  );
}
