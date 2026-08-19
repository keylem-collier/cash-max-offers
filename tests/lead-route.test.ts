import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../src/app/api/lead-intake/route.ts";

test("rejects valid JSON that is not an intake object", async () => {
  const response = await POST(
    new Request("http://localhost/api/lead-intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "null",
    }),
  );
  const body = (await response.json()) as {
    ok: boolean;
    message: string;
  };

  assert.equal(response.status, 400);
  assert.equal(body.ok, false);
  assert.equal(body.message, "The request could not be read. Please try again.");
});

test("returns buyer-specific validation errors without seller fields", async () => {
  const response = await POST(
    new Request("http://localhost/api/lead-intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        funnel: "buyer",
        targetArea: "",
        fullName: "",
        phone: "4045550180",
        email: "buyer@example.com",
        budgetRange: "any",
        purchaseTimeline: "someday",
        fundingStatus: "other",
        company: "",
      }),
    }),
  );
  const body = (await response.json()) as {
    ok: boolean;
    errors: Record<string, string>;
  };

  assert.equal(response.status, 400);
  assert.equal(body.ok, false);
  assert.deepEqual(Object.keys(body.errors).sort(), [
    "budgetRange",
    "fullName",
    "fundingStatus",
    "purchaseTimeline",
    "targetArea",
  ]);
});
