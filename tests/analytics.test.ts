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
      {
        provider: "meta",
        args: ["trackCustom", "call_clicked", { funnel_type: "seller" }],
      },
      {
        provider: "meta",
        args: ["track", "Contact", { funnel_type: "seller" }],
      },
    ],
  );
});

test("successful lead delivery sends the standard Meta Lead event", () => {
  const calls = installAnalyticsWindow();

  trackLeadConversion();

  assert.deepEqual(
    calls.filter(({ provider }) => provider === "meta"),
    [
      {
        provider: "meta",
        args: ["trackCustom", "lead_submitted", { funnel_type: "seller" }],
      },
      {
        provider: "meta",
        args: ["track", "Lead", { funnel_type: "seller" }],
      },
    ],
  );
});

test("buyer events carry only a non-PII funnel dimension", () => {
  const calls = installAnalyticsWindow();

  trackFunnelEvent("area_completed", "buyer");
  trackLeadConversion("buyer");

  assert.deepEqual(
    calls.filter(({ provider }) => provider === "meta"),
    [
      {
        provider: "meta",
        args: ["trackCustom", "area_completed", { funnel_type: "buyer" }],
      },
      {
        provider: "meta",
        args: ["trackCustom", "lead_submitted", { funnel_type: "buyer" }],
      },
      {
        provider: "meta",
        args: ["track", "Lead", { funnel_type: "buyer" }],
      },
    ],
  );
  assert.doesNotMatch(JSON.stringify(calls), /Decatur|buyer@example|404555/);
});
