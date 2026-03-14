/**
 * API Helpers — centralized response handling, auth, and validation
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";

import { OfficeService } from "@/services/office.service";
import { logger } from "./logger";
import { rateLimit } from "./rate-limit";

// ── Supabase Server Client ──
export async function createRouteClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options as any);
            } catch {
              // Cookie set fails in some contexts
            }
          });
        },
      },
    },
  );
}

// ── Auth Context ──
export interface AuthContext {
  userId: string;
  email: string;
  role: string;
  officeId: string | null;
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("role, office_id")
    .eq("id", user.id)
    .single();

  // If no office_id on profile, try to resolve it
  let officeId = profile?.office_id || null;
  if (!officeId) {
    try {
      const office = await OfficeService.getOfficeByUserId(user.id);
      officeId = office?.id || null;
    } catch {
      // Office may not exist yet
    }
  }

  return {
    userId: user.id,
    email: user.email || "",
    role: profile?.role || "user",
    officeId,
  };
}

// ── Response Helpers ──
export function successResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// ── Validation ──
export function validateBody<T>(
  schema: ZodSchema<T>,
  data: unknown,
): { data: T | null; error: string | null } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const messages = result.error.issues
      .map((e: { message: string }) => e.message)
      .join(", ");
    return { data: null, error: messages };
  }
  return { data: result.data, error: null };
}

// ── API Route Wrapper with rate limiting, auth, error handling ──
type RouteHandler = (
  request: NextRequest,
  context: { auth: AuthContext },
) => Promise<NextResponse>;

type PublicRouteHandler = (request: NextRequest) => Promise<NextResponse>;

export function withAuth(handler: RouteHandler) {
  return async (request: NextRequest) => {
    // Rate limit
    const rateLimited = await rateLimit(request);
    if (rateLimited) return rateLimited;

    // Auth
    const auth = await getAuthContext();
    if (!auth) return errorResponse("غير مصرح", 401);

    try {
      return await handler(request, { auth });
    } catch (err) {
      logger.error("API", `${request.method} ${request.nextUrl.pathname}`, err);
      return errorResponse("حدث خطأ في الخادم", 500);
    }
  };
}

export function withAdmin(handler: RouteHandler) {
  return async (request: NextRequest) => {
    const rateLimited = await rateLimit(request);
    if (rateLimited) return rateLimited;

    const auth = await getAuthContext();
    if (!auth) return errorResponse("غير مصرح", 401);
    if (auth.role !== "admin") return errorResponse("ليس لديك صلاحية", 403);

    try {
      return await handler(request, { auth });
    } catch (err) {
      logger.error("API", `${request.method} ${request.nextUrl.pathname}`, err);
      return errorResponse("حدث خطأ في الخادم", 500);
    }
  };
}

export function withPublic(handler: PublicRouteHandler) {
  return async (request: NextRequest) => {
    const rateLimited = await rateLimit(request);
    if (rateLimited) return rateLimited;

    try {
      return await handler(request);
    } catch (err) {
      logger.error("API", `${request.method} ${request.nextUrl.pathname}`, err);
      return errorResponse("حدث خطأ في الخادم", 500);
    }
  };
}

// Role-based route wrapper
type RoleRouteHandler = (
  request: NextRequest,
  context: { auth: AuthContext },
) => Promise<NextResponse>;

export function withRole(roles: string[], handler: RoleRouteHandler) {
  return async (request: NextRequest) => {
    const rateLimited = await rateLimit(request);
    if (rateLimited) return rateLimited;

    const auth = await getAuthContext();
    if (!auth) return errorResponse("غير مصرح", 401);
    if (!roles.includes(auth.role))
      return errorResponse("ليس لديك صلاحية", 403);

    try {
      return await handler(request, { auth });
    } catch (err) {
      logger.error("API", `${request.method} ${request.nextUrl.pathname}`, err);
      return errorResponse("حدث خطأ في الخادم", 500);
    }
  };
}
