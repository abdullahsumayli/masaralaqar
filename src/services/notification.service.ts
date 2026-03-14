/**
 * Notification Service — In-app + Email notifications
 */

import { supabaseAdmin } from "@/lib/supabase";

export type NotificationType =
  | "new_lead"
  | "payment_success"
  | "payment_failed"
  | "unanswered_question"
  | "new_viewing"
  | "whatsapp_disconnected"
  | "subscription_expiring"
  | "system";

export interface CreateNotificationParams {
  userId: string;
  officeId?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  sendEmail?: boolean;
}

const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  new_lead: "👤",
  payment_success: "✅",
  payment_failed: "❌",
  unanswered_question: "❓",
  new_viewing: "🏠",
  whatsapp_disconnected: "📱",
  subscription_expiring: "⏰",
  system: "🔔",
};

export class NotificationService {
  /** Create an in-app notification */
  static async create(params: CreateNotificationParams) {
    const { userId, officeId, type, title, message, link, sendEmail } = params;

    // Save in-app notification
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .insert({
        user_id: userId,
        office_id: officeId || null,
        type,
        title,
        message,
        link: link || null,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create notification:", error);
      return null;
    }

    // Send email if requested
    if (sendEmail) {
      await this.sendEmail(userId, title, message);
    }

    return data;
  }

  /** Get user's notifications with pagination */
  static async getUserNotifications(
    userId: string,
    { limit = 20, offset = 0, unreadOnly = false } = {},
  ) {
    let query = supabaseAdmin
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, count, error } = await query;
    if (error) {
      console.error("Failed to fetch notifications:", error);
      return { notifications: [], total: 0 };
    }

    return { notifications: data || [], total: count || 0 };
  }

  /** Get unread count */
  static async getUnreadCount(userId: string): Promise<number> {
    const { count } = await supabaseAdmin
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    return count || 0;
  }

  /** Mark notification as read */
  static async markAsRead(notificationId: string, userId: string) {
    await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId);
  }

  /** Mark all as read for a user */
  static async markAllAsRead(userId: string) {
    await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);
  }

  /** Send email notification via Resend */
  private static async sendEmail(
    userId: string,
    subject: string,
    body: string,
  ) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM =
      process.env.RESEND_FROM_EMAIL || "noreply@masaralaqar.com";

    if (!RESEND_API_KEY) return;

    // Get user's email
    const { data: userData } =
      await supabaseAdmin.auth.admin.getUserById(userId);
    const email = userData?.user?.email;
    if (!email) return;

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: email,
          subject: `مسار العقار — ${subject}`,
          html: `
            <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #4F8EF7;">${subject}</h2>
              <p style="color: #333; line-height: 1.8;">${body}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #999; font-size: 12px;">مسار العقار — منصة إدارة العقارات بالذكاء الاصطناعي</p>
            </div>
          `,
        }),
      });
    } catch (err) {
      console.error("Failed to send email:", err);
    }
  }

  /** Convenience: Notify new lead */
  static async notifyNewLead(
    userId: string,
    officeId: string,
    leadName: string,
  ) {
    return this.create({
      userId,
      officeId,
      type: "new_lead",
      title: "عميل جديد",
      message: `${NOTIFICATION_ICONS.new_lead} تم استقبال عميل جديد: ${leadName}`,
      link: "/dashboard/clients",
      sendEmail: true,
    });
  }

  /** Convenience: Notify payment success */
  static async notifyPaymentSuccess(userId: string, planName: string) {
    return this.create({
      userId,
      type: "payment_success",
      title: "تم الدفع بنجاح",
      message: `${NOTIFICATION_ICONS.payment_success} تم تفعيل اشتراكك في خطة ${planName}`,
      link: "/dashboard/subscription",
      sendEmail: true,
    });
  }

  /** Convenience: Notify unanswered question */
  static async notifyUnansweredQuestion(
    userId: string,
    officeId: string,
    question: string,
  ) {
    return this.create({
      userId,
      officeId,
      type: "unanswered_question",
      title: "سؤال بدون إجابة",
      message: `${NOTIFICATION_ICONS.unanswered_question} لم يتمكن صقر من الإجابة: "${question.slice(0, 100)}"`,
      link: "/dashboard/unanswered-questions",
    });
  }

  /** Convenience: Notify new viewing request */
  static async notifyNewViewing(
    userId: string,
    officeId: string,
    propertyTitle: string,
  ) {
    return this.create({
      userId,
      officeId,
      type: "new_viewing",
      title: "طلب معاينة جديد",
      message: `${NOTIFICATION_ICONS.new_viewing} طلب معاينة لعقار: ${propertyTitle}`,
      link: "/dashboard/viewings",
    });
  }
}
