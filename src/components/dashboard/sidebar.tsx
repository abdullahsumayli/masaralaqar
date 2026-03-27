"use client";

import { useAuth } from "@/hooks/useAuth";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Building2,
  ChevronLeft,
  CreditCard,
  Eye,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
  Users,
  Wifi,
  WifiOff,
  X,
  Share2,
  Zap,
} from "lucide-react";
import { MqLogo } from "@/components/mq/MqLogo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/* ─── nav items ───────────────────────────────────────────────── */
const NAV_MAIN = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/properties", label: "العقارات", icon: Building2 },
  { href: "/dashboard/clients", label: "العملاء", icon: Users },
  { href: "/dashboard/messages", label: "الرسائل", icon: MessageSquare },
  { href: "/dashboard/viewings", label: "طلبات المعاينة", icon: Eye },
  { href: "/dashboard/analytics", label: "الإحصائيات", icon: BarChart3 },
];

const NAV_AI = [
  { href: "/dashboard/whatsapp", label: "ربط الواتساب", icon: Bot },
  { href: "/dashboard/ai-listings", label: "مولّد الإعلانات", icon: Sparkles },
  { href: "/dashboard/ai-agent", label: "الوكيل الذكي", icon: Zap },
  { href: "/dashboard/unanswered-questions", label: "أسئلة معلّقة", icon: HelpCircle },
];

const NAV_BOTTOM = [
  { href: "/dashboard/billing", label: "الفواتير", icon: CreditCard },
  { href: "/partner/dashboard", label: "برنامج الإحالة", icon: Share2 },
  { href: "/dashboard/reports", label: "التقارير", icon: BarChart3 },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

const SUB_LABELS: Record<string, string> = {
  free: "مجانية",
  starter: "بداية",
  basic: "أساسية",
  growth: "نمو",
  pro: "احترافية",
  enterprise: "مؤسسات",
};

/* ─── WhatsApp status hook ─────────────────────────────────────── */
function useWhatsAppStatus() {
  const [connected, setConnected] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/whatsapp/connect")
      .then((r) => r.json())
      .then((d) => {
        const isConnected =
          d.evolutionStatus === "connected" ||
          d.session?.sessionStatus === "connected";
        setConnected(isConnected);
      })
      .catch(() => setConnected(false));
  }, []);
  return connected;
}

/* ─── NavItem ──────────────────────────────────────────────────── */
function NavItem(
  {
    href,
    label,
    icon: Icon,
    exact,
    collapsed,
    onClick,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    exact?: boolean;
    collapsed: boolean;
    onClick?: () => void;
  }
) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group border-r-[3px] border-transparent",
        active
          ? "bg-card-hover text-text-primary border-r-mq-green"
          : "text-text-secondary hover:text-text-primary hover:bg-card-hover",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon
        className={cn(
          "flex-shrink-0 transition-colors",
          active ? "text-mq-green" : "text-text-muted group-hover:text-text-secondary",
        )}
        style={{ width: 18, height: 18 }}
      />
      {!collapsed && (
        <span className="text-sm font-medium leading-none truncate">{label}</span>
      )}
      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="absolute right-full mr-2 px-2.5 py-1.5 bg-card border border-border rounded-lg text-xs text-text-primary whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-card">
          {label}
        </div>
      )}
    </Link>
  );
}

