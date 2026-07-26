import Link from "next/link";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      aria-label="Cash Max Offers home"
    >
      <span
        aria-hidden
        className="grid size-10 place-items-center rounded-[3px] bg-[var(--ink)] text-[11px] font-bold leading-none tracking-normal text-[var(--panel)] transition-transform group-active:translate-y-px"
      >
        CM
      </span>
      <span className="whitespace-nowrap text-[14px] font-bold leading-none tracking-[-0.01em] text-[var(--ink)]">
        CASH MAX
        <span className="mt-0.5 block font-medium tracking-[0.15em] text-[var(--muted)]">
          OFFERS
        </span>
      </span>
    </Link>
  );
}
