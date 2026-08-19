import {
  budgetRangeLabel,
  conditionLabel,
  purchaseTimelineLabel,
  timelineLabel,
  type BuyerLeadIntakeValues,
  type LeadIntakeValues,
  type SellerLeadIntakeValues,
} from "./lead-intake";

export type EmailBusinessConfig = {
  siteName: string;
  realtorName: string;
  phoneDisplay: string;
  phoneE164: string;
  contactEmail: string;
  siteUrl: string;
};

export type EmailMessage = {
  subject: string;
  text: string;
  html: string;
};

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function detailsText(lead: LeadIntakeValues) {
  const utm = Object.entries(lead.utm)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const leadDetails =
    lead.funnel === "buyer"
      ? [
          `Target area: ${lead.targetArea}`,
          `Budget: ${budgetRangeLabel(lead.budgetRange)}`,
          `Purchase timeline: ${purchaseTimelineLabel(lead.purchaseTimeline)}`,
        ]
      : [
          `Property: ${lead.propertyAddress}`,
          `Timeline: ${timelineLabel(lead.timeline)}`,
          `Condition: ${conditionLabel(lead.condition)}`,
        ];

  return [
    `Funnel: ${lead.funnel}`,
    ...leadDetails,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Source: ${lead.sourcePath}`,
    `Lead ID: ${lead.leadId}`,
    utm ? `Campaign details:\n${utm}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function detailsHtml(lead: LeadIntakeValues) {
  const leadRows =
    lead.funnel === "buyer"
      ? [
          ["Target area", lead.targetArea],
          ["Budget", budgetRangeLabel(lead.budgetRange)],
          ["Purchase timeline", purchaseTimelineLabel(lead.purchaseTimeline)],
        ]
      : [
          ["Property", lead.propertyAddress],
          ["Timeline", timelineLabel(lead.timeline)],
          ["Condition", conditionLabel(lead.condition)],
        ];
  const rows = [
    ["Funnel", lead.funnel],
    ...leadRows,
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Source", lead.sourcePath],
    ["Lead ID", lead.leadId],
  ];

  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:9px 0;color:#5e5b53;font-size:14px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:9px 0 9px 18px;color:#0c0c0c;font-size:14px;font-weight:700;text-align:right;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
}

export function buildOwnerEmail(
  lead: LeadIntakeValues,
  business: EmailBusinessConfig,
): EmailMessage {
  const isBuyer = lead.funnel === "buyer";
  const subject = isBuyer
    ? `New Metro Atlanta buyer lead: ${lead.targetArea}`
    : `New Georgia seller lead: ${lead.propertyAddress}`;
  const summary = isBuyer
    ? "A buyer requested personalized fixer-upper matches"
    : "A homeowner requested selling options";
  const heading = isBuyer
    ? "A Metro Atlanta buyer wants fixer-upper matches."
    : "A Georgia homeowner wants to compare selling options.";
  const text = `${summary} through ${business.siteName}.

${detailsText(lead)}

Follow up directly while the request is fresh.`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f2efe6;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0c0c0c;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:separate;background:#fffcf5;border:1px solid #d4cfc2;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:28px;background:#0c0c0c;color:#fffcf5;">
                <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#d4af37;">${escapeHtml(business.siteName)}</p>
                <h1 style="margin:0;font-size:28px;line-height:34px;">${escapeHtml(heading)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  ${detailsHtml(lead)}
                </table>
                <p style="margin:24px 0 0;color:#5e5b53;font-size:14px;line-height:22px;">Follow up directly while the request is fresh.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

export function buildSellerEmail(
  lead: SellerLeadIntakeValues,
  business: EmailBusinessConfig,
): EmailMessage {
  const subject = `${business.siteName} received your property request`;
  const directContact = [
    business.phoneDisplay ? `Call or text: ${business.phoneDisplay}` : "",
    business.contactEmail ? `Email: ${business.contactEmail}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const text = `Thanks for sharing your property with ${business.siteName}.

We received your request for:
${lead.propertyAddress}

The next step is a straightforward review of the property, your timing, and the selling paths that may fit. There is no obligation to accept an offer or list the property.

${directContact}

${business.realtorName}
${business.siteName}`;

  const phoneButton =
    business.phoneDisplay && business.phoneE164
      ? `<a href="tel:${escapeHtml(business.phoneE164)}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 18px;border-radius:999px;background:#0c0c0c;color:#fffcf5;font-size:14px;font-weight:700;text-decoration:none;">Call ${escapeHtml(business.phoneDisplay)}</a>`
      : "";
  const emailButton = business.contactEmail
    ? `<a href="mailto:${escapeHtml(business.contactEmail)}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 18px;border:1px solid #8f8a7e;border-radius:999px;color:#0c0c0c;font-size:14px;font-weight:700;text-decoration:none;">Email us</a>`
    : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f2efe6;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0c0c0c;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:separate;background:#fffcf5;border:1px solid #d4cfc2;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:28px;background:#0c0c0c;color:#fffcf5;">
                <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#d4af37;">${escapeHtml(business.siteName)}</p>
                <h1 style="margin:0;font-size:30px;line-height:36px;">Your property request is in.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 18px;font-size:16px;line-height:26px;">Thanks for sharing your property. We will review your timing and the selling paths that may fit.</p>
                <div style="margin:0 0 24px;padding:18px;border-radius:14px;background:#f2efe6;">
                  <p style="margin:0 0 6px;color:#5e5b53;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;">Property</p>
                  <p style="margin:0;font-size:17px;font-weight:700;">${escapeHtml(lead.propertyAddress)}</p>
                </div>
                <p style="margin:0 0 22px;color:#5e5b53;font-size:14px;line-height:23px;">There is no obligation to accept an offer or list the property.</p>
                <div>${phoneButton}${emailButton}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

export function buildBuyerEmail(
  lead: BuyerLeadIntakeValues,
  business: EmailBusinessConfig,
): EmailMessage {
  const subject = `${business.siteName} received your buyer criteria`;
  const directContact = [
    business.phoneDisplay ? `Call or text: ${business.phoneDisplay}` : "",
    business.contactEmail ? `Email: ${business.contactEmail}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const text = `Thanks for sharing your Metro Atlanta property search with ${business.siteName}.

We received your criteria for:
${lead.targetArea}

Budget: ${budgetRangeLabel(lead.budgetRange)}
Timeline: ${purchaseTimelineLabel(lead.purchaseTimeline)}

${business.realtorName} will review your criteria and follow up about properties that may fit. Submitting does not guarantee a match or property availability.

${directContact}

${business.realtorName}
${business.siteName}`;
  const phoneButton =
    business.phoneDisplay && business.phoneE164
      ? `<a href="tel:${escapeHtml(business.phoneE164)}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 18px;border-radius:999px;background:#0c0c0c;color:#fffcf5;font-size:14px;font-weight:700;text-decoration:none;">Call ${escapeHtml(business.phoneDisplay)}</a>`
      : "";
  const emailButton = business.contactEmail
    ? `<a href="mailto:${escapeHtml(business.contactEmail)}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 18px;border:1px solid #8f8a7e;border-radius:999px;color:#0c0c0c;font-size:14px;font-weight:700;text-decoration:none;">Email us</a>`
    : "";
  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f2efe6;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0c0c0c;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:separate;background:#fffcf5;border:1px solid #d4cfc2;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:28px;background:#0c0c0c;color:#fffcf5;">
                <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#d4af37;">${escapeHtml(business.siteName)}</p>
                <h1 style="margin:0;font-size:30px;line-height:36px;">Your buyer criteria are in.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 18px;font-size:16px;line-height:26px;">${escapeHtml(business.realtorName)} will review your Metro Atlanta search and follow up about properties that may fit.</p>
                <div style="margin:0 0 24px;padding:18px;border-radius:14px;background:#f2efe6;">
                  <p style="margin:0 0 6px;color:#5e5b53;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;">Target area</p>
                  <p style="margin:0;font-size:17px;font-weight:700;">${escapeHtml(lead.targetArea)}</p>
                  <p style="margin:10px 0 0;color:#5e5b53;font-size:14px;line-height:22px;">Budget: ${escapeHtml(budgetRangeLabel(lead.budgetRange))}<br />Timeline: ${escapeHtml(purchaseTimelineLabel(lead.purchaseTimeline))}</p>
                </div>
                <p style="margin:0 0 22px;color:#5e5b53;font-size:14px;line-height:23px;">Submitting does not guarantee a match, discount, or property availability.</p>
                <div>${phoneButton}${emailButton}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}
