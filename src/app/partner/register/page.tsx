"use client";

import { signUpPartner } from "@/lib/auth";
import {
  AlertCircle,
  ArrowRight,
  Handshake,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error("جميع الحقول المطلوبة يجب تعبئتها");
      }
      if (formData.password.length < 6) {
        throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error("كلمة المرور غير متطابقة");
      }

      const { user, error: signUpError } = await signUpPartner(
        formData.email,
        formData.password,
        formData.name
      );

      if (signUpError) throw new Error(signUpError);
      if (user) {
        router.push("/partner/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center justify-between p-5 max-w-7xl mx-auto w-full">
        <Link href="/partner/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Handshake className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white hidden sm:block">برنامج الشركاء</span>
        </Link>
        <Link
          href="/partner/login"
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          لديك حساب؟ سجّل دخولك
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-7">
              <h1 className="text-2xl font-bold text-white mb-1.5">إنشاء حساب شريك</h1>
              <p className="text-gray-400 text-sm">انضم لبرنامج الإحالة واكسب عمولة عند إحالة مكاتب عقارية</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 mb-5">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الاسم الكامل *</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="محمد أحمد"
                    autoComplete="name"
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pr-10 pl-4 text-white placeholder-gray-600 focus:border-primary/60 focus:bg-[#1c2128] focus:outline-none transition-all text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني *</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور *</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="6 أحرف على الأقل"
                    autoComplete="new-password"
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pr-10 pl-4 text-white placeholder-gray-600 focus:border-primary/60 focus:bg-[#1c2128] focus:outline-none transition-all text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">تأكيد كلمة المرور *</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full bg-[#161b22] border rounded-xl py-3 pr-10 pl-4 text-white placeholder-gray-600 focus:outline-none transition-all text-sm ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? "border-red-500/50"
                        : "border-[#30363d] focus:border-primary/60 focus:bg-[#1c2128]"
                    }`}
                    disabled={loading}
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1.5">كلمة المرور غير متطابقة</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  "إنشاء حساب شريك"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#21262d] text-center">
              <p className="text-gray-500 text-sm">
                لديك حساب بالفعل؟{" "}
                <Link href="/partner/login" className="text-primary hover:text-primary-light transition-colors font-medium">
                  سجّل دخولك
                </Link>
              </p>
              <p className="text-gray-600 text-xs mt-2">
                <Link href="/auth/signup" className="hover:text-gray-400 transition-colors">
                  إنشاء حساب مكتب عقاري ←
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
