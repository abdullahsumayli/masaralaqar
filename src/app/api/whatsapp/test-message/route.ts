/**
 * POST /api/whatsapp/test-message
 *
 * Sends a confirmation message to the connected WhatsApp number
 * after a successful connection. Called from the dashboard UI.
 */

import { WhatsAppService } from "@/integrations/whatsapp";
import { OfficeService } from "@/services/office.service";
import { WhatsAppSessionService } from "@/services/whatsapp-session.service";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const TEST_MESSAGE =
  "تم ربط حسابك بنجاح مع نظام MQ ✅\n\nالرد الآلي الذكي جاهز لاستقبال رسائل عملائك.";

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c: { name: string; value: string; options?: Record<string, unknown> }[]) => {
          c.forEach(({ name, value, options }) => {
            try { cookieStore.set(name, value, options); } catch {}
          });
        },
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office) {
      return NextResponse.json({ error: "لا يوجد مكتب" }, { status: 404 });
    }

    const session = await WhatsAppSessionService.getSessionByOffice(office.id);
    if (!session || session.sessionStatus !== "connected") {
      return NextResponse.json(
        { error: "واتساب غير متصل" },
        { status: 400 },
      );
    }

    const phone = session.phoneNumber;
    if (!phone || phone === "pending" || phone === "auto-detected") {
      return NextResponse.json(
        { error: "رقم الهاتف غير متوفر بعد" },
        { status: 400 },
      );
    }

    const sent = await WhatsAppService.sendMessage(
      phone,
      TEST_MESSAGE,
      office.id,
    );

    console.log(
      `[TestMessage] office=${office.id} phone=${phone} sent=${sent}`,
    );

    return NextResponse.json({ success: sent });
  } catch (err) {
    console.error("[TestMessage] error:", err);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
