"use client";

import { useAuth } from "@/hooks/useAuth";
import type { ViewingRequest, ViewingStatus } from "@/types/viewing";
import { motion } from "framer-motion";
import {
    Calendar,
    Check,
    ChevronRight,
    Clock,
    Loader2,
    MapPin,
    Phone,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const statusConfig: Record<
  ViewingStatus,
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: "بانتظار التأكيد",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  confirmed: {
    label: "مؤكد",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  completed: {
    label: "تمّت الزيارة",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  cancelled: {
    label: "ملغي",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
};

export default function ViewingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [viewings, setViewings] = useState<ViewingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<ViewingStatus | "all">("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchViewings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ officeId: "default" });
      if (filter !== "all") params.set("status", filter);
      const res = await fetch(`/api/viewings?${params}`);
      const data = await res.json();
      if (data.success) {
        setViewings(data.viewings);
      }
    } catch (error) {
      console.error("Failed to fetch viewings:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchViewings();
  }, [fetchViewings]);

  const updateStatus = async (id: string, status: ViewingStatus) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/viewings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStatus", id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setViewings((prev) =>
          prev.map((v) => (v.id === id ? { ...v, status } : v)),
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredViewings =
    filter === "all" ? viewings : viewings.filter((v) => v.status === filter);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-text-secondary hover:text-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
                <span className="text-sm">لوحة التحكم</span>
              </Link>
              <span className="text-border">/</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-bold text-text-primary">
                  طلبات المعاينة
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-text-primary">
              {viewings.length}
            </p>
            <p className="text-sm text-text-secondary mt-1">إجمالي الطلبات</p>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-yellow-400">
              {viewings.filter((v) => v.status === "pending").length}
            </p>
            <p className="text-sm text-text-secondary mt-1">بانتظار التأكيد</p>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-green-400">
              {viewings.filter((v) => v.status === "confirmed").length}
            </p>
            <p className="text-sm text-text-secondary mt-1">مؤكد</p>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-blue-400">
              {viewings.filter((v) => v.status === "completed").length}
            </p>
            <p className="text-sm text-text-secondary mt-1">تمّت الزيارة</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(
            [
              { key: "all", label: "الكل" },
              { key: "pending", label: "بانتظار التأكيد" },
              { key: "confirmed", label: "مؤكد" },
              { key: "completed", label: "تمّت الزيارة" },
              { key: "cancelled", label: "ملغي" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? "bg-primary text-white"
                  : "bg-background border border-border text-text-secondary hover:bg-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Viewings List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredViewings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-background rounded-xl border border-border"
          >
            <Calendar className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <p className="text-text-secondary text-lg mb-2">
              لا توجد طلبات معاينة
            </p>
            <p className="text-text-muted text-sm">
              سيظهر هنا طلبات المعاينة عندما يطلب العملاء زيارة العقارات عبر
              واتساب
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredViewings.map((viewing, index) => (
              <motion.div
                key={viewing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-background rounded-xl border border-border p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border font-medium ${statusConfig[viewing.status].bg} ${statusConfig[viewing.status].color}`}
                      >
                        {statusConfig[viewing.status].label}
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(viewing.createdAt).toLocaleDateString(
                          "ar-SA",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span>{viewing.clientName || "بدون اسم"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span dir="ltr">{viewing.clientPhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          العقار: {viewing.propertyId.slice(0, 8)}...
                        </span>
                      </div>
                    </div>

                    {viewing.preferredDate && (
                      <div className="flex items-center gap-1.5 text-sm text-primary">
                        <Clock className="w-4 h-4" />
                        <span>
                          الموعد المطلوب:{" "}
                          {new Date(viewing.preferredDate).toLocaleDateString(
                            "ar-SA",
                            {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    )}

                    {viewing.notes && (
                      <p className="text-xs text-text-muted mt-1">
                        {viewing.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {viewing.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(viewing.id, "confirmed")}
                          disabled={updating === viewing.id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors text-sm disabled:opacity-50"
                        >
                          {updating === viewing.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          تأكيد
                        </button>
                        <button
                          onClick={() => updateStatus(viewing.id, "cancelled")}
                          disabled={updating === viewing.id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          إلغاء
                        </button>
                      </>
                    )}
                    {viewing.status === "confirmed" && (
                      <button
                        onClick={() => updateStatus(viewing.id, "completed")}
                        disabled={updating === viewing.id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-sm disabled:opacity-50"
                      >
                        {updating === viewing.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        تمّت الزيارة
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
