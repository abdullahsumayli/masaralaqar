/**
 * Queue Monitoring API — serves Bull Board UI
 *
 * This catch-all route proxies requests to the Bull Board Express adapter.
 * Protected: only admin users can access.
 *
 * URL: /api/admin/queues/[...slug]
 */

import { getQueueDashboard } from "@/lib/queue-dashboard";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerUser } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

async function isAdmin(): Promise<boolean> {
  try {
    const user = await getServerUser();
    if (!user) return false;
    const { data } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    return data?.role === "admin";
  } catch {
    return false;
  }
}

async function handleRequest(
  req: NextRequest,
): Promise<NextResponse | Response> {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const adapter = getQueueDashboard();
  const app = adapter.getRouter();

  // Build Express-compatible request
  const url = new URL(req.url);
  const basePath = "/api/admin/queues";
  const subPath = url.pathname.replace(basePath, "") || "/";

  // Use the Express router to handle the request
  return new Promise<Response>((resolve) => {
    const mockRes = {
      statusCode: 200,
      headers: new Headers(),
      body: "" as string,
      setHeader(name: string, value: string) {
        this.headers.set(name, value);
        return this;
      },
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      send(data: string) {
        this.body = data;
        resolve(
          new Response(this.body, {
            status: this.statusCode,
            headers: this.headers,
          }),
        );
        return this;
      },
      json(data: unknown) {
        this.headers.set("Content-Type", "application/json");
        this.body = JSON.stringify(data);
        resolve(
          new Response(this.body, {
            status: this.statusCode,
            headers: this.headers,
          }),
        );
        return this;
      },
      end(data?: string) {
        if (data) this.body = data;
        resolve(
          new Response(this.body || null, {
            status: this.statusCode,
            headers: this.headers,
          }),
        );
        return this;
      },
    };

    const mockReq = {
      method: req.method,
      url: subPath,
      path: subPath,
      query: Object.fromEntries(url.searchParams),
      headers: Object.fromEntries(req.headers),
    };

    try {
      app(mockReq as any, mockRes as any, () => {
        resolve(NextResponse.json({ error: "Not found" }, { status: 404 }));
      });
    } catch {
      resolve(
        NextResponse.json({ error: "Queue dashboard error" }, { status: 500 }),
      );
    }
  });
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

export async function PUT(req: NextRequest) {
  return handleRequest(req);
}
