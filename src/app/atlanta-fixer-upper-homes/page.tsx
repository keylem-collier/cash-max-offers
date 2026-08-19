import type { Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock3,
  Hammer,
  Home,
  House,
  KeyRound,
  MapPinned,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";

const MobileCta = dynamic(() =>
  import("@/components/mobile-cta").then((module) => module.MobileCta),
);

export const metadata: Metadata = {
  title: "Metro Atlanta Fixer-Uppers and Value Properties | Max Cash Offers",
  description:
    "Share your Metro Atlanta search criteria and get personal help finding fixer-uppers and value-focused properties that may fit.",
  alternates: {
    canonical: "/atlanta-fixer-upper-homes",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Find Metro Atlanta fixer-uppers | Max Cash Offers",
    description:
      "Personalized matching for Metro Atlanta buyers interested in homes with work left to do and potential to uncover.",
    url: "/atlanta-fixer-upper-homes",
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Atlanta home surrounded by mature Georgia landscaping",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metro Atlanta Fixer-Uppers | Max Cash Offers",
    description:
      "Share your criteria and get personal help finding Metro Atlanta properties with renovation potential.",
    images: ["/og-home.jpg"],
  },
};

const buyerOpportunities = [
  { icon: Hammer, label: "Cosmetic updates" },
  { icon: KeyRound, label: "Major renovations" },
  { icon: Building2, label: "Rental potential" },
  { icon: Home, label: "First-home value" },
  { icon: Clock3, label: "Resale upside" },
];

const comparisonRows = [
  {
    label: "Asking price",
    upside: "May leave more room in the budget",
    tradeoff: "Repairs can erase the apparent savings",
  },
  {
    label: "Competition",
    upside: "Less-polished homes may draw fewer buyers",
    tradeoff: "Strong opportunities can still move quickly",
  },
  {
    label: "Financing",
    upside: "Some homes can qualify in their current state",
    tradeoff: "Major defects can limit loan options",
  },
  {
    label: "Future value",
    upside: "Well-chosen improvements may add value",
    tradeoff: "Resale value and appreciation are not guaranteed",
  },
];

const faqs = [
  {
    question: "What does discounted mean?",
    answer:
      "A lower asking price is only one part of the picture. Property condition, repair estimates, comparable sales, financing, and transaction costs all affect whether a fixer is a sound value.",
  },
  {
    question: "Are the properties off-market or exclusive?",
    answer:
      "Not necessarily. Matches may include publicly listed properties and other properly authorized opportunities. The source and current availability of each property should be clear before you decide.",
  },
  {
    question: "Do I need to pay cash?",
    answer:
      "No single financing path fits every property. Eligibility depends on the home, its condition, your lender, and the loan program you plan to use.",
  },
  {
    question: "Can first-time buyers submit?",
    answer:
      "Yes. The search is open to Metro Atlanta buyers who are willing to consider homes needing work, whether the goal is a first home, a rental, or a future resale.",
  },
  {
    question: "How should I evaluate the repairs?",
    answer:
      "Use an independent home inspector and qualified contractors to understand the condition, scope, and likely costs before making a final decision.",
  },
  {
    question: "Is every match guaranteed below market?",
    answer:
      "No. Bradford provides personalized matching and local context, but discounts, future value, financing, and property availability cannot be guaranteed.",
  },
];

export default function AtlantaFixerUpperHomesPage() {
  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader funnel="buyer" />
      <main>
        <section className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-[1400px] gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:px-10 lg:py-10">
          <div className="relative z-10 max-w-[650px]">
            <p className="mb-6 w-fit border-y border-[var(--ink)] py-2 text-xs font-bold uppercase leading-5 tracking-[0.14em]">
              {siteConfig.realtorName} · Licensed Georgia Realtor
            </p>
            <h1 className="text-balance text-[clamp(3.4rem,6.2vw,6.8rem)] font-black uppercase leading-[0.84] tracking-[-0.075em]">
              Find the fixer.
              <span className="block text-[var(--accent)]">See the upside.</span>
              Know the work.
            </h1>
            <p className="mt-7 max-w-[560px] text-pretty text-lg leading-7 text-[var(--muted)] sm:text-xl">
              Tell Bradford where and what you want to buy. He&apos;ll help you
              find Metro Atlanta homes where the price, condition, and
              potential fit your plan.
            </p>
            <a
              href="#lead-form"
              className="mt-8 hidden min-h-13 items-center gap-3 rounded-[6px] bg-[var(--ink)] px-6 text-base font-semibold leading-5 tracking-[0.005em] text-[var(--panel)] transition-transform hover:-translate-y-0.5 active:translate-y-px sm:inline-flex"
            >
              Find Fixer-Uppers
              <ArrowRight aria-hidden className="size-4" strokeWidth={1.8} />
            </a>
          </div>

          <div className="relative lg:min-h-[700px]">
            <div className="relative h-[380px] overflow-hidden border-2 border-[var(--ink)] bg-[var(--surface)] sm:h-[520px] lg:absolute lg:inset-0 lg:h-auto">
              <Image
                src="/atlanta-fixer-upper-hero.webp"
                alt="Modest Metro Atlanta brick fixer-upper with mature trees"
                fill
                priority
                fetchPriority="high"
                quality={72}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 56vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-[var(--ink)] px-4 py-3 text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-[var(--panel)]">
                <span>Metro Atlanta focus</span>
                <span>Fixers and value plays</span>
              </div>
            </div>
            <div className="relative z-10 mx-2 -mt-16 lg:absolute lg:-bottom-2 lg:left-[-24px] lg:mx-0 lg:mt-0 lg:w-[min(94%,560px)]">
              <LeadForm funnel="buyer" />
            </div>
          </div>
        </section>

        <section
          aria-label="Buyer service credentials"
          className="border-y-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--panel)]"
        >
          <div className="mx-auto grid max-w-[1400px] sm:grid-cols-2 lg:grid-cols-4">
            <TrustItem
              icon={BadgeCheck}
              title={`${siteConfig.realtorName}, licensed realtor`}
              body="Local buyer guidance"
            />
            <TrustItem
              icon={MapPinned}
              title="Metro Atlanta focus"
              body="Neighborhood-level search"
            />
            <TrustItem
              icon={Scale}
              title="Condition meets potential"
              body="Price, repairs, and fit"
            />
            <TrustItem
              icon={ShieldCheck}
              title="No obligation"
              body="Share criteria. Decide later."
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
          <div className="max-w-[820px]">
            <h2 className="text-balance text-5xl font-black uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl">
              Buy the potential.
              <span className="block text-[var(--accent)]">
                Not the polished price.
              </span>
            </h2>
            <p className="mt-6 max-w-[560px] text-lg leading-7 text-[var(--muted)]">
              Focus the search on homes with work left to do—and room for the
              numbers to make sense.
            </p>
          </div>
          <div className="mt-12 grid border-2 border-[var(--ink)] sm:grid-cols-2 lg:grid-cols-5">
            {buyerOpportunities.map((item) => (
              <div
                key={item.label}
                className="flex min-h-28 items-center gap-4 border-b border-[var(--ink)] p-5 last:border-b-0 sm:border-r sm:[&:nth-child(even)]:border-r-0 lg:border-b-0 lg:[&:nth-child(even)]:border-r lg:last:border-r-0"
              >
                <item.icon
                  aria-hidden
                  className="size-5 shrink-0 text-[var(--accent)]"
                  strokeWidth={1.8}
                />
                <p className="font-semibold leading-6">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="options"
          className="scroll-mt-24 border-y-2 border-[var(--ink)] bg-[var(--surface)]"
        >
          <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
            <h2 className="max-w-[850px] text-balance text-5xl font-black uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl">
              A lower price is only the start.
              <span className="block text-[var(--accent)]">
                Weigh the whole project.
              </span>
            </h2>

            <div className="mt-12 border-2 border-[var(--ink)] bg-[var(--panel)]">
              <div className="grid grid-cols-2 border-b-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--panel)] sm:grid-cols-[0.62fr_1fr_1fr]">
                <div className="hidden p-4 sm:block" />
                <div className="p-4 font-semibold leading-5 sm:border-l sm:border-[var(--panel)]">
                  Potential upside
                </div>
                <div className="border-l border-[var(--panel)] p-4 font-semibold leading-5">
                  What to verify
                </div>
              </div>
              {comparisonRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-2 border-b border-[var(--ink)] last:border-b-0 sm:grid-cols-[0.62fr_1fr_1fr]"
                >
                  <div className="col-span-2 border-b border-[var(--ink)] bg-[var(--surface)] p-3 text-sm font-semibold leading-5 sm:col-span-1 sm:border-b-0 sm:bg-transparent sm:p-4">
                    {row.label}
                  </div>
                  <div className="p-4 text-sm leading-6 text-[var(--muted)] sm:border-l sm:border-[var(--ink)]">
                    {row.upside}
                  </div>
                  <div className="border-l border-[var(--ink)] p-4 text-sm leading-6 text-[var(--muted)]">
                    {row.tradeoff}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
          <h2 className="max-w-[720px] text-balance text-5xl font-black uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl">
            Three steps.
            <span className="block text-[var(--accent)]">
              One informed decision.
            </span>
          </h2>
          <div className="mt-14 grid border-y-2 border-[var(--ink)] md:grid-cols-3">
            <ProcessStep
              number="01"
              title="Share your search"
              body="Tell us the area, budget, and timing that fit your plan."
            />
            <ProcessStep
              number="02"
              title="Review likely matches"
              body="Bradford filters for price, condition, and fit."
            />
            <ProcessStep
              number="03"
              title="Tour and verify"
              body="Inspect the property, price the work, and decide with the facts."
            />
          </div>
        </section>

        <section className="border-y-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--panel)]">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.18fr_0.82fr] lg:items-end lg:px-10">
            <h2 className="text-[clamp(4rem,10vw,9rem)] font-black uppercase leading-[0.76] tracking-[-0.08em]">
              Atlanta
              <span className="block text-[var(--accent-on-dark)]">Metro</span>
              Opportunity
            </h2>
            <div className="max-w-md border-t border-[var(--panel)] pt-6">
              <MapPinned
                aria-hidden
                className="size-7 text-[var(--accent-on-dark)]"
                strokeWidth={1.6}
              />
              <p className="mt-5 text-xl font-black">
                One search. Local context.
              </p>
              <p className="mt-3 leading-7 text-[var(--on-dark-copy)]">
                One search, guided by neighborhood-level context across Metro
                Atlanta.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1400px] gap-8 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[0.74fr_1.26fr] lg:px-10">
          <div className="relative min-h-[420px] overflow-hidden border-2 border-[var(--ink)] bg-[var(--ink)] sm:min-h-[480px]">
            <Image
              src="/bradford-headshot.webp"
              alt={`${siteConfig.realtorName}, licensed Georgia realtor`}
              fill
              loading="lazy"
              quality={72}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[center_20%]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-[var(--ink)] px-5 py-4 text-[var(--panel)]">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--on-dark-copy)]">
                Your local point of contact
              </p>
              <p className="mt-1 text-3xl font-black uppercase tracking-[-0.06em]">
                {siteConfig.realtorName}
              </p>
              <p className="mt-1 font-semibold text-[var(--on-dark-copy)]">
                Licensed Georgia Realtor
              </p>
            </div>
          </div>
          <div className="self-center lg:pl-8">
            <h2 className="max-w-[720px] text-balance text-5xl font-black uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl">
              Talk with {siteConfig.realtorName}.
              <span className="block text-[var(--accent)]">
                Not a property blast.
              </span>
            </h2>
            <p className="mt-6 max-w-[600px] text-lg leading-7 text-[var(--muted)]">
              Get a personal search built around where you want to buy, what
              you can spend, and how much work you are willing to take on.
            </p>
            <div className="mt-7 border-l-4 border-[var(--accent)] pl-5">
              <p className="font-black">{siteConfig.brokerageName}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {siteConfig.licenseNumber
                  ? `Georgia Real Estate License #${siteConfig.licenseNumber}`
                  : "License details publish after broker approval"}
              </p>
            </div>
          </div>
        </section>

        <section className="border-y-2 border-[var(--ink)] bg-[var(--surface)]">
          <div className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 sm:py-28">
            <h2 className="max-w-[620px] text-balance text-5xl font-black uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl">
              Before you
              <span className="block text-[var(--accent)]">take it on.</span>
            </h2>
            <div className="mt-12 grid gap-x-12 lg:grid-cols-2">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="group border-b border-[var(--ink)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-left text-lg font-black outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                    {item.question}
                    <ArrowRight
                      aria-hidden
                      className="size-5 shrink-0 text-[var(--accent)] transition-transform group-open:rotate-90"
                      strokeWidth={1.8}
                    />
                  </summary>
                  <p className="max-w-xl pb-6 text-base leading-7 text-[var(--muted)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
          <div className="grid gap-10 border-2 border-[var(--ink)] bg-[var(--panel)] p-5 sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-12">
            <div>
              <House
                aria-hidden
                className="size-8 text-[var(--accent)]"
                strokeWidth={1.6}
              />
              <h2 className="mt-7 max-w-[560px] text-balance text-5xl font-black uppercase leading-[0.88] tracking-[-0.065em] sm:text-6xl">
                Find the right kind of fixer.
              </h2>
              <p className="mt-5 max-w-[470px] text-lg leading-7 text-[var(--muted)]">
                Start with your search criteria. Get a personal follow-up.
              </p>
            </div>
            <LeadForm compact funnel="buyer" />
          </div>
        </section>
      </main>
      <MobileCta funnel="buyer" />
      <SiteFooter funnel="buyer" />
    </div>
  );
}

function TrustItem({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof BadgeCheck;
  title: string;
  body: string;
}) {
  return (
    <div className="border-b border-r border-[var(--panel)] p-5 last:border-r-0 sm:p-6 lg:border-b-0">
      <Icon
        aria-hidden
        className="size-5 text-[var(--accent-on-dark)]"
        strokeWidth={1.8}
      />
      <p className="mt-4 font-semibold leading-6">{title}</p>
      <p className="mt-1 text-sm text-[var(--on-dark-copy)]">{body}</p>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <article className="border-b border-[var(--ink)] p-6 last:border-b-0 md:min-h-64 md:border-b-0 md:border-r md:p-8 md:last:border-r-0">
      <p className="text-sm font-semibold text-[var(--accent)]">{number}</p>
      <h3 className="mt-12 text-2xl font-black">{title}</h3>
      <p className="mt-3 max-w-xs leading-6 text-[var(--muted)]">{body}</p>
    </article>
  );
}
