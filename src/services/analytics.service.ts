/**
 * Analytics Service — Office dashboard analytics
 */

import { supabaseAdmin } from "@/lib/supabase";

export interface OfficeAnalytics {
  totalProperties: number;
  totalLeads: number;
  totalMessages: number;
  totalViewings: number;
  conversionRate: number;
  aiResponseCount: number;
  topRequestedProperties: Array<{ id: string; title: string; views: number }>;
  leadsByStatus: Record<string, number>;
  dailyMessages: Array<{ date: string; count: number }>;
  leadsBySource: Record<string, number>;
}

export class AnalyticsService {
  static async getOfficeAnalytics(officeId: string): Promise<OfficeAnalytics> {
    const [
      propertiesResult,
      leadsResult,
      messagesResult,
      viewingsResult,
      leadsByStatusResult,
      topPropertiesResult,
      dailyMessagesResult,
      leadsBySourceResult,
    ] = await Promise.all([
      // Total properties
      supabaseAdmin
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("office_id", officeId),

      // Total leads
      supabaseAdmin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("office_id", officeId),

      // Total AI messages (from usage logs)
      supabaseAdmin
        .from("usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("office_id", officeId)
        .eq("type", "ai_message"),

      // Total viewings
      supabaseAdmin
        .from("viewing_requests")
        .select("*", { count: "exact", head: true })
        .eq("office_id", officeId),

      // Leads by status
      supabaseAdmin.from("leads").select("status").eq("office_id", officeId),

      // Top properties by views
      supabaseAdmin
        .from("properties")
        .select("id, title, views_count")
        .eq("office_id", officeId)
        .order("views_count", { ascending: false })
        .limit(5),

      // Daily messages (last 30 days)
      supabaseAdmin
        .from("usage_logs")
        .select("created_at")
        .eq("office_id", officeId)
        .eq("type", "ai_message")
        .gte(
          "created_at",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        ),

      // Leads by source
      supabaseAdmin.from("leads").select("source").eq("office_id", officeId),
    ]);

    // Process leads by status
    const leadsByStatus: Record<string, number> = {};
    if (leadsByStatusResult.data) {
      for (const lead of leadsByStatusResult.data) {
        const status = (lead as { status: string }).status || "new";
        leadsByStatus[status] = (leadsByStatus[status] || 0) + 1;
      }
    }

    // Process leads by source
    const leadsBySource: Record<string, number> = {};
    if (leadsBySourceResult.data) {
      for (const lead of leadsBySourceResult.data) {
        const source = (lead as { source: string }).source || "unknown";
        leadsBySource[source] = (leadsBySource[source] || 0) + 1;
      }
    }

    // Process daily messages
    const dailyMap = new Map<string, number>();
    if (dailyMessagesResult.data) {
      for (const msg of dailyMessagesResult.data) {
        const date = new Date((msg as { created_at: string }).created_at)
          .toISOString()
          .split("T")[0];
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
      }
    }

    // Fill in missing days
    const dailyMessages: Array<{ date: string; count: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      dailyMessages.push({ date: dateStr, count: dailyMap.get(dateStr) || 0 });
    }

    // Calculate conversion rate
    const totalLeads = leadsResult.count || 0;
    const convertedLeads = leadsByStatus["converted"] || 0;
    const conversionRate =
      totalLeads > 0
        ? Math.round((convertedLeads / totalLeads) * 100 * 10) / 10
        : 0;

    // Top properties
    const topRequestedProperties = (topPropertiesResult.data || []).map(
      (p: Record<string, unknown>) => ({
        id: p.id as string,
        title: p.title as string,
        views: (p.views_count as number) || 0,
      }),
    );

    return {
      totalProperties: propertiesResult.count || 0,
      totalLeads,
      totalMessages: messagesResult.count || 0,
      totalViewings: viewingsResult.count || 0,
      conversionRate,
      aiResponseCount: messagesResult.count || 0,
      topRequestedProperties,
      leadsByStatus,
      dailyMessages,
      leadsBySource,
    };
  }
}
