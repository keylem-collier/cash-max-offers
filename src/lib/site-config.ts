function readPublicValue(value: string | undefined) {
  return value?.trim() ?? "";
}

const DEFAULT_SCHEDULING_URL =
  "https://cal.com/bradford-jones-ncur6v/30min";
const DEFAULT_CAL_LINK = "bradford-jones-ncur6v/30min";

function calLinkFromSchedulingUrl(url: string) {
  try {
    const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
    return pathname || DEFAULT_CAL_LINK;
  } catch {
    return DEFAULT_CAL_LINK;
  }
}

const directPhoneDisplay = readPublicValue(
  process.env.NEXT_PUBLIC_DIRECT_PHONE_DISPLAY,
);
const directPhoneE164 = readPublicValue(
  process.env.NEXT_PUBLIC_DIRECT_PHONE_E164,
);
const contactEmail = readPublicValue(
  process.env.NEXT_PUBLIC_CONTACT_EMAIL,
);
const schedulingUrl =
  readPublicValue(process.env.NEXT_PUBLIC_SCHEDULING_URL) ||
  DEFAULT_SCHEDULING_URL;

export const siteConfig = {
  name: "Max Cash Offers",
  url:
    readPublicValue(process.env.NEXT_PUBLIC_SITE_URL) ||
    "https://cash-max-offers.vercel.app",
  realtorName: "Bradford Walsh",
  brokerageName:
    readPublicValue(process.env.NEXT_PUBLIC_BROKERAGE_NAME) ||
    "Brokerage details pending approval",
  licenseNumber: readPublicValue(
    process.env.NEXT_PUBLIC_GEORGIA_LICENSE_NUMBER,
  ),
  brokeragePhone: readPublicValue(
    process.env.NEXT_PUBLIC_BROKERAGE_PHONE_DISPLAY,
  ),
  directPhoneDisplay,
  directPhoneE164,
  contactEmail,
  privacyEmail:
    readPublicValue(process.env.NEXT_PUBLIC_PRIVACY_EMAIL) || contactEmail,
  schedulingUrl,
  calLink: calLinkFromSchedulingUrl(schedulingUrl),
  hasDirectPhone: Boolean(directPhoneDisplay && directPhoneE164),
  hasContactEmail: Boolean(contactEmail),
  hasScheduling: Boolean(schedulingUrl),
} as const;

export function telHref() {
  return siteConfig.hasDirectPhone
    ? `tel:${siteConfig.directPhoneE164}`
    : "#lead-form";
}

export function mailHref(subject = "My Georgia property") {
  if (!siteConfig.hasContactEmail) {
    return "#lead-form";
  }

  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}`;
}
