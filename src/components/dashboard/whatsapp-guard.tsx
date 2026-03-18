"use client";

import { Loader2, MessageSquareWarning } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Pages that are accessible WITHOUT a WhatsApp connection.
 * Everything else in /dashboard/* is blocked until connected.
 */
const ALLOWED_WITHOUT_WA = [
  "/dashboard/whatsapp",
  "/dashboard/connect-whatsapp",
  "/dashboard/settings",
  "/dashboard/subscription",
];

function isAllowedPath(pathname: string): boolean {
  return ALLOWED_WITHOUT_WA.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

/**
 * Wraps dashboard children. Checks if the office has an active WhatsApp
 * session; if not, blocks access and shows a redirect prompt.
 *
 * The check fires once on mount and caches the result for the session.
 * Pages in ALLOWED_WITHOUT_WA are always rendered.
 */
export function WhatsAppGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<
    "loading" | "connected" | "disconnected"
  >("loading");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/whatsapp/connect");
        if (!res.ok) {
          if (!cancelled) setStatus("disconnected");
          return;
        }
        const data = await res.json();
        const isConnected =
          data.evolutionStatus === "connected" ||
          data.session?.sessionStatus === "connected";
        if (!cancelled) setStatus(isConnected ? "connected" : "disconnected");
      } catch {
        if (!cancelled) setStatus("disconnected");
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  // Re-check when navigating back from /dashboard/whatsapp after connecting
  useEffect(() => {
    if (status === "disconnected" && !isAllowedPath(pathname)) {
      fetch("/api/whatsapp/connect")
        .then((r) => r.json())
        .then((data) => {
          const isConnected =
            data.evolutionStatus === "connected" ||
            data.session?.sessionStatus === "connected";
          if (isConnected) setStatus("connected");
        })
        .catch(() => {});
    }
  }, [pathname, status]);

  // Always allow exempt pages
  if (isAllowedPath(pathname)) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "disconnected") {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-500/10 flex items-center justify-center">
            <MessageSquareWarning className="w-8 h-8 text-yellow-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-text-primary">
              يجب ربط واتساب أولاً للبدء
            </h2>
            <p className="text-text-secondary text-sm">
              لاستخدام لوحة التحكم واستقبال الرسائل، يجب ربط رقم واتساب المكتب
              أولاً.
            </p>
          </div>

          <Link
            href="/dashboard/whatsapp"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#25D366]/90 transition-colors font-medium"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            ربط واتساب الآن
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
