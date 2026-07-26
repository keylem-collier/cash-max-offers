import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizePhone,
  validateLeadIntake,
  type LeadIntakeInput,
} from "../src/lib/lead-intake.ts";

const validInput: LeadIntakeInput = {
  leadId: "lead_test_12345",
  propertyAddress: "123 Peachtree Street NE, Atlanta, GA 30303",
  phone: "(404) 555-0179",
  email: "Seller@Example.com",
  timeline: "30_days",
  condition: "minor_work",
  sourcePath: "/?ignored=true",
  utm: {
    utm_source: "google",
    utm_campaign: "atlanta-sellers",
    unknown: "discard-me",
  },
  startedAt: 123456,
  company: "",
};

test("validates and normalizes a complete seller lead", () => {
  const result = validateLeadIntake(validInput);

  assert.equal(result.blockedAsSpam, false);
  assert.deepEqual(result.errors, {});
  assert.ok(result.values);
  assert.equal(result.values.email, "seller@example.com");
  assert.equal(result.values.phone, "4045550179");
  assert.deepEqual(result.values.utm, {
    utm_source: "google",
    utm_campaign: "atlanta-sellers",
  });
});

test("rejects invalid address, contact details, and enums", () => {
  const result = validateLeadIntake({
    ...validInput,
    propertyAddress: "Atlanta",
    phone: "1111111111",
    email: "invalid",
    timeline: "tomorrow",
    condition: "perfect",
  });

  assert.equal(result.values, null);
  assert.deepEqual(Object.keys(result.errors).sort(), [
    "condition",
    "email",
    "phone",
    "propertyAddress",
    "timeline",
  ]);
});

test("blocks the honeypot field without exposing contact data", () => {
  const result = validateLeadIntake({
    ...validInput,
    company: "Automated submission",
  });

  assert.equal(result.blockedAsSpam, true);
});

test("bounds oversized fields and drops unsupported campaign values", () => {
  const result = validateLeadIntake({
    ...validInput,
    propertyAddress: `123 ${"A".repeat(300)}`,
    utm: {
      utm_source: "x".repeat(200),
      private_value: "must-not-pass",
    },
  });

  assert.ok(result.values);
  assert.equal(result.values.propertyAddress.length, 180);
  assert.equal(result.values.utm.utm_source.length, 120);
  assert.equal("private_value" in result.values.utm, false);
});

test("normalizes international and domestic phone punctuation", () => {
  assert.equal(normalizePhone("+1 (404) 555-0179"), "+14045550179");
  assert.equal(normalizePhone("404.555.0179"), "4045550179");
});

test("generates distinct fallback identifiers for malformed lead IDs", () => {
  const first = validateLeadIntake({ ...validInput, leadId: "" });
  const second = validateLeadIntake({ ...validInput, leadId: "" });

  assert.ok(first.values);
  assert.ok(second.values);
  assert.notEqual(first.values.leadId, second.values.leadId);
  assert.match(first.values.leadId, /^lead-[a-f0-9-]{36}$/);
});
