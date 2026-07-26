import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  Phone,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ContactLink } from "@/components/contact-link";
import { mailHref, siteConfig, telHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Your Request Is In | Cash Max Offers",
  description: "Next steps for your Cash Max Offers property request.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NextStepsPage() {
  return (
    <main className="min-h-[100dvh] bg-[var(--paper)] px-4 py-6 text-[var(--ink)] sm:px-6 sm:py-9">
      <div className="mx-auto max-w-[1120px]">
        <header className="flex items-center justify-between">
          <BrandMark />
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line-strong)] px-4 text-sm font-bold transition-colors hover:bg-[var(--surface)]"
          >
            <ArrowLeft aria-hidden className="size-4" strokeWidth={1.8} />
            Back to site
          </Link>
        </header>

        <section className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16">
          <div>
            <span className="grid size-12 place-items-center rounded-full bg-[var(--accent)] text-[var(--forest-deep)]">
              <Check aria-hidden className="size-6" strokeWidth={2.2} />
            </span>
            <h1 className="mt-7 text-balance text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
              Your property request is in.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
              The next step is a straightforward review of the property, your
              timing, and the selling paths that may fit. There is no
              obligation to move forward.
            </p>

            <div className="mt-9 grid max-w-lg gap-5">
              <NextStep
                icon={Clock3}
                title="The property is reviewed"
                body="The address, condition, timing, and local market context are checked first."
              />
              <NextStep
                icon={Phone}
                title="You get a direct follow-up"
                body="A real person reaches out to understand the situation and any details still needed."
              />
              <NextStep
                icon={Check}
                title="You decide what happens"
                body="Compare the available paths and continue only if one makes sense."
              />
            </div>
          </div>

          <aside className="rounded-[24px] border border-[var(--line-strong)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_-48px_rgba(19,54,43,0.42)] sm:p-9">
            <p className="text-sm font-bold text-[var(--accent-strong)]">
              Want to connect now?
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em]">
              Reach Cash Max Offers directly.
            </h2>
            <div className="mt-7 grid gap-3">
              {siteConfig.hasDirectPhone ? (
                <ContactLink
                  kind="call"
                  href={telHref()}
                  className="flex min-h-20 items-center justify-between gap-4 rounded-[16px] border border-[var(--line-strong)] bg-[var(--surface)] px-5 transition-transform hover:-translate-y-0.5 active:translate-y-px"
                >
                  <span className="flex items-center gap-4">
                    <Phone
                      aria-hidden
                      className="size-6 text-[var(--accent-strong)]"
                      strokeWidth={1.7}
                    />
                    <span>
                      <span className="block text-xs font-bold text-[var(--muted)]">
                        Call or text
                      </span>
                      <span className="mt-1 block font-black">
                        {siteConfig.directPhoneDisplay}
                      </span>
                    </span>
                  </span>
                </ContactLink>
              ) : null}

              {siteConfig.hasContactEmail ? (
                <ContactLink
                  kind="email"
                  href={mailHref("My Cash Max Offers property request")}
                  className="flex min-h-20 items-center gap-4 rounded-[16px] border border-[var(--line-strong)] bg-[var(--surface)] px-5 transition-transform hover:-translate-y-0.5 active:translate-y-px"
                >
                  <Mail
                    aria-hidden
                    className="size-6 text-[var(--accent-strong)]"
                    strokeWidth={1.7}
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-[var(--muted)]">
                      Email
                    </span>
                    <span className="mt-1 block break-all font-black">
                      {siteConfig.contactEmail}
                    </span>
                  </span>
                </ContactLink>
              ) : null}

              {siteConfig.hasScheduling ? (
                <a
                  href={siteConfig.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-20 items-center gap-4 rounded-[16px] bg-[var(--forest)] px-5 text-[var(--paper)] transition-transform hover:-translate-y-0.5 active:translate-y-px dark:bg-[var(--accent)] dark:text-[var(--forest-deep)]"
                >
                  <CalendarDays
                    aria-hidden
                    className="size-6"
                    strokeWidth={1.7}
                  />
                  <span>
                    <span className="block text-xs font-bold opacity-75">
                      Pick a time
                    </span>
                    <span className="mt-1 block font-black">
                      Open the calendar
                    </span>
                  </span>
                </a>
              ) : null}
            </div>

            {!siteConfig.hasDirectPhone && !siteConfig.hasContactEmail ? (
              <div className="mt-7 rounded-[16px] border border-[var(--line-strong)] bg-[var(--surface)] p-5">
                <p className="font-black">Direct contact is being finalized.</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  The verified phone and email must be configured before this
                  page is launched.
                </p>
              </div>
            ) : null}

            <p className="mt-6 text-xs leading-5 text-[var(--muted)]">
              If a confirmation email does not arrive, check spam or use one of
              the direct contact options above.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}

function NextStep({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Clock3;
  title: string;
  body: string;
}) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-4">
      <span className="grid size-11 place-items-center rounded-[12px] border border-[var(--line-strong)] bg-[var(--surface)]">
        <Icon
          aria-hidden
          className="size-5 text-[var(--accent-strong)]"
          strokeWidth={1.7}
        />
      </span>
      <div>
        <h2 className="font-black">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{body}</p>
      </div>
    </div>
  );
}
