/**
 * MQ ↔ WAHA — inbound webhooks (configure this URL in WAHA session webhooks).
 * Events: message, session.status, ...
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const rec = body as Record<string, unknown>;
  const event = typeof rec.event === "string" ? rec.event : "unknown";
  const session = typeof rec.session === "string" ? rec.session : "";

  if (event === "session.status") {
    const payload = rec.payload as Record<string, unknown> | undefined;
    const st = payload && typeof payload.status === "string" ? payload.status : "";
    console.info(`[WAHA MQ webhook] session.status session=${session} status=${st}`);
  } else if (event === "message" || event === "message.any") {
    const payload = rec.payload as Record<string, unknown> | undefined;
    const from = payload && typeof payload.from === "string" ? payload.from : "";
    const text = payload && typeof payload.body === "string" ? payload.body : "";
    const fromMe = payload && payload.fromMe === true;
    if (!fromMe && text) {
      console.info(
        `[WAHA MQ webhook] message session=${session} from=${from} text=${text.slice(0, 120)}`,
      );
    }
  } else {
    console.info(`[WAHA MQ webhook] event=${event} session=${session}`);
  }

  return NextResponse.json({ ok: true });
}

/** Some setups probe with GET */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "mq-waha-webhook",
    hint: "Use POST for WAHA events",
  });
}
