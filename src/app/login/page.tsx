"use client";

import { getUserProfile, signIn } from "@/lib/auth";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("البريد الإلكتروني وكلمة المرور مطلوبة");
      }

      const { user, error: signInError } = await signIn(
        formData.email,
        formData.password,
      );

      if (signInError) throw new Error(signInError);
      if (user) {
        const profile = await getUserProfile(user.id);
        if (profile && (profile as any).onboarding_completed === false) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message);
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
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white hidden sm:block">
            مسار العقار
          </span>
        </Link>
        <Link
          href="/auth/signup"
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          إنشاء حساب جديد
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1.5">
                تسجيل الدخول
              </h1>
              <p className="text-gray-400 text-sm">
                سجّل دخولك للوصول إلى لوحة التحكم
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 mb-5">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    dir="ltr"
                    autoComplete="email"
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pr-10 pl-4 text-white placeholder-gray-600 focus:border-primary/60 focus:bg-[#1c2128] focus:outline-none transition-all text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    كلمة المرور
                  </label>
                  <Link
                    href="/auth/reset-password"
                    className="text-xs text-primary hover:text-primary-light transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pr-10 pl-10 text-white placeholder-gray-600 focus:border-primary/60 focus:bg-[#1c2128] focus:outline-none transition-all text-sm"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الدخول...
                  </>
                ) : (
                  "دخول"
                )}
              </button>
            </form>

            {/* Divider & signup */}
            <div className="mt-6 pt-6 border-t border-[#21262d] text-center">
              <p className="text-gray-500 text-sm">
                لا تملك حساباً؟{" "}
                <Link
                  href="/auth/signup"
                  className="text-primary hover:text-primary-light transition-colors font-medium"
                >
                  إنشاء حساب مجاني
                </Link>
              </p>
            </div>
          </div>

          {/* Trust */}
          <p className="text-center text-gray-600 text-xs mt-5">
            بتسجيل دخولك، أنت توافق على{" "}
            <Link
              href="/terms"
              className="hover:text-gray-400 transition-colors underline"
            >
              الشروط والأحكام
            </Link>{" "}
            و{" "}
            <Link
              href="/privacy"
              className="hover:text-gray-400 transition-colors underline"
            >
              سياسة الخصوصية
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
