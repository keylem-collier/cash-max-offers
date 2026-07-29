"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { trackFunnelEvent, trackLeadConversion } from "@/lib/analytics";
import type {
  LeadIntakeErrors,
  LeadIntakeResponse,
  PropertyCondition,
  Timeline,
} from "@/lib/lead-intake";
import { siteConfig, telHref } from "@/lib/site-config";
import { ContactLink } from "@/components/contact-link";

type FormValues = {
  propertyAddress: string;
  phone: string;
  email: string;
  timeline: "" | Timeline;
  condition: "" | PropertyCondition;
  company: string;
};

const initialValues: FormValues = {
  propertyAddress: "",
  phone: "",
  email: "",
  timeline: "",
  condition: "",
  company: "",
};

const inputClass =
  "min-h-12 w-full rounded-[4px] border border-[var(--input-line)] bg-[var(--input)] px-4 text-base text-[var(--ink)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[color:var(--accent-soft)]";

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const formId = compact ? "lead-form-secondary" : "lead-form";
  const [step, setStep] = useState<"property" | "contact">("property");
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<LeadIntakeErrors>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadId] = useState(() => globalThis.crypto.randomUUID());
  const [startedAt] = useState(() => Date.now());
  const startedTracking = useRef(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (step !== "contact") {
      return;
    }

    const focusDelay = reduceMotion ? 0 : 320;
    const focusTimer = window.setTimeout(
      () => phoneInputRef.current?.focus(),
      focusDelay,
    );

    return () => window.clearTimeout(focusTimer);
  }, [reduceMotion, step]);

  function markStarted() {
    if (!startedTracking.current) {
      startedTracking.current = true;
      trackFunnelEvent("form_started");
    }
  }

  function updateField<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field as keyof LeadIntakeErrors];
      return next;
    });
    setStatusMessage("");
  }

  function continueToContact() {
    const address = values.propertyAddress.trim();

    if (address.length < 8 || !/[a-z]/i.test(address) || !/\d/.test(address)) {
      setErrors({
        propertyAddress:
          "Enter the property street address, including the street number.",
      });
      addressInputRef.current?.focus();
      return;
    }

    trackFunnelEvent("address_completed");
    setStep("contact");
  }

  function campaignValues() {
    const allowed = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
      "fbclid",
    ];
    const params = new URLSearchParams(window.location.search);

    return Object.fromEntries(
      allowed
        .map((key) => [key, params.get(key) ?? ""] as const)
        .filter(([, value]) => Boolean(value)),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === "property") {
      continueToContact();
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");
    setErrors({});

    try {
      const response = await fetch("/api/lead-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          leadId,
          sourcePath: window.location.pathname,
          utm: campaignValues(),
          startedAt,
        }),
      });
      const result = (await response.json()) as LeadIntakeResponse;

      if (!response.ok || !result.ok) {
        setErrors(result.ok ? {} : result.errors ?? {});
        setStatusMessage(
          result.ok
            ? "We could not send your request. Please try again."
            : result.message,
        );
        return;
      }

      trackLeadConversion();
      window.location.assign(result.redirectPath);
    } catch {
      setStatusMessage(
        "We could not send your request. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <form
      id={formId}
      data-mobile-cta-safe-zone
      onSubmit={handleSubmit}
      onFocusCapture={markStarted}
      className={`scroll-mt-28 border-2 border-[var(--ink)] bg-[var(--panel)] shadow-[10px_10px_0_var(--ink)] ${
        compact ? "p-5 sm:p-6" : "p-5 sm:p-7"
      }`}
      noValidate
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-bold leading-6 text-[var(--ink)]">
            {step === "property" ? "Start with the address" : "How should we reach you?"}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {step === "property"
              ? "Step 1 of 2. Address required."
              : "Step 2 of 2. All fields required."}
          </p>
        </div>
        <div
          className="flex gap-1.5"
          aria-label={step === "property" ? "First screen of two" : "Second screen of two"}
        >
          <span className="h-1.5 w-8 bg-[var(--accent)]" />
          <span
            className={`h-1.5 w-8 ${
              step === "contact"
                ? "bg-[var(--accent)]"
                : "bg-[var(--line-strong)]"
            }`}
          />
        </div>
      </div>

      <div className="sr-only" aria-hidden>
        <label htmlFor={`company-${compact ? "compact" : "hero"}`}>
          Company
        </label>
        <input
          id={`company-${compact ? "compact" : "hero"}`}
          name="company"
          value={values.company}
          onChange={(event) => updateField("company", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === "property" ? (
          <motion.div
            key="property"
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: 10 }}
            transition={transition}
          >
            <label
              htmlFor={`property-${compact ? "compact" : "hero"}`}
              className="mb-2 block text-sm font-semibold text-[var(--ink)]"
            >
              Property address
            </label>
            <div className="relative">
              <MapPin
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--muted)]"
                strokeWidth={1.8}
              />
              <input
                ref={addressInputRef}
                id={`property-${compact ? "compact" : "hero"}`}
                name="propertyAddress"
                type="text"
                inputMode="text"
                autoComplete="street-address"
                required
                value={values.propertyAddress}
                onChange={(event) =>
                  updateField("propertyAddress", event.target.value)
                }
                aria-invalid={Boolean(errors.propertyAddress)}
                aria-describedby={
                  errors.propertyAddress
                    ? `property-error-${compact ? "compact" : "hero"}`
                    : undefined
                }
                className={`${inputClass} pl-12`}
                placeholder="123 Peachtree Street NE"
              />
            </div>
            <FieldError
              id={`property-error-${compact ? "compact" : "hero"}`}
              message={errors.propertyAddress}
            />
            <button
              type="submit"
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-[6px] bg-[var(--ink)] px-5 text-base font-semibold leading-5 tracking-[0.005em] text-[var(--panel)] transition-transform hover:-translate-y-0.5 active:translate-y-px"
            >
              Get My Cash Offer
              <ArrowRight aria-hidden className="size-4" strokeWidth={1.8} />
            </button>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[var(--muted)]">
              <Check
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-[var(--accent-strong)]"
                strokeWidth={2}
              />
              Cash-offer request plus a market review. No repairs to start. No
              obligation.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="contact"
            initial={reduceMotion ? false : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -10 }}
            transition={transition}
            className="grid gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Phone"
                id={`phone-${compact ? "compact" : "hero"}`}
                error={errors.phone}
              >
                <input
                  ref={phoneInputRef}
                  id={`phone-${compact ? "compact" : "hero"}`}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={values.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={
                    errors.phone
                      ? `phone-${compact ? "compact" : "hero"}-error`
                      : undefined
                  }
                  className={inputClass}
                  placeholder="(404) 555-0123"
                />
              </Field>
              <Field
                label="Email"
                id={`email-${compact ? "compact" : "hero"}`}
                error={errors.email}
              >
                <input
                  id={`email-${compact ? "compact" : "hero"}`}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email
                      ? `email-${compact ? "compact" : "hero"}-error`
                      : undefined
                  }
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </Field>
            </div>

            <PillField
              legend="When would you like to sell?"
              name="timeline"
              idPrefix={`timeline-${compact ? "compact" : "hero"}`}
              value={values.timeline}
              error={errors.timeline}
              options={[
                ["asap", "ASAP"],
                ["30_days", "30 days"],
                ["60_90_days", "60-90 days"],
                ["exploring", "Exploring"],
              ]}
              onChange={(value) =>
                updateField("timeline", value as FormValues["timeline"])
              }
            />

            <PillField
              legend="What shape is the property in?"
              name="condition"
              idPrefix={`condition-${compact ? "compact" : "hero"}`}
              value={values.condition}
              error={errors.condition}
              options={[
                ["move_in_ready", "Move-in ready"],
                ["minor_work", "Minor work"],
                ["major_repairs", "Major repairs"],
                ["not_sure", "Not sure"],
              ]}
              onChange={(value) =>
                updateField("condition", value as FormValues["condition"])
              }
            />

            {statusMessage ? (
              <div
                role="alert"
                className="rounded-[12px] border border-[var(--error-line)] bg-[var(--error-soft)] px-4 py-3 text-sm leading-6 text-[var(--error)]"
              >
                {statusMessage}
                {siteConfig.hasDirectPhone ? (
                  <>
                    {" "}
                    <ContactLink
                      kind="call"
                      href={telHref()}
                      className="font-bold underline underline-offset-2"
                    >
                      Call {siteConfig.directPhoneDisplay}
                    </ContactLink>
                    .
                  </>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep("property")}
                className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-[var(--ink)] px-5 text-sm font-bold text-[var(--ink)] transition-colors hover:bg-[var(--surface)] active:translate-y-px sm:w-auto"
              >
                <ArrowLeft aria-hidden className="size-4" strokeWidth={1.8} />
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] bg-[var(--ink)] px-5 text-base font-semibold leading-5 tracking-[0.005em] text-[var(--panel)] transition-transform hover:-translate-y-0.5 active:translate-y-px disabled:cursor-wait disabled:opacity-65"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      aria-hidden
                      className="size-4 animate-spin motion-reduce:animate-none"
                      strokeWidth={1.8}
                    />
                    Sending request
                  </>
                ) : (
                  <>
                    Get My Cash Offer
                    <ArrowRight
                      aria-hidden
                      className="size-4"
                      strokeWidth={1.8}
                    />
                  </>
                )}
              </button>
            </div>

            <p className="text-sm leading-6 text-[var(--muted)]">
              By submitting, you agree Max Cash Offers may call, text, or email
              about this property. Consent isn’t required to choose an option.
              No recurring marketing texts. Read our{" "}
              <Link
                href="/privacy"
                className="font-semibold text-[var(--ink)] underline underline-offset-2"
              >
                privacy notice
              </Link>
              .
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function PillField({
  legend,
  name,
  idPrefix,
  value,
  error,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  idPrefix: string;
  value: string;
  error?: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  const errorId = `${idPrefix}-error`;

  return (
    <fieldset
      aria-invalid={Boolean(error)}
      aria-required="true"
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="mb-2 text-sm font-semibold text-[var(--ink)]">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([optionValue, label]) => {
          const id = `${idPrefix}-${optionValue}`;

          return (
            <label key={optionValue} htmlFor={id} className="cursor-pointer">
              <input
                id={id}
                name={name}
                type="radio"
                value={optionValue}
                checked={value === optionValue}
                required
                onChange={(event) => onChange(event.target.value)}
                aria-describedby={error ? errorId : undefined}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 items-center rounded-full border border-[var(--input-line)] bg-[var(--input)] px-4 text-sm font-semibold leading-5 text-[var(--muted)] transition-[background-color,color,border-color,transform] peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)] peer-checked:text-[var(--panel)] peer-focus-visible:ring-4 peer-focus-visible:ring-[var(--accent-soft)] active:scale-[0.98]">
                {label}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-[var(--ink)]"
      >
        {label}
      </label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-2 text-xs font-semibold text-[var(--error)]">
      {message}
    </p>
  );
}
