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
