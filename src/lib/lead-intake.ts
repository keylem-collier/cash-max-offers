export const TIMELINE_VALUES = [
  "asap",
  "30_days",
  "60_90_days",
  "exploring",
] as const;

export const CONDITION_VALUES = [
  "move_in_ready",
  "minor_work",
  "major_repairs",
  "not_sure",
] as const;

export type Timeline = (typeof TIMELINE_VALUES)[number];
export type PropertyCondition = (typeof CONDITION_VALUES)[number];

export type LeadIntakeInput = {
  leadId?: unknown;
  propertyAddress?: unknown;
  phone?: unknown;
  email?: unknown;
  timeline?: unknown;
  condition?: unknown;
  sourcePath?: unknown;
  utm?: unknown;
  startedAt?: unknown;
  company?: unknown;
};

export type LeadIntakeValues = {
  leadId: string;
  propertyAddress: string;
  phone: string;
  email: string;
  timeline: Timeline;
  condition: PropertyCondition;
  sourcePath: string;
  utm: Record<string, string>;
  startedAt: number;
};

export type LeadIntakeField =
  | "propertyAddress"
  | "phone"
  | "email"
  | "timeline"
  | "condition";

export type LeadIntakeErrors = Partial<Record<LeadIntakeField, string>>;

export type LeadIntakeResponse =
  | {
      ok: true;
      redirectPath: "/next-steps";
      confirmationEmailSent: boolean;
    }
  | {
      ok: false;
      errors?: LeadIntakeErrors;
      message: string;
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LEAD_ID_PATTERN = /^[a-zA-Z0-9_-]{8,80}$/;
const UTM_KEYS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
]);

function asString(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function isTimeline(value: string): value is Timeline {
  return TIMELINE_VALUES.includes(value as Timeline);
}

function isCondition(value: string): value is PropertyCondition {
  return CONDITION_VALUES.includes(value as PropertyCondition);
}

function normalizeUtm(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const normalized: Record<string, string> = {};

  for (const [key, rawValue] of Object.entries(value)) {
    if (UTM_KEYS.has(key) && typeof rawValue === "string") {
      normalized[key] = rawValue.trim().slice(0, 120);
    }
  }

  return normalized;
}

export function normalizePhone(value: string) {
  const hasLeadingPlus = value.trim().startsWith("+");
  const digits = value.replace(/\D/g, "");

  return `${hasLeadingPlus ? "+" : ""}${digits}`;
}

export function validateLeadIntake(input: LeadIntakeInput): {
  values: LeadIntakeValues | null;
  errors: LeadIntakeErrors;
  blockedAsSpam: boolean;
} {
  const propertyAddress = asString(input.propertyAddress, 180);
  const phone = normalizePhone(asString(input.phone, 40));
  const email = asString(input.email, 160).toLowerCase();
  const timeline = asString(input.timeline, 30);
  const condition = asString(input.condition, 30);
  const leadId = asString(input.leadId, 80);
  const sourcePath = asString(input.sourcePath, 240) || "/";
  const startedAt = Number(input.startedAt);
  const honeypot = asString(input.company, 120);
  const errors: LeadIntakeErrors = {};

  if (
    propertyAddress.length < 8 ||
    !/[a-z]/i.test(propertyAddress) ||
    !/\d/.test(propertyAddress)
  ) {
    errors.propertyAddress =
      "Enter the property street address, including the street number.";
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (
    phoneDigits.length < 10 ||
    phoneDigits.length > 15 ||
    /^(\d)\1+$/.test(phoneDigits)
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isTimeline(timeline)) {
    errors.timeline = "Choose the timeline that fits best.";
  }

  if (!isCondition(condition)) {
    errors.condition = "Choose the closest property condition.";
  }

  const validLeadId = LEAD_ID_PATTERN.test(leadId)
    ? leadId
    : `lead-${globalThis.crypto.randomUUID()}`;

  return {
    values:
      Object.keys(errors).length === 0
        ? {
            leadId: validLeadId,
            propertyAddress,
            phone,
            email,
            timeline: timeline as Timeline,
            condition: condition as PropertyCondition,
            sourcePath,
            utm: normalizeUtm(input.utm),
            startedAt: Number.isFinite(startedAt) ? startedAt : Date.now(),
          }
        : null,
    errors,
    blockedAsSpam: Boolean(honeypot),
  };
}

export function timelineLabel(value: Timeline) {
  return {
    asap: "As soon as possible",
    "30_days": "Within 30 days",
    "60_90_days": "Within 60-90 days",
    exploring: "Just exploring",
  }[value];
}

export function conditionLabel(value: PropertyCondition) {
  return {
    move_in_ready: "Move-in ready",
    minor_work: "Needs minor work",
    major_repairs: "Needs major repairs",
    not_sure: "Not sure",
  }[value];
}
