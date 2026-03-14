"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* ─── Page title map ──────────────────────────────────────────── */
const PAGE_TITLES: Record<string, string> = {
  "/dashboard":                      "لوحة التحكم",
  "/dashboard/properties":           "إدارة العقارات",
  "/dashboard/properties/add":       "إضافة عقار",
  "/dashboard/clients":              "العملاء",
  "/dashboard/messages":             "الرسائل",
  "/dashboard/viewings":             "طلبات المعاينة",
  "/dashboard/analytics":            "الإحصائيات",
  "/dashboard/whatsapp":             "ربط الواتساب",
  "/dashboard/ai-listings":          "مولّد الإعلانات",
  "/dashboard/ai-agent":             "الوكيل الذكي",
  "/dashboard/unanswered-questions": "أسئلة معلّقة",
  "/dashboard/reports":              "التقارير",
  "/dashboard/settings":             "الإعدادات",
  "/dashboard/recommendations":      "التوصيات",
  "/dashboard/connect-whatsapp":     "ربط الواتساب",
  "/dashboard/subscription":         "الاشتراك والباقات",
  "/dashboard/subscription/checkout": "إتمام الاشتراك",
};

function getTitle(pathname: string): string {
  // exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // partial match (for dynamic segments)
  const match = Object.keys(PAGE_TITLES)
    .filter((k) => pathname.startsWith(k) && k !== "/dashboard")
    .sort((a, b) => b.length - a.length)[0];
  return match ? PAGE_TITLES[match] : "لوحة التحكم";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      {/* Sidebar */}
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — mobile only */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-surface border-b border-border sticky top-0 z-30 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl border border-border bg-background flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="فتح القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold text-text-primary font-cairo truncate">
            {getTitle(pathname)}
          </h1>
        </header>

        {/* Page content — flex-1 + overflow-auto so pages control their own scroll/height */}
        <main className="flex-1 overflow-auto flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
