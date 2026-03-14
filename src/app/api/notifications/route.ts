/**
 * Notifications API — إشعارات المستخدم
 */

import { getServerUser } from "@/lib/supabase-server";
import { NotificationService } from "@/services/notification.service";
import { NextRequest, NextResponse } from "next/server";

/** GET: List notifications */
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");
    const unreadOnly = searchParams.get("unread") === "true";

    const { notifications, total } =
      await NotificationService.getUserNotifications(user.id, {
        limit,
        offset,
        unreadOnly,
      });

    const unreadCount = await NotificationService.getUnreadCount(user.id);

    return NextResponse.json({
      success: true,
      notifications,
      total,
      unreadCount,
    });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** PATCH: Mark notification(s) as read */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAll } = body as {
      notificationId?: string;
      markAll?: boolean;
    };

    if (markAll) {
      await NotificationService.markAllAsRead(user.id);
    } else if (notificationId) {
      await NotificationService.markAsRead(notificationId, user.id);
    } else {
      return NextResponse.json(
        { error: "يجب تحديد الإشعار أو تحديد الكل" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
