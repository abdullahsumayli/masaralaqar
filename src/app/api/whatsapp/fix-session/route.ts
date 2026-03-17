/**
 * Emergency session fixer — creates a WhatsApp session record
 * GET /api/whatsapp/fix-session
 */

import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Step 1: Find ANY user with an office_id
    const { data: users, error: usersError } = await supabaseAdmin
      .from("users")
      .select("id, email, office_id")
      .not("office_id", "is", null)
      .limit(5);

    if (usersError) {
      return NextResponse.json({
        step: "find_users",
        error: usersError.message,
        hint: "Query on users table failed",
      }, { status: 500 });
    }

    if (!users || users.length === 0) {
      // Try finding from offices table directly
      const { data: offices } = await supabaseAdmin
        .from("offices")
        .select("id, name")
        .limit(5);

      return NextResponse.json({
        step: "find_users",
        error: "No users with office_id found",
        offices: offices || [],
        hint: "Either no users have office_id, or the column doesn't exist",
      }, { status: 404 });
    }

    const targetUser = users[0];
    const officeId = targetUser.office_id;

    // Step 2: Check existing sessions
    const { data: existingSessions } = await supabaseAdmin
      .from("whatsapp_sessions")
      .select("*")
      .limit(10);

    // Step 3: Delete any old sessions and create fresh one
    if (existingSessions && existingSessions.length > 0) {
      await supabaseAdmin
        .from("whatsapp_sessions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
    }

    // Step 4: Insert new session
    const { data: newSession, error: insertError } = await supabaseAdmin
      .from("whatsapp_sessions")
      .insert({
        office_id: officeId,
        phone_number: "966000000000",
        instance_id: "saqr",
        session_status: "connected",
        last_connected_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({
        step: "insert_session",
        error: insertError.message,
        code: insertError.code,
        officeId,
        userEmail: targetUser.email,
        existingSessions,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Session created successfully! Messages should now be routed.",
      session: newSession,
      officeId,
      userEmail: targetUser.email,
    });
  } catch (err) {
    return NextResponse.json({
      step: "unexpected",
      error: String(err),
    }, { status: 500 });
  }
}
