"use client";

import { cn } from "@/lib/utils";
import {
    Activity,
    BarChart3,
    BookOpen,
    Brain,
    ClipboardList,
    CreditCard,
    DollarSign,
    FileText,
    FolderOpen,
    HeadphonesIcon,
    LayoutDashboard,
    LogOut,
    MessageCircle,
    Settings,
    Smartphone,
    UserPlus,
    Users,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { MqLogo } from "@/components/mq/MqLogo";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  // ── إدارة المنصة ──
  { title: "الرئيسية", href: "/admin", icon: LayoutDashboard },
  { title: "المشتركين", href: "/admin/subscribers", icon: Users },
  { title: "الباقات", href: "/admin/plans", icon: CreditCard },
  { title: "الفوترة والاستخدام", href: "/admin/billing-usage", icon: DollarSign },
  { title: "استهلاك الذكاء الاصطناعي", href: "/admin/ai-usage", icon: Brain },
  {
    title: "جلسات الواتساب",
    href: "/admin/whatsapp-sessions",
    icon: Smartphone,
  },
  {
    title: "مراقبة واتساب",
    href: "/admin/whatsapp-monitor",
    icon: Activity,
  },
  {
    title: "عمليات واتساب",
    href: "/admin/whatsapp-ops",
    icon: Zap,
  },
  { title: "تحليلات النظام", href: "/admin/system-analytics", icon: BarChart3 },
  // ── المحتوى ──
  { title: "المدونة", href: "/admin/blog", icon: FileText },
  { title: "المكتبة", href: "/admin/library", icon: BookOpen },
  { title: "مدير الملفات", href: "/admin/media", icon: FolderOpen },
  // ── العمليات ──
  { title: "العملاء المحتملون", href: "/admin/leads", icon: UserPlus },
  { title: "طلبات التجربة", href: "/admin/trials", icon: ClipboardList },
  { title: "الدعم الفني", href: "/admin/support", icon: HeadphonesIcon },
  { title: "بوت واتساب", href: "/admin/whatsapp-bot", icon: MessageCircle },
  { title: "الإعدادات", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-[#0D1117] border-l border-[#21262d] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[#21262d]">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="h-11 w-10 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-primary/25">
            <MqLogo variant="card" className="h-full w-full" />
          </div>
          <div>
            <span className="font-cairo font-bold text-lg text-white block">
              MQ
            </span>
            <span className="text-xs text-gray-500">لوحة الإدارة</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-gray-400 hover:bg-[#21262d] hover:text-white",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Stats Widget */}
      <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white">
            الإيرادات الشهرية
          </span>
        </div>
        <p className="text-2xl font-bold text-primary">٤٥,٦٠٠ ر.س</p>
        <p className="text-xs text-gray-500 mt-1">+12% من الشهر الماضي</p>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#21262d]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
