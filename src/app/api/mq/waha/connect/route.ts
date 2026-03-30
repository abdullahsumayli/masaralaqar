/**
 * MQ ↔ WAHA — session status + QR for the fixed test session (default `mq-test`).
 *
 * GET  — read session from WAHA, optionally fetch QR (JSON) when SCAN_QR_CODE
 * POST — call /start then refresh QR (same response shape as GET)
 */

import {
  wahaGetQrJson,
  wahaGetSession,
  wahaMqConfigured,
  wahaMqSessionName,
  wahaMqWebhookUrl,
  wahaStartSession,
} from "@/lib/waha-mq";
import { NextResponse } from "next/server";

function internalKeyOk(request: Request): boolean {
  const need = process.env.MQ_WAHA_INTERNAL_KEY?.trim();
  if (!need) return true;
  return request.headers.get("x-mq-internal-key") === need;
}

export async function GET() {
  if (!wahaMqConfigured()) {
    return NextResponse.json(
      {
        error: "WAHA غير مُعد",
        hint: "عيّن WAHA_API_URL و WAHA_API_KEY في البيئة",
      },
      { status: 503 },
    );
  }

  const session = wahaMqSessionName();
  const webhookUrl = wahaMqWebhookUrl();

  try {
    const data = await wahaGetSession(session);
    if (!data) {
      return NextResponse.json(
        {
          error: "الجلسة غير موجودة على WAHA",
          session,
          hint: "أنشئ الجلسة من لوحة WAHA (مثلاً الاسم mq-test) ثم أعد المحاولة",
          webhookUrl,
        },
        { status: 404 },
      );
    }

    const status =
      typeof data === "object" && data !== null && "status" in data
        ? String((data as { status: string }).status)
        : "unknown";

    let qr: string | null = null;
    let qrError: string | null = null;
    if (status === "SCAN_QR_CODE" || status === "STARTING") {
      try {
        const { dataUrl } = await wahaGetQrJson(session);
        qr = dataUrl;
      } catch (e) {
        qrError = e instanceof Error ? e.message : "qr_fetch_failed";
      }
    }

    return NextResponse.json({
      ok: true,
      session,
      status,
      qr,
      qrError,
      webhookUrl,
      me:
        typeof data === "object" && data !== null && "me" in data
          ? (data as { me: unknown }).me
          : null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "waha_error";
    return NextResponse.json({ error: msg, session, webhookUrl }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (!internalKeyOk(request)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  if (!wahaMqConfigured()) {
    return NextResponse.json(
      { error: "WAHA غير مُعد", hint: "WAHA_API_URL + WAHA_API_KEY" },
      { status: 503 },
    );
  }

  const session = wahaMqSessionName();
  const webhookUrl = wahaMqWebhookUrl();

  try {
    await wahaStartSession(session);
    // brief pause so WAHA can transition to SCAN_QR_CODE
    await new Promise((r) => setTimeout(r, 800));

    const data = await wahaGetSession(session);
    const status =
      typeof data === "object" && data !== null && "status" in data
        ? String((data as { status: string }).status)
        : "unknown";

    let qr: string | null = null;
    let qrError: string | null = null;
    if (status === "SCAN_QR_CODE" || status === "STARTING") {
      try {
        const { dataUrl } = await wahaGetQrJson(session);
        qr = dataUrl;
      } catch (e) {
        qrError = e instanceof Error ? e.message : "qr_fetch_failed";
      }
    }

    return NextResponse.json({
      ok: true,
      session,
      status,
      qr,
      qrError,
      webhookUrl,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "waha_error";
    return NextResponse.json({ error: msg, session, webhookUrl }, { status: 502 });
  }
}
