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

const sellerSituations = [
  { icon: Hammer, label: "Major repairs" },
  { icon: KeyRound, label: "Inherited home" },
  { icon: Building2, label: "Tenants in place" },
  { icon: Clock3, label: "Relocation deadline" },
  { icon: Home, label: "Listing expired" },
];

const comparisonRows = [
  {
    label: "Speed",
    cash: "Usually the faster route",
    market: "More time for exposure",
  },
  {
    label: "Preparation",
    cash: "Often sold as-is",
    market: "May benefit from updates",
  },
  {
    label: "Certainty",
    cash: "Fewer financing variables",
    market: "Depends on buyer and terms",
  },
  {
    label: "Price potential",
    cash: "Convenience affects price",
    market: "More exposure may bring more",
  },
];

const faqs = [
  {
    question: "Am I obligated to sell?",
    answer:
      "No. A property review does not require you to accept an offer or sign a listing agreement.",
  },
  {
    question: "Do I need to make repairs?",
    answer:
      "No repairs are required to start. Property condition is considered when the available paths are reviewed.",
  },
  {
    question: "Is Max Cash Offers the buyer?",
    answer:
      "Max Cash Offers is a licensed-realtor-led service. The source and terms of any offer will be explained before you decide.",
  },
  {
    question: "Will I pay fees or commission?",
    answer:
      "Costs depend on the path you choose. A cash transaction and a listing can carry different costs, which should be clear before you commit.",
  },
  {
    question: "Can you help with tenants or inherited homes?",
    answer:
      "Yes. Share the situation during the first conversation so ownership, occupancy, condition, and timing can be reviewed.",
  },
  {
    question: "Do you serve all of Georgia?",
    answer:
      "Yes, with the strongest local emphasis in Buckhead, Midtown, Atlanta, and the surrounding metro.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader />
      <main>
        <section className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-[1400px] gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:px-10 lg:py-10">
          <div className="relative z-10 max-w-[650px]">
            <p className="mb-6 w-fit border-y border-[var(--ink)] py-2 text-xs font-bold uppercase leading-5 tracking-[0.14em]">
              {siteConfig.realtorName} · Licensed Georgia Realtor
            </p>
            <h1 className="text-balance text-[clamp(3.4rem,6.2vw,6.8rem)] font-black uppercase leading-[0.84] tracking-[-0.075em]">
              Sell fast.
              <span className="block text-[var(--accent)]">Or sell for more.</span>
              Know the difference.
            </h1>
            <p className="mt-7 max-w-[560px] text-pretty text-lg leading-7 text-[var(--muted)] sm:text-xl">
              See what you could get, how soon you could close, and whether
              listing may put more in your pocket.
            </p>
            <a
              href="#lead-form"
              className="mt-8 hidden min-h-13 items-center gap-3 rounded-[6px] bg-[var(--ink)] px-6 text-base font-semibold leading-5 tracking-[0.005em] text-[var(--panel)] transition-transform hover:-translate-y-0.5 active:translate-y-px sm:inline-flex"
            >
              Get My Cash Offer
              <ArrowRight aria-hidden className="size-4" strokeWidth={1.8} />
            </a>
          </div>

          <div className="relative lg:min-h-[700px]">
            <div className="relative h-[380px] overflow-hidden border-2 border-[var(--ink)] bg-[var(--surface)] sm:h-[520px] lg:absolute lg:inset-0 lg:h-auto">
              <Image
                src="/atlanta-home-hero.webp"
                alt="Atlanta home surrounded by mature Georgia landscaping"
                fill
                priority
                fetchPriority="high"
                quality={72}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 56vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-[var(--ink)] px-4 py-3 text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-[var(--panel)]">
                <span>Atlanta focus</span>
                <span>Statewide reach</span>
              </div>
            </div>
            <div className="relative z-10 mx-2 -mt-16 lg:absolute lg:-bottom-2 lg:left-[-24px] lg:mx-0 lg:mt-0 lg:w-[min(94%,560px)]">
              <LeadForm />
            </div>
          </div>
        </section>

        <section
          aria-label="Service credentials"
          className="border-y-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--panel)]"
        >
          <div className="mx-auto grid max-w-[1400px] sm:grid-cols-2 lg:grid-cols-4">
            <TrustItem
              icon={BadgeCheck}
              title={`${siteConfig.realtorName}, licensed realtor`}
              body={
                siteConfig.licenseNumber
                  ? `Georgia #${siteConfig.licenseNumber}`
                  : "Local guidance, without the pressure"
              }
            />
            <TrustItem
              icon={MapPinned}
              title="Atlanta-based"
              body="Buckhead, Midtown, all Georgia"
            />
            <TrustItem
              icon={Scale}
              title="Two clear paths"
              body="Cash and open market"
            />
            <TrustItem
              icon={ShieldCheck}
              title="No obligation"
              body="Review first. Decide later."
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
          <div className="max-w-[820px]">
            <h2 className="text-balance text-5xl font-black uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl">
              Sell the property.
              <span className="block text-[var(--accent)]">Not the headache.</span>
            </h2>
            <p className="mt-6 max-w-[560px] text-lg leading-7 text-[var(--muted)]">
              Start before you repair, clean out, move tenants, or relist.
            </p>
          </div>
          <div className="mt-12 grid border-2 border-[var(--ink)] sm:grid-cols-2 lg:grid-cols-5">
            {sellerSituations.map((item) => (
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
              Cash or market?
              <span className="block text-[var(--accent)]">
                Here is the tradeoff.
              </span>
            </h2>

            <div className="mt-12 border-2 border-[var(--ink)] bg-[var(--panel)]">
              <div className="grid grid-cols-2 border-b-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--panel)] sm:grid-cols-[0.62fr_1fr_1fr]">
                <div className="hidden p-4 sm:block" />
                <div className="p-4 font-semibold leading-5 sm:border-l sm:border-[var(--panel)]">
                  Cash path
                </div>
                <div className="border-l border-[var(--panel)] p-4 font-semibold leading-5">
                  Open market
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
                    {row.cash}
                  </div>
                  <div className="border-l border-[var(--ink)] p-4 text-sm leading-6 text-[var(--muted)]">
                    {row.market}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
          <h2 className="max-w-[720px] text-balance text-5xl font-black uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl">
            Three steps.
            <span className="block text-[var(--accent)]">One clear decision.</span>
          </h2>
          <div className="mt-14 grid border-y-2 border-[var(--ink)] md:grid-cols-3">
            <ProcessStep
              number="01"
              title="Share the address"
              body="Share the address and current condition."
            />
            <ProcessStep
              number="02"
              title="Compare the paths"
              body="Review a possible cash offer alongside an open-market plan."
            />
            <ProcessStep
              number="03"
              title="Choose your timing"
              body="Choose the price, certainty, and timing that fit."
            />
          </div>
        </section>

        <section className="border-y-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--panel)]">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.18fr_0.82fr] lg:items-end lg:px-10">
            <h2 className="text-[clamp(4rem,10vw,9rem)] font-black uppercase leading-[0.76] tracking-[-0.08em]">
              Buckhead
              <span className="block text-[var(--accent-on-dark)]">Midtown</span>
              Atlanta
            </h2>
            <div className="max-w-md border-t border-[var(--panel)] pt-6">
              <MapPinned
                aria-hidden
                className="size-7 text-[var(--accent-on-dark)]"
                strokeWidth={1.6}
              />
              <p className="mt-5 text-xl font-black">Local emphasis. Georgia reach.</p>
              <p className="mt-3 leading-7 text-[var(--on-dark-copy)]">
                Strong Atlanta market context with service available statewide.
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
                Not a buying script.
              </span>
            </h2>
            <p className="mt-6 max-w-[600px] text-lg leading-7 text-[var(--muted)]">
              {siteConfig.realtorName} walks you through the cash and listing
              paths so you can choose with the facts.
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
              <span className="block text-[var(--accent)]">say yes.</span>
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
                Compare your two best routes.
              </h2>
              <p className="mt-5 max-w-[470px] text-lg leading-7 text-[var(--muted)]">
                Start with the property. Keep the decision yours.
              </p>
            </div>
            <LeadForm compact />
          </div>
        </section>
      </main>
      <MobileCta />
      <SiteFooter />
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
