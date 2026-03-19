"use client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Loader2,
  Phone,
  QrCode,
  RefreshCw,
  Smartphone,
  Trash2,
  Wifi,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ───────────────────────────────────────────────────────
type OnboardingStep =
  | "loading"
  | "disconnected"
  | "creating"
  | "qr"
  | "connected";

interface SessionData {
  phoneNumber: string;
  sessionStatus: string;
  instanceId: string | null;
  lastConnectedAt: string | null;
}

// ── Constants ───────────────────────────────────────────────────
const POLL_INTERVAL_MS = 3000;
const QR_EXPIRY_MS = 45_000;

// ── Page ────────────────────────────────────────────────────────
export default function WhatsAppPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState<OnboardingStep>("loading");
  const [session, setSession] = useState<SessionData | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [qrExpired, setQrExpired] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [testMessageSent, setTestMessageSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qrTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Auth redirect ─────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  // ── Initial load ──────────────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp/connect");
      if (!res.ok) return;
      const data = await res.json();
      const isConnected =
        data.evolutionStatus === "connected" ||
        data.session?.sessionStatus === "connected";
      if (data.session) setSession(data.session);
      setStep(isConnected ? "connected" : "disconnected");
    } catch {
      setStep("disconnected");
    }
  }, []);

  useEffect(() => {
    if (user) fetchStatus();
  }, [user, fetchStatus]);

  // ── Cleanup ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (qrTimerRef.current) clearTimeout(qrTimerRef.current);
    };
  }, []);

  // ── Polling ───────────────────────────────────────────────────
  function startPolling() {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/whatsapp/connect");
        if (!res.ok) return;
        const data = await res.json();
        const isConnected =
          data.evolutionStatus === "connected" ||
          data.session?.sessionStatus === "connected";
        if (isConnected) {
          if (data.session) setSession(data.session);
          setStep("connected");
          stopPolling();
          clearQrTimer();
          setQrCode(null);
          setPairingCode(null);
          setQrExpired(false);
          sendTestMessage();
        }
      } catch {
        // Transient — keep polling
      }
    }, POLL_INTERVAL_MS);
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  // ── QR expiry timer ───────────────────────────────────────────
  function startQrTimer() {
    clearQrTimer();
    qrTimerRef.current = setTimeout(() => {
      setQrExpired(true);
    }, QR_EXPIRY_MS);
  }

  function clearQrTimer() {
    if (qrTimerRef.current) {
      clearTimeout(qrTimerRef.current);
      qrTimerRef.current = null;
    }
  }

  // ── Send test message after connection ────────────────────────
  async function sendTestMessage() {
    try {
      await fetch("/api/whatsapp/test-message", { method: "POST" });
      setTestMessageSent(true);
    } catch {
      // Non-critical
    }
  }

  // ── Connect handler ───────────────────────────────────────────
  const handleConnect = async () => {
    if (phoneNumber.trim() && !/^05\d{8}$/.test(phoneNumber.trim())) {
      setPhoneError("رقم الواتساب يجب أن يكون 10 أرقام ويبدأ بـ 05");
      return;
    }
    setError("");
    setQrCode(null);
    setPairingCode(null);
    setQrExpired(false);
    setStep("creating");
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
        setError(
          data.message ||
            data.error ||
            "جاري تجهيز الاتصال... حاول مرة أخرى خلال ثواني",
        );
        setStep("disconnected");
        return;
      }
      if (data.qr || data.pairingCode) {
        setQrCode(data.qr || null);
        setPairingCode(data.pairingCode || null);
        if (data.session) setSession(data.session);
        setStep("qr");
        startPolling();
        startQrTimer();
      } else {
        setError(
          "لم يتم استلام QR — تحقق من إعدادات السيرفر",
        );
        setStep("disconnected");
      }
    } catch {
      setError("حدث خطأ أثناء الربط");
      setStep("disconnected");
    } finally {
      setSaving(false);
    }
  };

  // ── Refresh QR ────────────────────────────────────────────────
  const handleRefreshQR = async () => {
    setSaving(true);
    setError("");
    setQrExpired(false);
    try {
      const res = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.qr || data.pairingCode) {
        setQrCode(data.qr || null);
        setPairingCode(data.pairingCode || null);
        startQrTimer();
        startPolling();
      } else {
        setError("جاري تجهيز الاتصال... حاول مرة أخرى خلال ثواني");
      }
    } catch {
      setError("فشل في تحديث QR");
    } finally {
      setSaving(false);
    }
  };

  // ── Disconnect ────────────────────────────────────────────────
  const handleDisconnect = async () => {
    if (!confirm("هل أنت متأكد من فصل الواتساب؟")) return;
    setDisconnecting(true);
    try {
      const res = await fetch("/api/whatsapp/connect", { method: "DELETE" });
      if (res.ok) {
        setSession(null);
        setQrCode(null);
        setPairingCode(null);
        setTestMessageSent(false);
        setStep("disconnected");
      }
    } catch {
      setError("فشل في فصل الواتساب");
    } finally {
      setDisconnecting(false);
    }
  };

  // ── Auth loading ──────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-surface">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <AnimatePresence mode="wait">
          {/* ─── LOADING ─────────────────────────────────────── */}
          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </motion.div>
          )}

          {/* ─── CREATING INSTANCE ────────────────────────────── */}
          {step === "creating" && (
            <motion.div
              key="creating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
              <p className="text-text-primary font-medium">
                جاري إنشاء الاتصال...
              </p>
              <p className="text-text-muted text-sm">
                يرجى الانتظار بضع ثوانٍ
              </p>
            </motion.div>
          )}

          {/* ─── DISCONNECTED (Connect Form) ──────────────────── */}
          {step === "disconnected" && (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header card */}
              <div className="bg-background rounded-xl border border-border p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-7 h-7 fill-[#25D366]"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">
                      ربط واتساب المكتب
                    </h2>
                    <p className="text-text-secondary text-sm">
                      اربط رقم الواتساب الخاص بمكتبك لتفعيل الرد الآلي الذكي
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Phone number input */}
                  <div>
                    <label
                      htmlFor="wa-phone"
                      className="block text-text-primary text-sm mb-2 font-medium"
                    >
                      رقم الواتساب{" "}
                      <span className="text-text-muted text-xs">
                        (اختياري)
                      </span>
                    </label>
                    <input
                      id="wa-phone"
                      type="tel"
                      dir="ltr"
                      inputMode="numeric"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""));
                        if (phoneError) setPhoneError(null);
                      }}
                      placeholder="05XXXXXXXX"
                      className={`w-full bg-surface border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none transition-colors ${
                        phoneError
                          ? "border-red-500 focus:border-red-400"
                          : "border-border focus:border-primary"
                      }`}
                    />
                    {phoneError ? (
                      <p className="text-red-400 text-xs mt-1">{phoneError}</p>
                    ) : (
                      <p className="text-text-muted text-xs mt-1">
                        أدخل رقمك لحفظه، أو تخطّ هذا الحقل وامسح QR مباشرة
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleConnect}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white rounded-xl hover:bg-[#25D366]/90 transition-colors font-medium text-base disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <QrCode className="w-5 h-5" />
                    )}
                    ربط واتساب
                  </button>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-background rounded-xl border border-border p-6">
                <h3 className="text-text-primary font-medium text-sm mb-4">
                  كيف يتم الربط؟
                </h3>
                <ol className="space-y-3 text-text-secondary text-sm">
                  {[
                    'اضغط "ربط واتساب" أعلاه',
                    "افتح واتساب في جوالك",
                    "ادخل على الأجهزة المرتبطة",
                    "امسح رمز QR الذي سيظهر",
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                  <li className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>يتم الربط تلقائياً وتفعيل الرد الذكي</span>
                  </li>
                </ol>
              </div>
            </motion.div>
          )}

          {/* ─── QR CODE ──────────────────────────────────────── */}
          {step === "qr" && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              <div className="bg-background rounded-xl border border-border p-6">
                <div className="text-center space-y-5">
                  {/* Title */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-bold text-text-primary">
                        امسح رمز QR
                      </h2>
                    </div>
                    <p className="text-text-secondary text-sm max-w-sm mx-auto">
                      افتح واتساب على جوالك ← الإعدادات ← الأجهزة المرتبطة ←
                      ربط جهاز
                    </p>
                  </div>

                  {/* QR image */}
                  {qrCode && !qrExpired && (
                    <div className="flex justify-center py-2">
                      <div className="bg-white p-5 rounded-2xl shadow-lg shadow-black/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrCode}
                          alt="WhatsApp QR Code"
                          className="w-60 h-60 sm:w-64 sm:h-64"
                        />
                      </div>
                    </div>
                  )}

                  {/* Pairing code */}
                  {pairingCode && !qrExpired && (
                    <div className="bg-surface rounded-xl border border-border p-4 max-w-xs mx-auto">
                      <p className="text-text-muted text-xs mb-1.5">
                        أو استخدم رمز الربط:
                      </p>
                      <p
                        className="text-text-primary font-mono text-2xl font-bold tracking-[0.2em]"
                        dir="ltr"
                      >
                        {pairingCode}
                      </p>
                    </div>
                  )}

                  {/* QR expired */}
                  {qrExpired && (
                    <div className="py-6 space-y-3">
                      <p className="text-yellow-400 font-medium">
                        انتهت صلاحية الرمز
                      </p>
                      <p className="text-text-muted text-sm">
                        اضغط تحديث للحصول على رمز جديد
                      </p>
                    </div>
                  )}

                  {/* Refresh button */}
                  <button
                    onClick={handleRefreshQR}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary/30 transition-colors text-sm disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    تحديث الرمز
                  </button>
                </div>
              </div>

              {/* Polling indicator */}
              {!qrExpired && (
                <div className="flex items-center justify-center gap-2 text-yellow-400">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-sm">بانتظار مسح QR Code...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── CONNECTED ────────────────────────────────────── */}
          {step === "connected" && (
            <motion.div
              key="connected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Success header */}
              <div className="bg-background rounded-xl border border-[#25D366]/20 p-6">
                <div className="text-center space-y-4 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-16 h-16 mx-auto rounded-full bg-[#25D366]/10 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 text-[#25D366]" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold text-[#25D366]">
                      تم الربط بنجاح
                    </h2>
                    <p className="text-text-secondary text-sm">
                      الواتساب مربوط ويستقبل الرسائل
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Connection status */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                    <Wifi className="w-5 h-5 text-[#25D366]" />
                    <div className="flex-1">
                      <p className="text-text-primary font-medium text-sm">
                        حالة الاتصال
                      </p>
                      <p className="text-[#25D366] text-xs">متصل</p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                  </div>

                  {/* Phone number */}
                  {session?.phoneNumber && session.phoneNumber !== "pending" && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-text-muted text-xs">
                          رقم الواتساب
                        </p>
                        <p className="text-text-primary font-medium" dir="ltr">
                          +{session.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Last connected */}
                  {session?.lastConnectedAt && (
                    <p className="text-text-muted text-xs text-center pt-2">
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

                  {/* Test message indicator */}
                  {testMessageSent && (
                    <div className="bg-[#25D366]/5 border border-[#25D366]/10 rounded-lg p-3 text-center">
                      <p className="text-[#25D366] text-xs">
                        تم إرسال رسالة تأكيد الربط على واتساب
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={fetchStatus}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-background border border-border text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  تحديث الحالة
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm disabled:opacity-50"
                >
                  {disconnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  فصل
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
