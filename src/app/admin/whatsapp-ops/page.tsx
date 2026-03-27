"use client";

import {
  Activity,
  AlertCircle,
  Loader2,
  QrCode,
  RefreshCw,
  ScrollText,
  Smartphone,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ConnectionStatus = "connected" | "reconnecting" | "failed";

interface MonitorRow {
  officeId: string;
  officeName: string;
  instanceName: string;
  connectionStatus: ConnectionStatus;
  lastActivity: string | null;
  failureCount: number;
  needsManualIntervention: boolean;
  phoneNumber: string;
  sessionStatus: string;
}

interface QueueMetrics {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  alerts: string[] | null;
}

const REFRESH_INTERVAL_MS = 10_000;

const statusConfig: Record<
  ConnectionStatus,
  { label: string; color: string; bg: string; icon: typeof Wifi }
> = {
  connected: {
    label: "متصل",
    color: "text-green-400",
    bg: "bg-green-500/10",
    icon: Wifi,
  },
  reconnecting: {
    label: "جاري إعادة الربط",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    icon: RefreshCw,
  },
  failed: {
    label: "فشل",
    color: "text-red-400",
    bg: "bg-red-500/10",
    icon: WifiOff,
  },
};

function SkeletonRow() {
  return (
    <tr className="border-b border-[#21262d]/50">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-[#21262d]/50 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminWhatsAppOpsPage() {
  const [rows, setRows] = useState<MonitorRow[]>([]);
  const [queueMetrics, setQueueMetrics] = useState<QueueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [reconnecting, setReconnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{
    instance: string;
    qr: string;
    pairingCode?: string;
  } | null>(null);
  const [logsModal, setLogsModal] = useState<{
    officeId: string;
    officeName: string;
  } | null>(null);
  const [logs, setLogs] = useState<
    Array<{ eventType: string; severity: string; createdAt: string }>
  >([]);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [monitorRes, queueRes] = await Promise.all([
        fetch("/api/admin/whatsapp-monitor"),
        fetch("/api/queue/metrics"),
      ]);
      const monitorJson = await monitorRes.json();
      const queueJson = await queueRes.json();
      if (monitorJson.success && monitorJson.data) setRows(monitorJson.data);
      if (queueJson.success && queueJson.data)
        setQueueMetrics(queueJson.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  const summary = {
    total: rows.length,
    connected: rows.filter((r) => r.connectionStatus === "connected").length,
    reconnecting: rows.filter((r) => r.connectionStatus === "reconnecting").length,
    critical: rows.filter((r) => r.needsManualIntervention).length,
  };

  const handleReconnect = async (instanceName: string) => {
    setReconnecting(instanceName);
    try {
      const res = await fetch("/api/whatsapp/reconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instance_name: instanceName }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", "تم طلب رمز QR جديد");
        fetchData();
      } else {
        showToast("error", json.error || "فشل في إعادة الربط");
      }
    } catch {
      showToast("error", "حدث خطأ أثناء إعادة الربط");
    } finally {
      setReconnecting(null);
    }
  };

  const handleDisconnect = async (instanceName: string) => {
    if (!confirm("هل أنت متأكد من فصل هذا الاتصال؟")) return;
    setDisconnecting(instanceName);
    try {
      const res = await fetch("/api/whatsapp/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instance_name: instanceName }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", "تم فصل الاتصال");
        fetchData();
      } else {
        showToast("error", json.error || "فشل في فصل الاتصال");
      }
    } catch {
      showToast("error", "حدث خطأ أثناء فصل الاتصال");
    } finally {
      setDisconnecting(null);
    }
  };

  const handleViewQr = async (instanceName: string) => {
    try {
      const res = await fetch(
        `/api/whatsapp/qr?instance_name=${encodeURIComponent(instanceName)}`,
      );
      const json = await res.json();
      if (json.success) {
        setQrModal({
          instance: instanceName,
          qr: json.qr || "",
          pairingCode: json.pairingCode,
        });
      } else {
        showToast("error", json.error || "فشل في جلب رمز QR");
      }
    } catch {
      showToast("error", "حدث خطأ أثناء جلب رمز QR");
    }
  };

  const handleViewLogs = async (officeId: string, officeName: string) => {
    setLogsModal({ officeId, officeName });
    try {
      const res = await fetch(
        `/api/whatsapp/incidents?office_id=${encodeURIComponent(officeId)}&limit=30`,
      );
      const json = await res.json();
      if (json.success && json.data) {
        setLogs(
          json.data.map(
            (i: {
              eventType: string;
              severity: string;
              createdAt: string;
            }) => ({
              eventType: i.eventType,
              severity: i.severity,
              createdAt: i.createdAt,
            }),
          ),
        );
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${
            toast.type === "success"
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">
            عمليات واتساب
          </h1>
          <p className="text-gray-400 mt-1">
            مراقبة وإدارة اتصالات واتساب — يتم التحديث كل 10 ثوانٍ
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchData();
          }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] text-gray-300 rounded-xl hover:bg-[#21262d] transition-colors border border-[#21262d] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>تحديث</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <p className="text-gray-400 text-sm">إجمالي المكاتب</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {loading ? "—" : summary.total}
          </p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Wifi className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-gray-400 text-sm">متصل</p>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {loading ? "—" : summary.connected}
          </p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-gray-400 text-sm">جاري إعادة الربط</p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {loading ? "—" : summary.reconnecting}
          </p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-gray-400 text-sm">يحتاج تدخل</p>
          </div>
          <p className="text-2xl font-bold text-red-400">
            {loading ? "—" : summary.critical}
          </p>
        </div>
      </div>

      {/* Queue Panel */}
      {queueMetrics && (
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            طابور الرسائل
          </h3>
          <div className="flex flex-wrap gap-6">
            <span className="text-gray-300">
              في الانتظار: <strong className="text-white">{queueMetrics.waiting}</strong>
            </span>
            <span className="text-gray-300">
              قيد المعالجة: <strong className="text-white">{queueMetrics.active}</strong>
            </span>
            <span className="text-gray-300">
              مكتمل: <strong className="text-green-400">{queueMetrics.completed}</strong>
            </span>
            <span className="text-gray-300">
              فشل: <strong className="text-red-400">{queueMetrics.failed}</strong>
            </span>
            {queueMetrics.alerts?.length && (
              <span className="text-yellow-400 text-sm">
                تنبيه: {queueMetrics.alerts.join(", ")}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
        {loading && rows.length === 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#21262d]">
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  المكتب
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  الحالة
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  آخر نشاط
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  عدد الفشل
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        ) : rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#21262d]">
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    المكتب
                  </th>
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    الحالة
                  </th>
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    آخر نشاط
                  </th>
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    عدد الفشل
                  </th>
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const sc = statusConfig[row.connectionStatus];
                  const Icon = sc.icon;
                  const needsAction = row.needsManualIntervention;
                  return (
                    <tr
                      key={row.officeId}
                      className={`border-b border-[#21262d]/50 hover:bg-[#161b22] transition-colors ${
                        needsAction ? "bg-red-500/5" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">
                            {row.officeName}
                          </span>
                          {needsAction && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 font-medium"
                              title="يحتاج تدخل يدوي"
                            >
                              <AlertCircle className="w-3 h-3" />
                              يحتاج تدخل
                            </span>
                          )}
                        </div>
                        <p
                          className="text-gray-500 text-xs mt-0.5 font-mono"
                          dir="ltr"
                        >
                          {row.instanceName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {row.lastActivity
                          ? new Date(row.lastActivity).toLocaleString(
                              "ar-SA",
                              { dateStyle: "short", timeStyle: "short" },
                            )
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            row.failureCount > 0
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {row.failureCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() =>
                              handleReconnect(row.instanceName)
                            }
                            disabled={reconnecting === row.instanceName}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium disabled:opacity-50"
                          >
                            {reconnecting === row.instanceName ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                            Reconnect
                          </button>
                          <button
                            onClick={() => handleViewQr(row.instanceName)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] text-gray-300 hover:bg-[#30363d] text-xs font-medium"
                          >
                            <QrCode className="w-3 h-3" />
                            View QR
                          </button>
                          <button
                            onClick={() =>
                              handleDisconnect(row.instanceName)
                            }
                            disabled={disconnecting === row.instanceName}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium disabled:opacity-50"
                          >
                            {disconnecting === row.instanceName ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <WifiOff className="w-3 h-3" />
                            )}
                            Disconnect
                          </button>
                          <button
                            onClick={() =>
                              handleViewLogs(row.officeId, row.officeName)
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] text-gray-300 hover:bg-[#30363d] text-xs font-medium"
                          >
                            <ScrollText className="w-3 h-3" />
                            Logs
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Smartphone className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">لا توجد جلسات واتساب للمراقبة.</p>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setQrModal(null)}
        >
          <div
            className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              رمز QR — {qrModal.instance}
            </h3>
            {qrModal.qr ? (
              <div className="bg-white p-4 rounded-xl mb-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrModal.qr}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            ) : (
              <p className="text-gray-400 text-sm mb-4">
                المثيل متصل أو لم يتم إرجاع رمز QR.
              </p>
            )}
            {qrModal.pairingCode && (
              <p
                className="text-gray-400 text-sm mb-4 font-mono"
                dir="ltr"
              >
                رمز الربط: {qrModal.pairingCode}
              </p>
            )}
            <button
              onClick={() => setQrModal(null)}
              className="w-full py-2.5 rounded-lg bg-[#21262d] text-gray-300 hover:bg-[#30363d]"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {logsModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setLogsModal(null)}
        >
          <div
            className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              سجلات الحوادث — {logsModal.officeName}
            </h3>
            <div className="flex-1 overflow-auto space-y-2">
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 py-2 px-3 rounded-lg bg-[#161b22] text-sm"
                  >
                    <span className="text-gray-300">{log.eventType}</span>
                    <span
                      className={`text-xs ${
                        log.severity === "critical"
                          ? "text-red-400"
                          : log.severity === "warning"
                            ? "text-yellow-400"
                            : "text-gray-500"
                      }`}
                    >
                      {log.severity}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(log.createdAt).toLocaleString("ar-SA")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">لا توجد حوادث مسجّلة.</p>
              )}
            </div>
            <button
              onClick={() => setLogsModal(null)}
              className="mt-4 w-full py-2.5 rounded-lg bg-[#21262d] text-gray-300 hover:bg-[#30363d]"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
