import { NextResponse } from "next/server";
import {
  leadRedirectPath,
  validateLeadIntake,
  type LeadIntakeInput,
  type LeadIntakeResponse,
} from "@/lib/lead-intake";
import {
  LeadDeliveryConfigurationError,
  sendLeadEmails,
} from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json<LeadIntakeResponse>(
      {
        ok: false,
        message: "The request could not be read. Please try again.",
      },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json<LeadIntakeResponse>(
      {
        ok: false,
        message: "The request could not be read. Please try again.",
      },
      { status: 400 },
    );
  }

  const validation = validateLeadIntake(payload as LeadIntakeInput);

  if (validation.blockedAsSpam) {
    return NextResponse.json<LeadIntakeResponse>(
      {
        ok: false,
        message: "The request could not be submitted.",
      },
      { status: 400 },
    );
  }

  if (!validation.values) {
    return NextResponse.json<LeadIntakeResponse>(
      {
        ok: false,
        errors: validation.errors,
        message: "Please check the highlighted fields.",
      },
      { status: 400 },
    );
  }

  try {
    const delivery = await sendLeadEmails(validation.values);

    return NextResponse.json<LeadIntakeResponse>({
      ok: true,
      redirectPath: leadRedirectPath(validation.values.funnel),
      confirmationEmailSent: delivery.confirmationEmailSent,
    });
  } catch (error) {
    const configurationError =
      error instanceof LeadDeliveryConfigurationError;

    console.error("Owner lead delivery failed", {
      leadId: validation.values.leadId,
      funnel: validation.values.funnel,
      stage: configurationError ? "configuration" : "provider",
      error: error instanceof Error ? error.message : "Unknown delivery error",
    });

    return NextResponse.json<LeadIntakeResponse>(
      {
        ok: false,
        message: configurationError
          ? "Online delivery is being finalized. Please use the direct contact option."
          : "We could not send your request. Please try again or use the direct contact option.",
      },
      { status: 502 },
    );
  }
}
