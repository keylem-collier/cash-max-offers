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

export const BUDGET_RANGE_VALUES = [
  "under_250k",
  "250k_400k",
  "400k_600k",
  "600k_plus",
  "not_sure",
] as const;

export const PURCHASE_TIMELINE_VALUES = [
  "ready_now",
  "1_3_months",
  "3_6_months",
  "exploring",
] as const;

export const FUNDING_STATUS_VALUES = [
  "cash",
  "financing_preapproved",
  "financing_not_preapproved",
] as const;

export type FunnelType = "seller" | "buyer";
export type Timeline = (typeof TIMELINE_VALUES)[number];
export type PropertyCondition = (typeof CONDITION_VALUES)[number];
export type BudgetRange = (typeof BUDGET_RANGE_VALUES)[number];
export type PurchaseTimeline = (typeof PURCHASE_TIMELINE_VALUES)[number];
export type FundingStatus = (typeof FUNDING_STATUS_VALUES)[number];

export type LeadIntakeInput = {
  funnel?: unknown;
  leadId?: unknown;
  propertyAddress?: unknown;
  targetArea?: unknown;
  fullName?: unknown;
  phone?: unknown;
  email?: unknown;
  timeline?: unknown;
  condition?: unknown;
  budgetRange?: unknown;
  purchaseTimeline?: unknown;
  fundingStatus?: unknown;
  sourcePath?: unknown;
  utm?: unknown;
  startedAt?: unknown;
  company?: unknown;
};

type CommonLeadIntakeValues = {
  leadId: string;
  phone: string;
  email: string;
  sourcePath: string;
  utm: Record<string, string>;
  startedAt: number;
};

export type SellerLeadIntakeValues = CommonLeadIntakeValues & {
  funnel: "seller";
  propertyAddress: string;
  timeline: Timeline;
  condition: PropertyCondition;
};

export type BuyerLeadIntakeValues = CommonLeadIntakeValues & {
  funnel: "buyer";
  targetArea: string;
  fullName: string;
  budgetRange: BudgetRange;
  purchaseTimeline: PurchaseTimeline;
  fundingStatus: FundingStatus;
};

export type LeadIntakeValues =
  | SellerLeadIntakeValues
  | BuyerLeadIntakeValues;

export type LeadIntakeField =
  | "propertyAddress"
  | "targetArea"
  | "fullName"
  | "phone"
  | "email"
  | "timeline"
  | "condition"
  | "budgetRange"
  | "purchaseTimeline"
  | "fundingStatus";

export type LeadIntakeErrors = Partial<Record<LeadIntakeField, string>>;

export type LeadIntakeResponse =
  | {
      ok: true;
      redirectPath:
        | "/next-steps"
        | "/atlanta-fixer-upper-homes/next-steps";
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

function isBudgetRange(value: string): value is BudgetRange {
  return BUDGET_RANGE_VALUES.includes(value as BudgetRange);
}

function isPurchaseTimeline(value: string): value is PurchaseTimeline {
  return PURCHASE_TIMELINE_VALUES.includes(value as PurchaseTimeline);
}

function isFundingStatus(value: string): value is FundingStatus {
  return FUNDING_STATUS_VALUES.includes(value as FundingStatus);
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
  // Missing funnel remains compatible with seller forms submitted before the
  // buyer campaign launched. Only an explicit buyer value selects buyer rules.
  const funnel: FunnelType = input.funnel === "buyer" ? "buyer" : "seller";
  const phone = normalizePhone(asString(input.phone, 40));
  const email = asString(input.email, 160).toLowerCase();
  const leadId = asString(input.leadId, 80);
  const sourcePath = asString(input.sourcePath, 240) || "/";
  const startedAt = Number(input.startedAt);
  const honeypot = asString(input.company, 120);
  const errors: LeadIntakeErrors = {};

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

  const validLeadId = LEAD_ID_PATTERN.test(leadId)
    ? leadId
    : `lead-${globalThis.crypto.randomUUID()}`;
  const commonValues: CommonLeadIntakeValues = {
    leadId: validLeadId,
    phone,
    email,
    sourcePath,
    utm: normalizeUtm(input.utm),
    startedAt: Number.isFinite(startedAt) ? startedAt : Date.now(),
  };

  let values: LeadIntakeValues | null = null;

  if (funnel === "buyer") {
    const targetArea = asString(input.targetArea, 180);
    const fullName = asString(input.fullName, 100);
    const budgetRange = asString(input.budgetRange, 30);
    const purchaseTimeline = asString(input.purchaseTimeline, 30);
    const fundingStatus = asString(input.fundingStatus, 40);

    if (targetArea.length < 2 || !/[a-z0-9]/i.test(targetArea)) {
      errors.targetArea = "Enter a Metro Atlanta area, city, or ZIP code.";
    }

    if (fullName.length < 2 || !/[a-z]/i.test(fullName)) {
      errors.fullName = "Enter your name.";
    }

    if (!isBudgetRange(budgetRange)) {
      errors.budgetRange = "Choose the budget range that fits best.";
    }

    if (!isPurchaseTimeline(purchaseTimeline)) {
      errors.purchaseTimeline = "Choose when you expect to buy.";
    }

    if (!isFundingStatus(fundingStatus)) {
      errors.fundingStatus = "Choose how you plan to buy.";
    }

    if (Object.keys(errors).length === 0) {
      values = {
        ...commonValues,
        funnel,
        targetArea,
        fullName,
        budgetRange: budgetRange as BudgetRange,
        purchaseTimeline: purchaseTimeline as PurchaseTimeline,
        fundingStatus: fundingStatus as FundingStatus,
      };
    }
  } else {
    const propertyAddress = asString(input.propertyAddress, 180);
    const timeline = asString(input.timeline, 30);
    const condition = asString(input.condition, 30);

    if (
      propertyAddress.length < 8 ||
      !/[a-z]/i.test(propertyAddress) ||
      !/\d/.test(propertyAddress)
    ) {
      errors.propertyAddress =
        "Enter the property street address, including the street number.";
    }

    if (!isTimeline(timeline)) {
      errors.timeline = "Choose the timeline that fits best.";
    }

    if (!isCondition(condition)) {
      errors.condition = "Choose the closest property condition.";
    }

    if (Object.keys(errors).length === 0) {
      values = {
        ...commonValues,
        funnel,
        propertyAddress,
        timeline: timeline as Timeline,
        condition: condition as PropertyCondition,
      };
    }
  }

  return {
    values,
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

export function budgetRangeLabel(value: BudgetRange) {
  return {
    under_250k: "Under $250K",
    "250k_400k": "$250K-$400K",
    "400k_600k": "$400K-$600K",
    "600k_plus": "$600K+",
    not_sure: "Not sure",
  }[value];
}

export function purchaseTimelineLabel(value: PurchaseTimeline) {
  return {
    ready_now: "Ready now",
    "1_3_months": "Within 1-3 months",
    "3_6_months": "Within 3-6 months",
    exploring: "Just exploring",
  }[value];
}

export function fundingStatusLabel(value: FundingStatus) {
  return {
    cash: "Cash",
    financing_preapproved: "Financing - preapproved",
    financing_not_preapproved: "Financing - not yet preapproved",
  }[value];
}

export function leadRedirectPath(funnel: FunnelType) {
  return funnel === "buyer"
    ? ("/atlanta-fixer-upper-homes/next-steps" as const)
    : ("/next-steps" as const);
}
