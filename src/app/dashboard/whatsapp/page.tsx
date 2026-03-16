"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
    Check,
    Loader2,
    Phone,
    QrCode,
    RefreshCw,
    Trash2,
    Wifi,
    WifiOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface WhatsAppSession {
  id: string;
  phoneNumber: string;
  sessionStatus: "connected" | "disconnected" | "pending" | "expired";
  instanceId: string | null;
  apiToken: string | null;
  webhookUrl: string | null;
  lastConnectedAt: string | null;
  createdAt: string;
}

export default function WhatsAppPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [session, setSession] = useState<WhatsAppSession | null>(null);
  const [evolutionStatus, setEvolutionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/whatsapp/connect");
      const data = await res.json();
      if (!res.ok && data.error) {
        setError(data.error);
        return;
      }
      if (data.session) setSession(data.session);
      if (data.evolutionStatus) setEvolutionStatus(data.evolutionStatus);
    } catch {
      // Network error — stay quiet, user can still try connecting
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchSession();
  }, [user, fetchSession]);

  // Stop polling when connected
  useEffect(() => {
    if (
      evolutionStatus === "connected" ||
      session?.sessionStatus === "connected"
    ) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      setQrCode(null);
      setPairingCode(null);
      setSuccess("تم ربط الواتساب بنجاح! ✅");
    }
  }, [evolutionStatus, session?.sessionStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleConnect = async () => {
    // Phone validation (only if provided)
    if (phoneNumber.trim()) {
      if (!/^05\d{8}$/.test(phoneNumber.trim())) {
        setPhoneError("رقم الواتساب يجب أن يكون 10 أرقام ويبدأ بـ 05");
        return;
      }
    }

    setError("");
    setSuccess("");
    setQrCode(null);
    setPairingCode(null);

    setSaving(true);
    try {
      const res = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل في ربط الواتساب");
        return;
      }

      if (data.qr || data.pairingCode) {
        setQrCode(data.qr || null);
        setPairingCode(data.pairingCode || null);
        if (data.session) setSession(data.session);

        // Start polling for connection status
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(async () => {
          try {
            const statusRes = await fetch("/api/whatsapp/connect");
            const statusData = await statusRes.json();
            if (statusData.session) setSession(statusData.session);
            if (statusData.evolutionStatus) {
              setEvolutionStatus(statusData.evolutionStatus);
            }
          } catch {
            // ignore
          }
        }, 5000);
      } else {
        setError("لم يتم استلام QR أو رمز الربط — تحقق من Evolution API وإعدادات السيرفر (EVOLUTION_API_KEY)");
      }
    } catch {
      setError("حدث خطأ أثناء الربط");
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshQR = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() || undefined }),
      });
      const data = await res.json();
      if (data.qr || data.pairingCode) {
        setQrCode(data.qr || null);
        setPairingCode(data.pairingCode || null);
      } else {
        setError("لم يتم استلام QR أو رمز الربط");
      }
    } catch {
      setError("فشل في تحديث QR / رمز الربط");
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("هل أنت متأكد من فصل الواتساب؟")) return;

    setDisconnecting(true);
    try {
      const res = await fetch("/api/whatsapp/connect", { method: "DELETE" });
      if (res.ok) {
        setSession(null);
        setEvolutionStatus(null);
        setQrCode(null);
        setPairingCode(null);
        setSuccess("تم فصل الواتساب بنجاح");
      }
    } catch {
      setError("فشل في فصل الواتساب");
    } finally {
      setDisconnecting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isConnected =
    evolutionStatus === "connected" || session?.sessionStatus === "connected";

  return (
    <div className="min-h-full bg-surface">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isConnected ? (
          <>
            {/* Connected State */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text-primary">
                  حالة الاتصال
                </h2>
                <button
                  onClick={fetchSession}
                  className="p-2 rounded-lg hover:bg-surface transition-colors text-text-secondary"
                  title="تحديث"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                  <Wifi className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="font-bold text-lg text-green-400">متصل</p>
                    <p className="text-text-muted text-sm">
                      الواتساب مربوط ويستقبل الرسائل
                    </p>
                  </div>
                </div>

                {session?.phoneNumber && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-text-muted text-xs">رقم الواتساب</p>
                      <p className="text-text-primary font-medium" dir="ltr">
                        +{session.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}

                {session?.lastConnectedAt && (
                  <p className="text-text-muted text-xs text-center">
                    آخر اتصال:{" "}
                    {new Date(session.lastConnectedAt).toLocaleDateString(
                      "ar-SA",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                )}

                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {disconnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  فصل الواتساب
                </button>
              </div>
            </motion.div>

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm text-center">
                {success}
              </div>
            )}
          </>
        ) : (qrCode || pairingCode) ? (
          <>
            {/* QR Code Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-xl border border-border p-6"
            >
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <QrCode className="w-6 h-6 text-primary" />
                  <h2 className="text-lg font-bold text-text-primary">
                    امسح QR Code
                  </h2>
                </div>
                <p className="text-text-secondary text-sm">
                  افتح تطبيق واتساب على جوالك ← الإعدادات ← الأجهزة المرتبطة ←
                  ربط جهاز ← امسح الرمز أدناه
                </p>

                {/* QR Image (if Evolution returns base64) */}
                {qrCode && (
                  <div className="flex justify-center py-4">
                    <div className="bg-white p-4 rounded-2xl shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCode}
                        alt="WhatsApp QR Code"
                        className="w-64 h-64"
                      />
                    </div>
                  </div>
                )}

                {/* Pairing code (Evolution v2 may return only this) */}
                {pairingCode && (
                  <div className="bg-surface rounded-xl border border-border p-4 text-center">
                    <p className="text-text-muted text-sm mb-2">أو استخدم رمز الربط:</p>
                    <p className="text-text-primary font-mono text-xl font-bold tracking-widest" dir="ltr">
                      {pairingCode}
                    </p>
                    <p className="text-text-muted text-xs mt-2">
                      واتساب ← الإعدادات ← الأجهزة المرتبطة ← ربط جهاز ← ربط برقم الهاتف ← أدخل الرمز أعلاه
                    </p>
                  </div>
                )}

                <p className="text-text-muted text-xs">
                  {qrCode ? "يتم التحقق تلقائياً بعد المسح..." : "بعد إدخال الرمز سيتم الربط تلقائياً."}
                </p>

                {/* Refresh QR */}
                <button
                  onClick={handleRefreshQR}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-primary transition-colors text-sm disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  تحديث QR / رمز الربط
                </button>
              </div>
            </motion.div>

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-sm">بانتظار مسح QR Code...</span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Connect Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-xl border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    ربط الواتساب
                  </h2>
                  <p className="text-text-secondary text-sm">
                    اربط رقم الواتساب الخاص بمكتبك لتفعيل الرد الآلي الذكي
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Phone Number (optional) */}
                <div>
                  <label
                    htmlFor="whatsapp-number"
                    className="block text-text-primary text-sm mb-2 font-medium"
                  >
                    رقم الواتساب{" "}
                    <span className="text-text-muted text-xs">(اختياري)</span>
                  </label>
                  <input
                    id="whatsapp-number"
                    name="whatsapp"
                    type="tel"
                    dir="ltr"
                    inputMode="numeric"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                      setPhoneNumber(onlyNums);
                      if (phoneError) setPhoneError(null);
                    }}
                    placeholder="05XXXXXXXX"
                    className={`w-full bg-surface border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none transition-colors ${
                      phoneError ? "border-red-500 focus:border-red-400" : "border-border focus:border-primary"
                    }`}
                  />
                  {phoneError ? (
                    <p className="text-red-400 text-xs mt-1">{phoneError}</p>
                  ) : (
                    <p className="text-text-muted text-xs mt-1">
                      يمكنك إدخال رقمك لحفظه، أو تخطي هذا الحقل ومسح QR مباشرة
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
                    {success}
                  </div>
                )}

                <button
                  onClick={handleConnect}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#25D366]/90 transition-colors font-medium disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <QrCode className="w-5 h-5" />
                  )}
                  إنشاء QR Code للربط
                </button>
              </div>
            </motion.div>

            {/* How it works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-background rounded-xl border border-border p-6"
            >
              <h3 className="text-text-primary font-medium text-sm mb-3">
                كيف يعمل الربط؟
              </h3>
              <ol className="space-y-2 text-text-secondary text-sm">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    1
                  </span>
                  <span>اضغط على "إنشاء QR Code للربط" أعلاه</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    2
                  </span>
                  <span>
                    افتح واتساب على جوالك ← الإعدادات ← الأجهزة المرتبطة
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    3
                  </span>
                  <span>اضغط "ربط جهاز" وامسح الـ QR Code</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>سيتم الربط تلقائياً وتفعيل الرد الذكي</span>
                </li>
              </ol>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
