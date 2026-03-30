/**
 * MQ ↔ WAHA — send plain text (test / internal).
 * Body: { "phone": "05xxxxxxxx" | "9665...", "text": "..." }
 */

import {
  phoneToChatId,
  wahaMqConfigured,
  wahaMqSessionName,
  wahaSendText,
} from "@/lib/waha-mq";
import { NextResponse } from "next/server";

function internalKeyOk(request: Request): boolean {
  const need = process.env.MQ_WAHA_INTERNAL_KEY?.trim();
  if (!need) return true;
  return request.headers.get("x-mq-internal-key") === need;
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

  let body: { phone?: string; text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "جسم الطلب ليس JSON" }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const text = typeof body.text === "string" ? body.text : "";
  if (!phone || !text) {
    return NextResponse.json(
      { error: "الحقول phone و text مطلوبة" },
      { status: 400 },
    );
  }

  const chatId = phoneToChatId(phone);
  if (!chatId) {
    return NextResponse.json({ error: "رقم غير صالح" }, { status: 400 });
  }

  const session = wahaMqSessionName();
  const result = await wahaSendText(session, chatId, text);
  if (!result.ok) {
    return NextResponse.json(
      {
        error: "فشل الإرسال",
        status: result.status,
        detail: result.body.slice(0, 500),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, session, chatId });
}
