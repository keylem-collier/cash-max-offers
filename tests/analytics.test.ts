import assert from "node:assert/strict";
import test from "node:test";
import {
  trackFunnelEvent,
  trackLeadConversion,
} from "../src/lib/analytics.ts";

type AnalyticsCall = {
  provider: "meta" | "google";
  args: unknown[];
};

function installAnalyticsWindow() {
  const calls: AnalyticsCall[] = [];

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      dataLayer: [],
      fbq: (...args: unknown[]) => calls.push({ provider: "meta", args }),
      gtag: (...args: unknown[]) => calls.push({ provider: "google", args }),
    },
  });

  return calls;
}

test("contact clicks send diagnostic and standard Meta events", () => {
  const calls = installAnalyticsWindow();

  trackFunnelEvent("call_clicked");

  assert.deepEqual(
    calls.filter(({ provider }) => provider === "meta"),
    [
      { provider: "meta", args: ["trackCustom", "call_clicked"] },
      { provider: "meta", args: ["track", "Contact"] },
    ],
  );
});

test("successful lead delivery sends the standard Meta Lead event", () => {
  const calls = installAnalyticsWindow();

  trackLeadConversion();

  assert.deepEqual(
    calls.filter(({ provider }) => provider === "meta"),
    [
      { provider: "meta", args: ["trackCustom", "lead_submitted"] },
      { provider: "meta", args: ["track", "Lead"] },
    ],
  );
});
