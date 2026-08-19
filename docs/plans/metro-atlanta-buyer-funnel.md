# Metro Atlanta Buyer Campaign Funnel

Last reviewed: 2026-08-19

## Intent

Add a campaign-only funnel for Metro Atlanta buyers interested in discounted
properties and fixer-uppers. Preserve the seller homepage and its visual system.
Use personalized matching language without implying exclusive inventory,
guaranteed discounts, or guaranteed future value.

## Current Reality

- Production is the Vercel project `cash-max-offers`, deployed from GitHub
  `main` at `https://cash-max-offers.vercel.app`.
- The buyer route is `/atlanta-fixer-upper-homes`; its confirmation route is
  `/atlanta-fixer-upper-homes/next-steps`.
- The campaign is intentionally absent from the seller navigation and sitemap.
  Both buyer routes are `noindex, nofollow`.
- The visual structure, images, responsive classes, and conversion hierarchy
  are inherited from the seller homepage.
- The buyer hero uses a separate realistic, livable fixer-upper image; the
  seller homepage retains its existing property image.
- Bradford Jones is read from the shared site configuration.

## Integration Truth Gate

| Integration | Existing contract | Buyer behavior | Verification |
| --- | --- | --- | --- |
| Resend | Owner email must succeed; confirmation may fail without losing the lead | Buyer-specific owner and confirmation copy; buyer-specific idempotency keys | Unit tests; no unapproved production send |
| Meta / Google | Standard Lead/conversion events plus custom funnel events | Adds `funnel_type=buyer`; sends no submitted field values | Analytics tests and browser inspection |
| Google Places | Seller street-address autocomplete | Not used; buyer target area is plain text | Seller regression tests |
| Vercel | GitHub `main` creates production deployments | Same deployment path; no new project or environment values | Exact commit READY and route readback |

### Golden Lead Contract

| Item | Evidence |
| --- | --- |
| Endpoint | `POST /api/lead-intake` |
| Buyer request | `funnel`, `targetArea`, `fullName`, `fundingStatus`, `budgetRange`, `purchaseTimeline`, phone, email, source path, UTM, timing, honeypot |
| Buyer redirect | `/atlanta-fixer-upper-homes/next-steps` |
| Owner idempotency | `owner/buyer/{leadId}` |
| Confirmation idempotency | `buyer/{leadId}` |
| Failure invariant | Owner failure rejects; confirmation-only failure returns success with `confirmationEmailSent=false` |
| Readback | Unit tests locally; production route and deployment readback without a live form submission |

## Assumptions To Fight

| Assumption | Why it may be wrong | Decision / gate |
| --- | --- | --- |
| Every fixer is discounted | Repairs can consume the price difference | Copy explicitly says price is only one input |
| Inventory is exclusive or off-market | No listing feed or exclusive inventory contract exists | Make no exclusivity claim |
| Any property can be financed | Condition and lender requirements vary | FAQ directs buyers to confirm with their lender |
| Improvements guarantee equity | Repair cost and resale value vary | No appreciation or future-value guarantee |
| Deploying authorizes paid traffic | Georgia advertising still needs broker review | Broker approval remains the campaign activation gate |

## Technical Inventory

- Buyer pages: `src/app/atlanta-fixer-upper-homes/`
- Shared conversion components: header, footer, mobile CTA, brand mark, contact
  links, and lead form under `src/components/`
- Typed intake and email seams: `src/lib/lead-intake.ts`,
  `src/lib/email-content.ts`, `src/lib/email-delivery.ts`, and
  `src/app/api/lead-intake/route.ts`
- No database, CRM, IDX feed, SMS automation, queue, worker, or scheduler.

## Advisor Council

- **Contrarian:** A generic "cheap homes" page would attract unqualified leads
  and create unsupported expectations.
- **Assumption Ripper:** Discount, availability, financing, repair cost, and
  future value all require explicit qualification.
- **Expansionist:** Recurring alerts and inventory integrations may become useful
  after the manual matching workflow proves demand.
- **Executor:** Reuse the current route, delivery, analytics, and visual seams;
  add only a typed buyer branch.
- **Chair:** Ship the campaign route and defer every platform feature not needed
  for a truthful personalized follow-up.

## Lean-Code Gate

| Proposed build | Decision | Why |
| --- | --- | --- |
| Separate app or Vercel project | Delete | One campaign route is sufficient |
| Database or CRM | Defer | Existing owner email is the approved lead ledger |
| IDX/listing feed | Delete | No provider or inventory contract exists |
| Recurring deal alerts | Delete | The approved service is personalized matching |
| New location API | Delete | Plain target-area input is lower risk and fits the brief |
| Shared component variants | Keep narrow | Prevent seller/buyer CTA and analytics drift |

## Implementation Phases

1. Fast-forward clean `main` to the production source.
2. Add the discriminated buyer lead contract, delivery copy, idempotency, and
   analytics dimension while preserving seller behavior.
3. Add the buyer landing and confirmation routes with the existing layout.
4. Add buyer and seller regression tests, then run lint, typecheck, tests,
   build, browser checks, and code review when required.
5. Commit, push `main`, wait for the exact Vercel deployment, and read back the
   public routes without submitting a production lead.

## QA / Verification

- Buyer and seller validation, normalization, spam, field limits, and enums.
- Owner/confirmation email content, HTML escaping, partial failure, and
  idempotency.
- Buyer redirect and malformed request behavior.
- Funnel-tagged analytics with no contact or search criteria payloads.
- Keyboard flow, focus, error announcements, CTA safe zones, overflow, and
  responsive layout at 375x812, 390x844, 768x1024, and 1440x900.
- Buyer metadata is campaign-only and excluded from the sitemap.
- Production deployment is READY for the exact pushed commit; seller homepage
  remains unchanged.

## Rollback

Promote the prior READY Vercel deployment for immediate traffic recovery, then
revert the buyer-funnel commit on `main` and verify the resulting deployment.
Do not reset or rewrite shared history.

## What Not To Build First

Do not add recurring alerts, a property database, IDX, CRM routing, automated
SMS, listing ingestion, lead scoring, or a location-page factory.

## Context Compression Packet

- **Decision:** One noindex Metro Atlanta buyer funnel with personalized matching.
- **Non-negotiables:** Seller flow unchanged; no unsupported inventory, discount,
  financing, or appreciation claims; no PII in analytics.
- **Routes:** Buyer landing, buyer next steps, shared lead-intake API.
- **Integration:** Existing Resend and analytics only; Google Places stays seller-only.
- **Verification:** Full local checks, responsive browser pass, exact Vercel SHA
  and public readback, no unapproved live lead.
