import { Resend } from "resend";
import type { EmailBusinessConfig } from "@/lib/email-content";
import { deliverLead, type DeliveryRequest } from "@/lib/email-delivery";
import type { LeadIntakeValues } from "@/lib/lead-intake";
import { siteConfig } from "@/lib/site-config";

let resend: Resend | null = null;

export class LeadDeliveryConfigurationError extends Error {
  constructor() {
    super("Lead delivery is not configured.");
    this.name = "LeadDeliveryConfigurationError";
  }
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new LeadDeliveryConfigurationError();
  }

  if (!resend) {
    resend = new Resend(apiKey);
  }

  return resend;
}

function getDeliveryConfig() {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const ownerEmail = process.env.LEAD_OWNER_EMAIL?.trim();

  if (!from || !ownerEmail) {
    throw new LeadDeliveryConfigurationError();
  }

  return { from, ownerEmail };
}

function businessConfig(): EmailBusinessConfig {
  return {
    siteName: siteConfig.name,
    realtorName: siteConfig.realtorName,
    phoneDisplay: siteConfig.directPhoneDisplay,
    phoneE164: siteConfig.directPhoneE164,
    contactEmail: siteConfig.contactEmail,
    siteUrl: siteConfig.url,
  };
}

function assertSendSucceeded(result: {
  data: { id: string } | null;
  error: { message: string } | null;
}) {
  if (result.error || !result.data?.id) {
    throw new Error(result.error?.message || "Email provider rejected the request.");
  }

  return result.data.id;
}

export async function sendLeadEmails(lead: LeadIntakeValues) {
  const client = getResend();
  const { from, ownerEmail } = getDeliveryConfig();
  const business = businessConfig();

  return deliverLead({
    lead,
    business,
    from,
    ownerEmail,
    send: async (request: DeliveryRequest) => {
      const result = await client.emails.send(
        {
          from: request.from,
          to: request.to,
          replyTo: request.replyTo,
          subject: request.subject,
          text: request.text,
          html: request.html,
          tags: [
            { name: "type", value: request.type },
            { name: "lead_id", value: request.leadId },
          ],
        },
        {
          idempotencyKey: request.idempotencyKey,
        },
      );

      return assertSendSucceeded(result);
    },
  }).then((delivery) => {
    if (!delivery.confirmationEmailSent) {
      console.error("Seller confirmation email failed", {
        leadId: lead.leadId,
        error: "Provider rejected the seller confirmation",
      });
    }

    return delivery;
  });
}
