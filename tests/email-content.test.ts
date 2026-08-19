import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBuyerEmail,
  buildOwnerEmail,
  buildSellerEmail,
  escapeHtml,
  type EmailBusinessConfig,
} from "../src/lib/email-content.ts";
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
  timeline: "30_days",
  condition: "minor_work",
  sourcePath: "/",
  utm: { utm_source: "google" },
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
  utm: { utm_source: "meta" },
  startedAt: 234567,
};

const business: EmailBusinessConfig = {
  siteName: "Max Cash Offers",
  realtorName: "Licensed Georgia Realtor",
  phoneDisplay: "(404) 555-0179",
  phoneE164: "+14045550179",
  contactEmail: "offers@example.com",
  siteUrl: "https://cash-max-offers.vercel.app",
};

test("escapes unsafe HTML characters", () => {
  assert.equal(
    escapeHtml(`<script>alert("x")</script>`),
    "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
  );
});

test("builds an owner message with actionable lead details", () => {
  const message = buildOwnerEmail(lead, business);

  assert.match(message.subject, /123 Peachtree Street/);
  assert.match(message.text, /Within 30 days/);
  assert.match(message.text, /Needs minor work/);
  assert.match(message.html, /seller@example\.com/);
});

test("builds a seller confirmation with direct contact options", () => {
  const message = buildSellerEmail(lead, business);

  assert.match(message.subject, /received your property request/);
  assert.match(message.text, /no obligation/i);
  assert.match(message.html, /tel:\+14045550179/);
  assert.match(message.html, /mailto:offers@example\.com/);
});

test("builds buyer owner and confirmation messages with qualified criteria", () => {
  const ownerMessage = buildOwnerEmail(buyerLead, business);
  const buyerMessage = buildBuyerEmail(buyerLead, business);

  assert.match(ownerMessage.subject, /Metro Atlanta buyer lead/);
  assert.match(ownerMessage.text, /Decatur, GA 30030/);
  assert.match(ownerMessage.text, /\$250K-\$400K/);
  assert.match(ownerMessage.text, /Within 1-3 months/);
  assert.match(buyerMessage.subject, /received your buyer criteria/);
  assert.match(buyerMessage.text, /does not guarantee a match/i);
  assert.match(buyerMessage.html, /buyer criteria are in/i);
});

test("does not render submitted HTML inside email markup", () => {
  const message = buildOwnerEmail(
    {
      ...lead,
      propertyAddress: `123 Main <img src=x onerror="alert(1)">`,
    },
    business,
  );

  assert.doesNotMatch(message.html, /<img src=x/);
  assert.match(message.html, /&lt;img/);
});

test("escapes unsafe buyer criteria inside email markup", () => {
  const message = buildOwnerEmail(
    {
      ...buyerLead,
      targetArea: `Atlanta <img src=x onerror="alert(1)">`,
    },
    business,
  );

  assert.doesNotMatch(message.html, /<img src=x/);
  assert.match(message.html, /&lt;img/);
});
