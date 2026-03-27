"use client";

import { resetPassword } from "@/lib/auth";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Loader2,
  Mail,
} from "lucide-react";
import { MqLogo } from "@/components/mq/MqLogo";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("الرجاء إدخال بريدك الإلكتروني");
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await resetPassword(email.trim());
      if (resetError) throw new Error(resetError);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] flex flex-col">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between p-5 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark">
            <MqLogo onPrimary className="h-[72%] w-[72%]" />
          </div>
          <span className="font-bold text-white hidden sm:block">MQ</span>
        </Link>
        <Link
          href="/login"
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <ArrowRight className="w-4 h-4" />
          العودة لتسجيل الدخول
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-8 shadow-2xl">

            {sent ? (
              /* Success state */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-xl font-bold text-white mb-3">تم الإرسال!</h1>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  أرسلنا رابط استعادة كلمة المرور إلى{" "}
                  <span className="text-white font-medium">{email}</span>
                  <br />
                  تحقق من بريدك وانقر على الرابط للمتابعة.
                </p>
                <p className="text-gray-600 text-xs mb-4">
                  لم يصل البريد؟ تحقق من مجلد الـ Spam
                </p>
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-light transition-colors text-sm"
                >
                  العودة لتسجيل الدخول
                </Link>
              </div>
            ) : (
              /* Form state */
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1.5">
                    نسيت كلمة المرور؟
                  </h1>
                  <p className="text-gray-400 text-sm">
                    أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 mb-5">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(null); }}
                        placeholder="you@example.com"
                        dir="ltr"
                        autoComplete="email"
                        autoFocus
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pr-10 pl-4 text-white placeholder-gray-600 focus:border-primary/60 focus:bg-[#1c2128] focus:outline-none transition-all text-sm"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال رابط الاستعادة"
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[#21262d] text-center">
                  <p className="text-gray-500 text-sm">
                    تذكرت كلمة المرور؟{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:text-primary-light transition-colors font-medium"
                    >
                      تسجيل الدخول
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
