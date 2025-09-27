import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import type { PolarWebhookEvent } from "@/types/polar";
import { isPolarWebhookEvent } from "@/types/polar";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.POLAR_WEBHOOK_SECRET ?? "";
  if (!secret) {
    return new NextResponse("Missing POLAR_WEBHOOK_SECRET", { status: 500 });
  }

  const raw = await req.arrayBuffer();

  const headersObject = Object.fromEntries(req.headers);

  let verified: unknown;
  try {
    verified = validateEvent(Buffer.from(raw), headersObject, secret);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return new NextResponse("Invalid signature", { status: 403 });
    }
    throw err;
  }

  if (!isPolarWebhookEvent(verified)) {
    return new NextResponse("Unsupported event shape", { status: 400 });
  }

  const evt: PolarWebhookEvent = verified;
  const id = String(evt.id ?? Date.now());

  try {
    await inngest.send({
      name: "polar/webhook.received",
      id,
      data: evt,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to process webhook", { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
