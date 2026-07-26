import {
  buildOwnerEmail,
  buildSellerEmail,
  type EmailBusinessConfig,
} from "./email-content";
import type { LeadIntakeValues } from "./lead-intake";

export type DeliveryRequest = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  type: "owner_lead" | "seller_confirmation";
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

export async function deliverLead({
  lead,
  business,
  from,
  ownerEmail,
  send,
}: {
  lead: LeadIntakeValues;
  business: EmailBusinessConfig;
  from: string;
  ownerEmail: string;
  send: SendDeliveryRequest;
}) {
  const ownerMessage = buildOwnerEmail(lead, business);
  const sellerMessage = buildSellerEmail(lead, business);
  const keys = emailIdempotencyKeys(lead.leadId);

  const ownerEmailId = await send({
    from,
    to: ownerEmail,
    replyTo: lead.email,
    subject: ownerMessage.subject,
    text: ownerMessage.text,
    html: ownerMessage.html,
    type: "owner_lead",
    leadId: lead.leadId,
    idempotencyKey: keys.owner,
  });

  try {
    const sellerEmailId = await send({
      from,
      to: lead.email,
      replyTo: business.contactEmail || ownerEmail,
      subject: sellerMessage.subject,
      text: sellerMessage.text,
      html: sellerMessage.html,
      type: "seller_confirmation",
      leadId: lead.leadId,
      idempotencyKey: keys.seller,
    });

    return {
      ownerEmailId,
      sellerEmailId,
      confirmationEmailSent: true,
    };
  } catch {
    return {
      ownerEmailId,
      sellerEmailId: null,
      confirmationEmailSent: false,
    };
  }
}
