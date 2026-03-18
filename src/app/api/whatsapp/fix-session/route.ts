/**
 * Emergency session fixer — creates a WhatsApp session record (multi-tenant)
 * GET /api/whatsapp/fix-session
 */

import { instanceNameForOffice } from "@/lib/evolution";
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
      return NextResponse.json(
        {
          step: "find_users",
          error: usersError.message,
          hint: "Query on users table failed",
        },
        { status: 500 },
      );
    }

    if (!users || users.length === 0) {
      const { data: offices } = await supabaseAdmin
        .from("offices")
        .select("id, name")
        .limit(5);

      return NextResponse.json(
        {
          step: "find_users",
          error: "No users with office_id found",
          offices: offices || [],
          hint: "Either no users have office_id, or the column doesn't exist",
        },
        { status: 404 },
      );
    }

    const targetUser = users[0];
    const officeId = targetUser.office_id;
    const instanceName = instanceNameForOffice(officeId);

    // Step 2: Ensure table exists
    const { error: tableCheck } = await supabaseAdmin
      .from("whatsapp_sessions")
      .select("id")
      .limit(1);

    if (
      tableCheck?.code === "PGRST205" ||
      tableCheck?.message?.includes("schema cache")
    ) {
      const { error: createError } = await supabaseAdmin.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS public.whatsapp_sessions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            office_id UUID NOT NULL,
            phone_number TEXT NOT NULL DEFAULT '',
            instance_id TEXT,
            session_status TEXT NOT NULL DEFAULT 'pending',
            api_token TEXT,
            webhook_url TEXT,
            last_connected_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            CONSTRAINT whatsapp_sessions_office_id_key UNIQUE (office_id)
          );
          ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;
          CREATE POLICY "full_access" ON public.whatsapp_sessions FOR ALL USING (true) WITH CHECK (true);
          NOTIFY pgrst, 'reload schema';
        `,
      });

      if (createError) {
        return NextResponse.json(
          {
            step: "create_table",
            error: createError.message,
            hint: "Run migration manually in Supabase SQL Editor",
            officeId,
          },
          { status: 500 },
        );
      }

      await new Promise((r) => setTimeout(r, 2000));
    }

    // Step 3: Upsert session for this office with its own instance
    const { data: newSession, error: insertError } = await supabaseAdmin
      .from("whatsapp_sessions")
      .upsert(
        {
          office_id: officeId,
          phone_number: "966000000000",
          instance_id: instanceName,
          session_status: "connected",
          last_connected_at: new Date().toISOString(),
        },
        { onConflict: "office_id" },
      )
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          step: "insert_session",
          error: insertError.message,
          code: insertError.code,
          officeId,
          instanceName,
          userEmail: targetUser.email,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Session created! Messages should now be routed correctly.",
      session: newSession,
      officeId,
      instanceName,
      userEmail: targetUser.email,
    });
  } catch (err) {
    return NextResponse.json(
      { step: "unexpected", error: String(err) },
      { status: 500 },
    );
  }
}
