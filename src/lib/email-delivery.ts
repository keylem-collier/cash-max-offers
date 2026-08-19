import {
  buildBuyerEmail,
  buildOwnerEmail,
  buildSellerEmail,
  type EmailBusinessConfig,
} from "./email-content";
import type { LeadIntakeValues } from "./lead-intake";

export type DeliveryRequest = {
  from: string;
  to: string | string[];
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  type: "owner_lead" | "seller_confirmation" | "buyer_confirmation";
  leadId: string;
  idempotencyKey: string;
};

export type SendDeliveryRequest = (
  request: DeliveryRequest,
) => Promise<string>;

export function emailIdempotencyKeys(leadId: string) {
  return {
    owner: `owner/${leadId}`,
    seller: `seller/${leadId}`,
  };
}

export function buyerEmailIdempotencyKeys(leadId: string) {
  return {
    owner: `owner/buyer/${leadId}`,
    buyer: `buyer/${leadId}`,
  };
}

export async function deliverLead({
  lead,
  business,
  from,
  ownerEmails,
  send,
}: {
  lead: LeadIntakeValues;
  business: EmailBusinessConfig;
  from: string;
  ownerEmails: string[];
  send: SendDeliveryRequest;
}) {
  const ownerMessage = buildOwnerEmail(lead, business);
  const confirmationMessage =
    lead.funnel === "buyer"
      ? buildBuyerEmail(lead, business)
      : buildSellerEmail(lead, business);
  const keys =
    lead.funnel === "buyer"
      ? buyerEmailIdempotencyKeys(lead.leadId)
      : emailIdempotencyKeys(lead.leadId);
  const confirmationIdempotencyKey =
    "buyer" in keys ? keys.buyer : keys.seller;

  const ownerEmailId = await send({
    from,
    to: ownerEmails,
    replyTo: lead.email,
    subject: ownerMessage.subject,
    text: ownerMessage.text,
    html: ownerMessage.html,
    type: "owner_lead",
    leadId: lead.leadId,
    idempotencyKey: keys.owner,
  });

  try {
    const confirmationEmailId = await send({
      from,
      to: lead.email,
      replyTo: business.contactEmail || ownerEmails[0]!,
      subject: confirmationMessage.subject,
      text: confirmationMessage.text,
      html: confirmationMessage.html,
      type:
        lead.funnel === "buyer"
          ? "buyer_confirmation"
          : "seller_confirmation",
      leadId: lead.leadId,
      idempotencyKey: confirmationIdempotencyKey,
    });

    return {
      ownerEmailId,
      sellerEmailId:
        lead.funnel === "seller" ? confirmationEmailId : null,
      buyerEmailId:
        lead.funnel === "buyer" ? confirmationEmailId : null,
      confirmationEmailSent: true,
    };
  } catch {
    return {
      ownerEmailId,
      sellerEmailId: null,
      buyerEmailId: null,
      confirmationEmailSent: false,
    };
  }
}
