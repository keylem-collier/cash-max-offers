import assert from "node:assert/strict";
import test from "node:test";
import {
  buildOwnerEmail,
  buildSellerEmail,
  escapeHtml,
  type EmailBusinessConfig,
} from "../src/lib/email-content.ts";
import type { LeadIntakeValues } from "../src/lib/lead-intake.ts";

const lead: LeadIntakeValues = {
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

const business: EmailBusinessConfig = {
  siteName: "Cash Max Offers",
  realtorName: "Licensed Georgia Realtor",
  phoneDisplay: "(404) 555-0179",
  phoneE164: "+14045550179",
  contactEmail: "offers@example.com",
  siteUrl: "https://cashmaxoffers.com",
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
