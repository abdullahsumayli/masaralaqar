"use client";

import { useAuth } from "@/hooks/useAuth";
import {
    ArrowUpRight,
    BarChart3,
    ChevronRight,
    Eye,
    Home,
    Loader2,
    MessageSquare,
    Star,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PropertyStat {
  propertyId: string;
  count: number;
  title: string;
}

interface Analytics {
  topRequested: PropertyStat[];
  topRecommended: PropertyStat[];
  conversion: { total: number; visits: number; rate: number };
  recommendations: { shown: number; interested: number };
}

export default function RecommendationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/recommendations")
        .then((r) => r.json())
        .then((d) => setData(d))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-2 text-sm">
            <Link
              href="/dashboard"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              لوحة التحكم
            </Link>
            <ChevronRight className="w-4 h-4 text-text-secondary rotate-180" />
            <span className="text-text-primary font-medium">
              تحليلات التوصيات
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-cairo">
            تحليلات التوصيات
          </h1>
          <p className="text-text-secondary mt-1">
            أداء محرك التوصيات الذكية لمكتبك
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            icon={<MessageSquare className="w-5 h-5 text-primary" />}
            label="التوصيات المعروضة"
            value={data?.recommendations?.shown || 0}
            bg="bg-primary/10"
          />
          <SummaryCard
            icon={<Star className="w-5 h-5 text-amber-400" />}
            label="إبداء اهتمام"
            value={data?.recommendations?.interested || 0}
            bg="bg-amber-500/10"
          />
          <SummaryCard
            icon={<Eye className="w-5 h-5 text-purple-400" />}
            label="طلبات المعاينة"
            value={data?.conversion?.visits || 0}
            bg="bg-purple-500/10"
          />
          <SummaryCard
            icon={<TrendingUp className="w-5 h-5 text-green-400" />}
            label="نسبة التحويل"
            value={`${(data?.conversion?.rate || 0).toFixed(1)}%`}
            bg="bg-green-500/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Requested Properties */}
          <div className="bg-background border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  أكثر العقارات طلباً
                </h2>
                <p className="text-text-secondary text-xs">
                  العقارات التي يسأل عنها العملاء أكثر
                </p>
              </div>
            </div>
            {data?.topRequested && data.topRequested.length > 0 ? (
              <div className="space-y-3">
                {data.topRequested.map((item, idx) => (
                  <PropertyRow
                    key={item.propertyId}
                    rank={idx + 1}
                    title={item.title}
                    count={item.count}
                    label="استفسار"
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Home className="w-10 h-10 text-text-secondary/30" />}
                message="لا توجد بيانات بعد. ستظهر هنا أكثر العقارات طلباً بعد بدء تفاعل العملاء."
              />
            )}
          </div>

          {/* AI Recommended Properties */}
          <div className="bg-background border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  ترشيحات الذكاء الاصطناعي
                </h2>
                <p className="text-text-secondary text-xs">
                  العقارات التي يرشحها AI أكثر للعملاء
                </p>
              </div>
            </div>
            {data?.topRecommended && data.topRecommended.length > 0 ? (
              <div className="space-y-3">
                {data.topRecommended.map((item, idx) => (
                  <PropertyRow
                    key={item.propertyId}
                    rank={idx + 1}
                    title={item.title}
                    count={item.count}
                    label="ترشيح"
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={
                  <BarChart3 className="w-10 h-10 text-text-secondary/30" />
                }
                message="لا توجد بيانات بعد. سيبدأ محرك التوصيات بتسجيل الترشيحات عند تفاعل العملاء عبر واتساب."
              />
            )}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-background border border-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-text-primary mb-4">
            مسار التحويل
          </h2>
          <div className="flex items-center gap-2">
            <FunnelStep
              label="توصيات"
              value={data?.recommendations?.shown || 0}
              color="bg-primary"
            />
            <ArrowUpRight className="w-4 h-4 text-text-secondary" />
            <FunnelStep
              label="اهتمام"
              value={data?.recommendations?.interested || 0}
              color="bg-amber-500"
            />
            <ArrowUpRight className="w-4 h-4 text-text-secondary" />
            <FunnelStep
              label="معاينة"
              value={data?.conversion?.visits || 0}
              color="bg-green-500"
            />
          </div>
          <div className="mt-4 h-3 bg-border/50 rounded-full overflow-hidden flex">
            {data?.recommendations?.shown ? (
              <>
                <div className="h-full bg-primary" style={{ width: "100%" }} />
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width: `${data.recommendations.shown ? (data.recommendations.interested / data.recommendations.shown) * 100 : 0}%`,
                  }}
                />
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${data.recommendations.shown ? ((data.conversion?.visits || 0) / data.recommendations.shown) * 100 : 0}%`,
                  }}
                />
              </>
            ) : (
              <div className="h-full w-full bg-border/30" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bg: string;
}) {
  return (
    <div className="bg-background border border-border rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}
        >
          {icon}
        </div>
        <p className="text-text-secondary text-sm">{label}</p>
      </div>
      <p className="text-2xl font-bold text-text-primary">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function PropertyRow({
  rank,
  title,
  count,
  label,
}: {
  rank: number;
  title: string;
  count: number;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface rounded-xl">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">
          {rank}
        </span>
        <span className="text-text-primary text-sm truncate max-w-[200px]">
          {title}
        </span>
      </div>
      <span className="text-text-secondary text-xs">
        {count} {label}
      </span>
    </div>
  );
}

function EmptyState({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-3 flex justify-center">{icon}</div>
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  );
}

function FunnelStep({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex-1 text-center">
      <div className={`w-3 h-3 ${color} rounded-full mx-auto mb-1`} />
      <p className="text-text-primary font-bold">{value.toLocaleString()}</p>
      <p className="text-text-secondary text-xs">{label}</p>
    </div>
  );
}
