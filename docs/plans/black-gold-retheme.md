# Black & Gold Design Language Retheme

Last reviewed: 2026-07-30

## Intent

Shift Max Cash Offers from forest-green to black & antique gold while keeping
the editorial layout, type, and hard-rule structure unchanged.

**Committed direction:** light paper foundation, near-black ink/structure,
antique gold accents, true-black dark bands with brighter gold highlights.

## Final Token Map

| Role | Token | Hex / value |
| --- | --- | --- |
| Page background | `--paper` | `#F2EFE6` |
| Paper alpha | `--paper-alpha` | `rgba(242, 239, 230, 0.92)` |
| Cards/forms | `--panel` | `#FFFCF5` |
| Alternate bands | `--surface` | `#E6E1D4` |
| Inputs | `--input` | `#FFFDF8` |
| Structure/text | `--ink` | `#0C0C0C` |
| Secondary text | `--muted` | `#5E5B53` |
| Placeholder | `--placeholder` | `#7A766C` |
| Deep black | `--ink-deep` | `#000000` |
| Copy on dark | `--on-dark-copy` | `#D8D0BC` |
| Accent on light | `--accent` | `#9C7C2F` |
| Accent on black | `--accent-on-dark` | `#D4AF37` |
| Strong accent | `--accent-strong` | `#7E6323` |
| Soft focus | `--accent-soft` | `rgba(156, 124, 47, 0.16)` |
| Rules | `--line` | `#D4CFC2` |
| Strong rules | `--line-strong` | `#8F8A7E` |
| Input rules | `--input-line` | `#8A867C` |
| Error | `--error` | `#9C2F2F` (unchanged) |

Removed: `--forest`, `--forest-deep`, `--forest-muted`, `--forest-copy`.

## Email Hex Alignment

| Role | Hex |
| --- | --- |
| Body / panel bg | `#F2EFE6` / `#FFFCF5` |
| Border | `#D4CFC2` |
| Header / primary button | `#0C0C0C` |
| Header label | `#D4AF37` |
| Body text | `#0C0C0C` |
| Muted label/copy | `#5E5B53` |
| Secondary button border | `#8F8A7E` |

## Implementation Status

- [x] Living doc with final hex map
- [x] Token remint + forest rename in CSS/TSX
- [x] Residue cleanup (shadows, next-steps, emails)
- [x] Verification

## Verification Checklist

- [x] `rg "forest|#16352c|#2f7448|19,54,43|13,43,34" src` → no matches
- [x] `npm test` → 17/17 pass; `npm run typecheck` clean
- [x] Visual smoke on `localhost:3001`: home hero gold accent readable on paper; trust band `rgb(12,12,12)` with gold icons; next-steps/privacy use light paper + black chrome
- [x] Computed tokens confirmed: `--accent #9c7c2f`, `--accent-on-dark #d4af37`, `--ink #0c0c0c`, `--paper #f2efe6`; `--forest` removed
- Contrast note: antique gold `#9C7C2F` on paper reads clearly on large display headlines; no darken needed for v1

## Context Compression Packet

- **Decision:** Light-paper black & gold remint via CSS tokens. Shipped.
- **Non-negotiables:** No layout rewrite; primary CTAs stay black; no green residue.
- **Files changed:** `globals.css`, `page.tsx`, `next-steps/page.tsx`, `mobile-cta.tsx`, `email-content.ts`, `docs/plans/black-gold-retheme.md`.
- **Next phase:** None for retheme. Optional later: brand kit / OG / favicon alignment.