/* ─── Sidebar ──────────────────────────────────────────────────── */
export function DashboardSidebar(
  {
    mobileOpen,
    onMobileClose,
  }: {
    mobileOpen: boolean;
    onMobileClose: () => void;
  }
) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const waStatus = useWhatsAppStatus();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  const subLabel = SUB_LABELS[profile?.subscription ?? "free"] ?? "مجانية";
  const displayName = profile?.name || user?.email || "";
  const avatarChar = (displayName[0] ?? "م").toUpperCase();

  const sidebarContent = (
    <div
      className={cn(
        "flex flex-col h-full bg-surface border-l border-border transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64",
      )}
      dir="rtl"
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-border flex-shrink-0">
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white shadow-glow-blue">
              <MqLogo className="h-[72%] w-[72%]" />
            </div>
            <div className="leading-none">
              <span className="font-cairo font-bold text-sm text-text-primary block">MQ</span>
              <span className="text-[10px] text-primary/70 font-medium">PropTech</span>
            </div>
          </Link>
        ) : (
          <Link href="/" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-border bg-white shadow-glow-blue">
              <MqLogo className="h-[72%] w-[72%]" />
            </div>
          </Link>
        )}
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-text-muted hover:text-text-primary hover:bg-card-hover transition-all flex-shrink-0",
            collapsed && "mx-auto mt-0",
          )}
          title={collapsed ? "توسيع" : "طيّ"}
          aria-label={collapsed ? "توسيع القائمة الجانبية" : "طيّ القائمة الجانبية"}
          aria-expanded={!collapsed}
          aria-controls="sidebar-nav"
        >
          <ChevronLeft
            className={cn("w-4 h-4 transition-transform duration-300", collapsed && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ── Scrollable nav ───────────────────────────── */}
      <nav id="sidebar-nav" className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5 scrollbar-thin">
        {/* Main section */}
        {!collapsed ? (
          <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            الرئيسي
          </p>
        ) : (
          <div className="py-2" />
        )}
        {NAV_MAIN.map((item) => (
          <NavItem key={item.href} {...item} collapsed={collapsed} onClick={onMobileClose} />
        ))}

        {/* AI section */}
        {!collapsed ? (
          <p className="px-3 pb-1.5 pt-4 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            الذكاء الاصطناعي
          </p>
        ) : (
          <div className="py-2 border-t border-border/50 mx-2" />
        )}
        {NAV_AI.map((item) => (
          <NavItem key={item.href} {...item} collapsed={collapsed} onClick={onMobileClose} />
        ))}

        {/* Other section */}
        {!collapsed ? (
          <p className="px-3 pb-1.5 pt-4 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            أخرى
          </p>
        ) : (
          <div className="py-2 border-t border-border/50 mx-2" />
        )}
        {NAV_BOTTOM.map((item) => (
          <NavItem key={item.href} {...item} collapsed={collapsed} onClick={onMobileClose} />
        ))}
      </nav>

      {/* ── WhatsApp Status ──────────────────────────── */}
      {!collapsed && (
        <div className="mx-3 mb-3 px-3 py-2.5 rounded-xl bg-background border border-border flex items-center gap-2.5">
          {waStatus === null ? (
            <span className="w-2 h-2 rounded-full bg-text-muted animate-pulse flex-shrink-0" />
          ) : waStatus ? (
            <Wifi className="w-4 h-4 text-success flex-shrink-0" />
          ) : (
            <WifiOff className="w-4 h-4 text-error flex-shrink-0" />
          )}
          <div className="leading-none min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">واتساب MQ</p>
            <p
              className={cn(
                "text-[10px] mt-0.5",
                waStatus === null ? "text-text-muted" : waStatus ? "text-success" : "text-error",
              )}
            >
              {waStatus === null ? "جاري التحقق..." : waStatus ? "متصل" : "غير متصل"}
            </p>
          </div>
          {waStatus === false && (
            <Link
              href="/dashboard/whatsapp"
              onClick={onMobileClose}
              className="mr-auto text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex-shrink-0"
            >
              ربط
            </Link>
          )}
        </div>
      )}

      {/* ── User + Logout ────────────────────────────── */}
      <div className="border-t border-border p-3 flex-shrink-0">
        {!loading && user && !collapsed && (
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary-dark/30 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">{avatarChar}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-primary truncate">{displayName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-text-muted">باقة {subLabel}</span>
                {(profile?.subscription === "free" || !profile?.subscription) && (
                  <Link
                    href="/dashboard/subscription"
                    onClick={onMobileClose}
                    className="text-[10px] text-primary hover:underline"
                  >
                    ترقية
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          title={collapsed ? "تسجيل الخروج" : undefined}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-muted hover:text-error hover:bg-error/5 transition-all text-sm",
            collapsed && "justify-center",
          )}
        >
          <LogOut style={{ width: 16, height: 16 }} className="flex-shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
        {/* Upgrade CTA — only show for free users */}
        {!collapsed && (profile?.subscription === "free" || !profile?.subscription) && (
          <Link
            href="/dashboard/subscription"
            onClick={onMobileClose}
            className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-l from-primary/20 to-primary-dark/20 border border-primary/20 text-primary text-xs font-medium hover:border-primary/40 transition-colors"
          >
            <CreditCard style={{ width: 13, height: 13 }} />
            ترقية الباقة
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* ── Mobile Overlay + Drawer ──────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 z-50 flex flex-col"
              style={{ width: 256 }}
            >
              {/* Close button */}
              <button
                onClick={onMobileClose}
                className="absolute left-3 top-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
