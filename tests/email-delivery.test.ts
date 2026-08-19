import assert from "node:assert/strict";
import test from "node:test";
import {
  buyerEmailIdempotencyKeys,
  deliverLead,
  emailIdempotencyKeys,
  type DeliveryRequest,
} from "../src/lib/email-delivery.ts";
import type { EmailBusinessConfig } from "../src/lib/email-content.ts";
import type {
  BuyerLeadIntakeValues,
  SellerLeadIntakeValues,
} from "../src/lib/lead-intake.ts";

const lead: SellerLeadIntakeValues = {
  funnel: "seller",
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

const buyerLead: BuyerLeadIntakeValues = {
  funnel: "buyer",
  leadId: "buyer_test_12345",
  targetArea: "Decatur, GA 30030",
  phone: "4045550180",
  email: "buyer@example.com",
  budgetRange: "250k_400k",
  purchaseTimeline: "1_3_months",
  sourcePath: "/atlanta-fixer-upper-homes",
  utm: {},
  startedAt: 234567,
};

const business: EmailBusinessConfig = {
  siteName: "Max Cash Offers",
  realtorName: "Licensed Georgia Realtor",
  phoneDisplay: "",
  phoneE164: "",
  contactEmail: "offers@example.com",
  siteUrl: "https://cash-max-offers.vercel.app",
};

test("creates stable and distinct email idempotency keys", () => {
  assert.deepEqual(emailIdempotencyKeys("lead_123"), {
    owner: "owner/lead_123",
    seller: "seller/lead_123",
  });
  assert.deepEqual(buyerEmailIdempotencyKeys("lead_123"), {
    owner: "owner/buyer/lead_123",
    buyer: "buyer/lead_123",
  });
});

test("reports success only after owner and seller sends complete", async () => {
  const requests: DeliveryRequest[] = [];
  const result = await deliverLead({
    lead,
    business,
    from: "Max Cash Offers <offers@example.com>",
    ownerEmails: ["owner@example.com", "partner@example.com"],
    send: async (request) => {
      requests.push(request);
      return `${request.type}-id`;
    },
  });

  assert.equal(result.confirmationEmailSent, true);
  assert.equal(result.ownerEmailId, "owner_lead-id");
  assert.equal(result.sellerEmailId, "seller_confirmation-id");
  assert.deepEqual(requests[0]?.to, [
    "owner@example.com",
    "partner@example.com",
  ]);
  assert.equal(requests[0]?.idempotencyKey, "owner/lead_test_12345");
  assert.equal(requests[1]?.idempotencyKey, "seller/lead_test_12345");
});

test("owner failure rejects the lead delivery", async () => {
  await assert.rejects(
    deliverLead({
      lead,
      business,
      from: "Max Cash Offers <offers@example.com>",
      ownerEmails: ["owner@example.com"],
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
    from: "Max Cash Offers <offers@example.com>",
    ownerEmails: ["owner@example.com"],
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

test("delivers buyer emails with buyer-specific tags and idempotency", async () => {
  const requests: DeliveryRequest[] = [];
  const result = await deliverLead({
    lead: buyerLead,
    business,
    from: "Max Cash Offers <offers@example.com>",
    ownerEmails: ["owner@example.com"],
    send: async (request) => {
      requests.push(request);
      return `${request.type}-id`;
    },
  });

  assert.equal(result.confirmationEmailSent, true);
  assert.equal(result.ownerEmailId, "owner_lead-id");
  assert.equal(result.sellerEmailId, null);
  assert.equal(result.buyerEmailId, "buyer_confirmation-id");
  assert.equal(requests[0]?.idempotencyKey, "owner/buyer/buyer_test_12345");
  assert.equal(requests[1]?.type, "buyer_confirmation");
  assert.equal(requests[1]?.idempotencyKey, "buyer/buyer_test_12345");
});

test("buyer confirmation failure preserves owner success", async () => {
  const result = await deliverLead({
    lead: buyerLead,
    business,
    from: "Max Cash Offers <offers@example.com>",
    ownerEmails: ["owner@example.com"],
    send: async (request) => {
      if (request.type === "buyer_confirmation") {
        throw new Error("Buyer confirmation failed");
      }

      return "owner-provider-id";
    },
  });

  assert.equal(result.ownerEmailId, "owner-provider-id");
  assert.equal(result.buyerEmailId, null);
  assert.equal(result.confirmationEmailSent, false);
});
