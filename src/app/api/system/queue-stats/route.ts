/**
 * Queue Stats API — returns real-time BullMQ queue statistics
 * Used by /admin/queues dashboard page
 */

import { supabaseAdmin } from "@/lib/supabase";
import { getServerUser } from "@/lib/supabase-server";
import { getMessageQueue } from "@/queues/message.queue";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Admin-only access
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const queue = getMessageQueue();

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return NextResponse.json({
      data: {
        name: "whatsapp-messages",
        waiting,
        active,
        completed,
        failed,
        delayed,
      },
    });
  } catch (error) {
    console.error("Queue stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue stats" },
      { status: 500 },
    );
  }
}
