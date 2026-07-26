import assert from "node:assert/strict";
import test from "node:test";
import {
  deliverLead,
  emailIdempotencyKeys,
  type DeliveryRequest,
} from "../src/lib/email-delivery.ts";
import type { EmailBusinessConfig } from "../src/lib/email-content.ts";
import type { LeadIntakeValues } from "../src/lib/lead-intake.ts";

const lead: LeadIntakeValues = {
  leadId: "lead_test_12345",
  propertyAddress: "123 Peachtree Street NE, Atlanta, GA 30303",
  phone: "4045550179",
  email: "seller@example.com",
  timeline: "asap",
  condition: "not_sure",
  sourcePath: "/",
  utm: {},
  startedAt: 123456,
};

const business: EmailBusinessConfig = {
  siteName: "Cash Max Offers",
  realtorName: "Licensed Georgia Realtor",
  phoneDisplay: "",
  phoneE164: "",
  contactEmail: "offers@example.com",
  siteUrl: "https://cashmaxoffers.com",
};

test("creates stable and distinct email idempotency keys", () => {
  assert.deepEqual(emailIdempotencyKeys("lead_123"), {
    owner: "owner/lead_123",
    seller: "seller/lead_123",
  });
});

test("reports success only after owner and seller sends complete", async () => {
  const requests: DeliveryRequest[] = [];
  const result = await deliverLead({
    lead,
    business,
    from: "Cash Max Offers <offers@example.com>",
    ownerEmail: "owner@example.com",
    send: async (request) => {
      requests.push(request);
      return `${request.type}-id`;
    },
  });

  assert.equal(result.confirmationEmailSent, true);
  assert.equal(result.ownerEmailId, "owner_lead-id");
  assert.equal(result.sellerEmailId, "seller_confirmation-id");
  assert.equal(requests[0]?.idempotencyKey, "owner/lead_test_12345");
  assert.equal(requests[1]?.idempotencyKey, "seller/lead_test_12345");
});

test("owner failure rejects the lead delivery", async () => {
  await assert.rejects(
    deliverLead({
      lead,
      business,
      from: "Cash Max Offers <offers@example.com>",
      ownerEmail: "owner@example.com",
      send: async () => {
        throw new Error("Owner send failed");
      },
    }),
    /Owner send failed/,
  );
});

test("seller-only failure preserves owner success", async () => {
  const result = await deliverLead({
    lead,
    business,
    from: "Cash Max Offers <offers@example.com>",
    ownerEmail: "owner@example.com",
    send: async (request) => {
      if (request.type === "seller_confirmation") {
        throw new Error("Seller send failed");
      }

      return "owner-provider-id";
    },
  });

  assert.equal(result.ownerEmailId, "owner-provider-id");
  assert.equal(result.sellerEmailId, null);
  assert.equal(result.confirmationEmailSent, false);
});
