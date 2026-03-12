/**
 * WhatsApp Send Message API — إرسال رسالة يدوية عبر واتساب
 */

import { WhatsAppService } from "@/integrations/whatsapp";
import { getUserProfile } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerUser } from "@/lib/supabase-server";
import { OfficeService } from "@/services/office.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const profile = await getUserProfile(user.id) as Record<string, unknown> | null;
    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office) {
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { phone, message, leadId } = body as {
      phone?: string;
      message?: string;
      leadId?: string;
    };

    if (!phone || !message) {
      return NextResponse.json(
        { error: "رقم الهاتف والرسالة مطلوبان" },
        { status: 400 },
      );
    }

    // Send via Evolution API
    const sent = await WhatsAppService.sendMessage(phone, message, office.id);
    if (!sent) {
      return NextResponse.json(
        { error: "فشل إرسال الرسالة. تأكد من اتصال واتساب" },
        { status: 502 },
      );
    }

    // Log the sent message
    await supabaseAdmin.from("sent_messages").insert({
      office_id: office.id,
      sender_id: user.id,
      sender_name: (profile?.full_name as string) || user.email,
      recipient_phone: WhatsAppService.formatPhoneNumber(phone),
      message_text: message,
      lead_id: leadId || null,
      channel: "whatsapp",
      status: "sent",
    });

    // Update lead's last_contacted_at if lead exists
    if (leadId) {
      await supabaseAdmin
        .from("leads")
        .update({ last_contacted_at: new Date().toISOString() })
        .eq("id", leadId);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
