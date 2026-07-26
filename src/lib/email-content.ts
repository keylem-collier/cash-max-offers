import {
  conditionLabel,
  timelineLabel,
  type LeadIntakeValues,
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

  return [
    `Property: ${lead.propertyAddress}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Timeline: ${timelineLabel(lead.timeline)}`,
    `Condition: ${conditionLabel(lead.condition)}`,
    `Source: ${lead.sourcePath}`,
    `Lead ID: ${lead.leadId}`,
    utm ? `Campaign details:\n${utm}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function detailsHtml(lead: LeadIntakeValues) {
  const rows = [
    ["Property", lead.propertyAddress],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Timeline", timelineLabel(lead.timeline)],
    ["Condition", conditionLabel(lead.condition)],
    ["Source", lead.sourcePath],
    ["Lead ID", lead.leadId],
  ];

  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:9px 0;color:#60706a;font-size:14px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:9px 0 9px 18px;color:#16352c;font-size:14px;font-weight:700;text-align:right;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
}

export function buildOwnerEmail(
  lead: LeadIntakeValues,
  business: EmailBusinessConfig,
): EmailMessage {
  const subject = `New Georgia seller lead: ${lead.propertyAddress}`;
  const text = `A homeowner requested selling options through ${business.siteName}.

${detailsText(lead)}

Follow up directly while the request is fresh.`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#edf1ed;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#16352c;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:separate;background:#f9faf7;border:1px solid #d8e0da;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:28px;background:#16352c;color:#f9faf7;">
                <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#b7cbbf;">${escapeHtml(business.siteName)}</p>
                <h1 style="margin:0;font-size:28px;line-height:34px;">A Georgia homeowner wants to compare selling options.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  ${detailsHtml(lead)}
                </table>
                <p style="margin:24px 0 0;color:#60706a;font-size:14px;line-height:22px;">Follow up directly while the request is fresh.</p>
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
  lead: LeadIntakeValues,
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
      ? `<a href="tel:${escapeHtml(business.phoneE164)}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 18px;border-radius:999px;background:#16352c;color:#f9faf7;font-size:14px;font-weight:700;text-decoration:none;">Call ${escapeHtml(business.phoneDisplay)}</a>`
      : "";
  const emailButton = business.contactEmail
    ? `<a href="mailto:${escapeHtml(business.contactEmail)}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 18px;border:1px solid #b8c8be;border-radius:999px;color:#16352c;font-size:14px;font-weight:700;text-decoration:none;">Email us</a>`
    : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#edf1ed;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#16352c;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:separate;background:#f9faf7;border:1px solid #d8e0da;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:28px;background:#16352c;color:#f9faf7;">
                <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#b7cbbf;">${escapeHtml(business.siteName)}</p>
                <h1 style="margin:0;font-size:30px;line-height:36px;">Your property request is in.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 18px;font-size:16px;line-height:26px;">Thanks for sharing your property. We will review your timing and the selling paths that may fit.</p>
                <div style="margin:0 0 24px;padding:18px;border-radius:14px;background:#edf1ed;">
                  <p style="margin:0 0 6px;color:#60706a;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;">Property</p>
                  <p style="margin:0;font-size:17px;font-weight:700;">${escapeHtml(lead.propertyAddress)}</p>
                </div>
                <p style="margin:0 0 22px;color:#60706a;font-size:14px;line-height:23px;">There is no obligation to accept an offer or list the property.</p>
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
