"use client";

import {
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

export default function AdminWhatsAppMonitorPage() {
  const [rows, setRows] = useState<MonitorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [reconnecting, setReconnecting] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ instance: string; qr: string; pairingCode?: string } | null>(null);
  const [logsModal, setLogsModal] = useState<{ officeId: string; officeName: string } | null>(null);
  const [logs, setLogs] = useState<Array<{ eventType: string; createdAt: string; needsManualIntervention: boolean }>>([]);

  const fetchMonitor = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/whatsapp-monitor");
      const json = await res.json();
      if (json.success && json.data) setRows(json.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitor();
    const id = setInterval(fetchMonitor, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchMonitor]);

  const handleReconnect = async (instanceName: string) => {
    setReconnecting(instanceName);
    try {
      const res = await fetch("/api/admin/whatsapp-monitor/reconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceName }),
      });
      const json = await res.json();
      if (json.success) {
        if (json.alreadyConnected) {
          alert("المثيل متصل بالفعل");
        } else {
          alert("تم طلب رمز QR جديد. يمكن للمكتب مسح الرمز من صفحة ربط الواتساب.");
        }
        fetchMonitor();
      } else {
        alert(json.error || "فشل في إعادة الربط");
      }
    } catch {
      alert("حدث خطأ أثناء إعادة الربط");
    } finally {
      setReconnecting(null);
    }
  };

  const handleViewQr = async (instanceName: string) => {
    try {
      const res = await fetch(
        `/api/admin/whatsapp-monitor/qr?instance=${encodeURIComponent(instanceName)}`,
      );
      const json = await res.json();
      if (json.success) {
        setQrModal({
          instance: instanceName,
          qr: json.qr || "",
          pairingCode: json.pairingCode,
        });
      } else {
        alert(json.error || "فشل في جلب رمز QR");
      }
    } catch {
      alert("حدث خطأ أثناء جلب رمز QR");
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
          json.data.map((i: { eventType: string; createdAt: string; needsManualIntervention: boolean }) => ({
            eventType: i.eventType,
            createdAt: i.createdAt,
            needsManualIntervention: i.needsManualIntervention,
          })),
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">
            مراقبة واتساب
          </h1>
          <p className="text-gray-400 mt-1">
            حالة الاتصال والحوادث — يتم التحديث كل 10 ثوانٍ
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchMonitor();
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

      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
        {loading && rows.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
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
                  return (
                    <tr
                      key={row.officeId}
                      className="border-b border-[#21262d]/50 hover:bg-[#161b22] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">
                            {row.officeName}
                          </span>
                          {row.needsManualIntervention && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400"
                              title="يحتاج تدخل يدوي"
                            >
                              <AlertCircle className="w-3 h-3" />
                              تدخل
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5 font-mono" dir="ltr">
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
                          ? new Date(row.lastActivity).toLocaleString("ar-SA", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            row.failureCount > 0 ? "text-red-400" : "text-gray-400"
                          }`}
                        >
                          {row.failureCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReconnect(row.instanceName)}
                            disabled={reconnecting === row.instanceName}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium disabled:opacity-50"
                          >
                            {reconnecting === row.instanceName ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                            إعادة ربط
                          </button>
                          <button
                            onClick={() => handleViewQr(row.instanceName)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] text-gray-300 hover:bg-[#30363d] text-xs font-medium"
                          >
                            <QrCode className="w-3 h-3" />
                            عرض QR
                          </button>
                          <button
                            onClick={() =>
                              handleViewLogs(row.officeId, row.officeName)
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] text-gray-300 hover:bg-[#30363d] text-xs font-medium"
                          >
                            <ScrollText className="w-3 h-3" />
                            السجلات
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
              <p className="text-gray-400 text-sm mb-4 font-mono" dir="ltr">
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
                    <span className="text-gray-500 text-xs">
                      {new Date(log.createdAt).toLocaleString("ar-SA")}
                    </span>
                    {log.needsManualIntervention && (
                      <span className="text-red-400 text-xs">تدخل مطلوب</span>
                    )}
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
