# Max Cash Offers High-Conversion Landing Page

Last reviewed: 2026-07-26

## Revision: Editorial Conversion Pass

- Committed to one visual language: Atlanta property advisory dossier with
  warm paper, black rules, red-clay accents, uppercase display type, and hard
  rectangular framing.
- Removed soft bento styling and reduced each section to one primary point.
- Replaced timeline and condition dropdowns with accessible radio pills.
- Standardized every primary CTA as "Get My Cash Offer." Competitor research
  showed that the concrete offer outcome is stronger than process language.
- Kept seven-day closing language out until the owner verifies that timing for
  the advertised cash path.
- Rebuilt the cash-versus-market explanation as a compact comparison table.
- Kept the expanded mobile form in document flow so it cannot overlap the hero.
- Reserved the heaviest type weight for display headlines. Small CTAs, labels,
  navigation, pills, and the logo use semibold weights, open tracking, and
  calmer line height for older homeowners.
- Tightened the message around the three questions seller research surfaces
  most clearly: likely proceeds, timing, and whether the transaction will hold
  together.

## Intent

Build a paid-traffic-first landing page for Georgia homeowners who want a clear
way to compare a cash offer with an open-market listing. The page must feel
premium enough for Buckhead and Midtown while remaining direct and useful for
sellers anywhere in Georgia.

The primary message is:

> A cash offer when speed matters. A better option when it doesn't.

## Current Reality

- The repository began as an empty Git repository.
- Max Cash Offers is positioned as a licensed-realtor-led advisory path, not an
  anonymous direct-buyer funnel.
- Realtor identity, brokerage, license, phone, email, headshot, testimonials,
  and numerical claims have not been verified.
- The first release must not invent those details.

## Reference Decisions

| Reference | Reuse | Avoid |
| --- | --- | --- |
| Christian & Timbers | Pain, process, proof, intake, FAQ progression | Heavy qualification and excessive section count |
| TravelBay | Low-friction intake and direct next-steps page | Popup and browser storage of lead PII |
| OurFirm.ai | Audience-specific pain, workflow, and objections | One-field intake and unrelated pricing content |

## Integration Truth Gate

### Representative Reality Matrix

| Variant | Current state | Supported | Proof needed |
| --- | --- | --- | --- |
| Owner notification | Resend implementation exists locally | Yes, after configuration | Verified domain, recipient, one test send |
| Seller confirmation | Resend implementation exists locally | Yes, after configuration | One test send and inbox readback |
| Meta conversion | Environment-gated script | Yes, when configured | Pixel ID and Events Manager readback |
| Google Ads conversion | Environment-gated script | Yes, when configured | Ads ID, label, and conversion readback |

### Golden Email Contract

| Item | Evidence |
| --- | --- |
| Action | Resend `emails.send` |
| Payload | `from`, `to`, `replyTo`, `subject`, `text`, `html` |
| Duplicate prevention | Distinct `owner/{leadId}` and `seller/{leadId}` idempotency keys |
| Required invariant | Owner delivery must succeed before the API reports success |
| Partial failure | Seller-email failure returns success with `confirmationEmailSent: false` |
| Verification | Provider message ID plus inbox readback |
| No-op behavior | Missing configuration returns a bounded server error |

## Assumptions To Fight

| Assumption | Why it may be wrong | Verification | Risk |
| --- | --- | --- | --- |
| Max Cash Offers can advertise a direct offer | The offer may come from a partner buyer | Broker and owner approval | Misleading advertising |
| The realtor can advertise under this brand | Brokerage supervision and naming rules apply | Written broker approval | Georgia license violation |
| Speed and fee claims apply to every lead | Terms vary by buyer and selling path | Approve each claim | False expectations |
| Phone follow-up is manual | A CRM could later automate messages | Confirm workflow before adding SMS | Consent violation |

## Technical Inventory

- Next.js App Router under `src/app`
- Client-only form and analytics leaves under `src/components`
- Lead validation and typed contracts under `src/lib/lead-intake.ts`
- Lazy Resend initialization under `src/lib/resend.ts`
- Static public site configuration under `src/lib/site-config.ts`
- Routes: `/`, `/next-steps`, `/privacy`, `/api/lead-intake`
- No database, CRM, CMS, authentication, worker, queue, or scheduler

## Advisor Council

- **Contrarian:** A cash-buyer-style page can damage trust if it hides the
  realtor's incentive or implies guarantees.
- **Assumption Ripper:** Every identity, brokerage, offer-source, fee, speed,
  and proof claim must be verified before launch.
- **Expansionist:** Future location pages and CRM routing may help, but only
  after conversion data proves the need.
- **Executor:** Ship one static page, one typed form route, two emails, and one
  direct next-steps page.
- **Chair:** Lead with transparent optionality and defer all unverified scale
  systems and claims.

## Lean-Code Gate

| Proposed build | Decision | Why |
| --- | --- | --- |
| Database | Delete from v1 | Email is the chosen ledger for the first proof |
| CRM webhook | Defer | No provider selected |
| Automated SMS | Delete from v1 | Consent and provider contract are unresolved |
| CAPTCHA | Defer | Honeypot and bounded validation are enough until abuse appears |
| Location-page factory | Delete from v1 | One paid-traffic page is the approved scope |
| Motion framework usage | Shrink | Use only for the form state transition |

## Implementation Phases

1. Completed: Scaffold the app, brand tokens, configuration contract, and
   generated hero asset.
2. Completed: Build the static conversion narrative and responsive navigation.
3. Completed: Build the two-step lead form, server validation, Resend delivery,
   and next-steps route.
4. Completed: Add privacy, environment-gated tracking, unit tests, browser
   verification, and launch-gate documentation.

## QA And Verification

- Lint, typecheck, unit tests, and production build.
- Test owner success, owner failure, seller failure, invalid input, honeypot,
  HTML escaping, and idempotent retry construction.
- Verify keyboard use, field focus, error announcements, reduced motion,
  contrast, and no horizontal overflow.
- Inspect 375x812, 390x844, 768x1024, and 1440x900.
- Confirm analytics never receives property address, phone, or email.
- Confirm public output has no fake phone, email, license, brokerage, review, or
  numeric offer claim.

### Verification Readback

- ESLint, TypeScript, 15 unit tests, and the Next.js production build pass.
- `npm audit` reports zero known vulnerabilities.
- Browser checks pass at 375x812, 390x844, 768x1024, 1366x650, and 1440x900
  with no horizontal overflow, browser errors, or framework overlay.
- The first form screen advances by keyboard, the second screen focuses Phone,
  and the mobile CTA clears active forms and footer disclosures.
- Codex review findings for malformed JSON, fallback ID collisions, and field
  error associations were fixed and covered by regression checks.

## Launch Gates

- Supply and verify all values documented in `.env.example`.
- Replace the realtor headshot placeholder with the real approved image.
- Obtain written broker approval.
- Clarify the source of any cash offer.
- Run one approved live lead submission and verify both provider IDs and inboxes.
- Verify Meta and Google conversions only if those integrations are configured.

## Context Compression Packet

- **Decision:** Premium licensed-local-advisor positioning with transparent
  cash-versus-listing options.
- **Non-negotiables:** No invented claims, no PII in analytics or browser
  storage, owner email must succeed before redirect.
- **Routes:** `/`, `/next-steps`, `/privacy`, `/api/lead-intake`.
- **Integration:** Resend only; tracking is optional and environment-gated.
- **Open launch data:** Identity, brokerage, license, contact details, headshot,
  testimonials, offer-source language, and any numerical claims.
- **Verification:** Tests, build, responsive browser pass, broker approval, and
  one live email proof.
