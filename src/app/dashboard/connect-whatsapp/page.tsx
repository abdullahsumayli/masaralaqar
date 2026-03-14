"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

type Status = "idle" | "creating" | "waiting" | "connected" | "error";

export default function ConnectWhatsAppPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── 1. Create instance + fetch QR on mount ── */
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setStatus("creating");

        // Create instance (idempotent on Evolution side)
        const createRes = await fetch("/api/whatsapp/create", {
          method: "POST",
        });
        if (!createRes.ok) {
          const body = await createRes.json().catch(() => ({}));
          throw new Error(body.error || "فشل إنشاء الاتصال");
        }

        if (cancelled) return;

        // Fetch QR
        const qrRes = await fetch("/api/whatsapp/qr");
        const qrData = await qrRes.json();

        if (cancelled) return;

        const code =
          qrData?.data?.base64 || qrData?.data?.code || qrData?.data?.qrcode;
        if (code) {
          setQrValue(code);
          setStatus("waiting");
        } else {
          // QR not ready yet — Evolution server may need time to connect to WhatsApp
          setStatus("error");
          setErrorMsg(
            "لم يتم استلام QR — السيرفر في وضع الاتصال. أعد المحاولة بعد لحظات."
          );
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "خطأ غير متوقع");
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── 2. Poll status every 5 s while waiting ── */
  useEffect(() => {
    if (status !== "waiting") return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/whatsapp/status");
        const json = await res.json();
        const state =
          json?.data?.state ||
          json?.data?.instance?.state ||
          json?.data?.connectionState;

        if (state === "open") {
          setStatus("connected");
          setQrValue(null);
        }
      } catch {
        // ignore transient errors
      }
    }, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [status]);

  /* ── UI ── */
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-950 p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-8 text-center shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-white">ربط واتساب</h1>

        {/* Creating */}
        {status === "creating" && (
          <p className="animate-pulse text-gray-400">
            جاري إنشاء الاتصال...
          </p>
        )}

        {/* QR code */}
        {status === "waiting" && qrValue && (
          <>
            <div className="mx-auto mb-6 inline-block rounded-xl bg-white p-4">
              {qrValue.startsWith("data:image") ? (
                // base64 image from Evolution
                <img
                  src={qrValue}
                  alt="WhatsApp QR"
                  width={256}
                  height={256}
                />
              ) : (
                // Raw text — render via qrcode.react
                <QRCodeSVG value={qrValue} size={256} />
              )}
            </div>
            <p className="mb-2 text-sm leading-relaxed text-gray-300">
              امسح الكود من واتساب:
              <br />
              الإعدادات ← الأجهزة المرتبطة ← ربط جهاز
            </p>
            <p className="mt-4 animate-pulse text-xs text-gray-500">
              في انتظار المسح...
            </p>
          </>
        )}

        {/* Connected */}
        {status === "connected" && (
          <div className="py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <svg
                className="h-8 w-8 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-green-400">
              WhatsApp Connected ✅
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="py-4">
            <p className="mb-4 text-red-400">{errorMsg}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-white/10 px-6 py-2 text-sm text-white hover:bg-white/20"
            >
              إعادة المحاولة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
