"use client";

import { useAuth } from "@/hooks/useAuth";
import {
    Building2,
    CalendarDays,
    ChevronRight,
    Download,
    Loader2,
    Users
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const REPORTS = [
  {
    type: "leads",
    title: "تقرير العملاء المحتملين",
    description: "جميع العملاء مع حالاتهم ومصادرهم",
    icon: Users,
  },
  {
    type: "properties",
    title: "تقرير العقارات",
    description: "كافة العقارات مع تفاصيل الأسعار والمشاهدات",
    icon: Building2,
  },
  {
    type: "monthly",
    title: "التقرير الشهري",
    description: "ملخص النشاط الشهري: عقارات، عملاء، رسائل، معاينات",
    icon: CalendarDays,
  },
] as const;

export default function ReportsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleDownload = async (type: string) => {
    setDownloading(type);
    try {
      const res = await fetch(`/api/reports/export?type=${type}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "خطأ" }));
        alert(err.error || "فشل تحميل التقرير");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `masar_${type}_report_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("خطأ في تحميل التقرير");
    } finally {
      setDownloading(null);
    }
  };

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
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <span className="text-text-primary font-medium">التقارير</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            التقارير
          </h1>
          <p className="text-text-secondary text-sm">
            تصدير تقارير PDF لبيانات مكتبك
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {REPORTS.map((report) => (
            <div
              key={report.type}
              className="bg-background rounded-xl p-6 border border-border flex flex-col"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <report.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                {report.title}
              </h3>
              <p className="text-sm text-text-secondary flex-1 mb-4">
                {report.description}
              </p>
              <button
                onClick={() => handleDownload(report.type)}
                disabled={downloading !== null}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {downloading === report.type ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                تحميل PDF
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
