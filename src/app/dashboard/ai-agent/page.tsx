"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Bot,
    Clock,
    Globe,
    Loader2,
    MessageSquare,
    Save,
    Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AIAgentData {
  id: string;
  office_id: string;
  agent_name: string;
  greeting_message: string;
  office_description: string;
  tone: string;
  language: string;
  working_hours: { start: string; end: string; timezone: string } | null;
  custom_instructions: string;
  is_active: boolean;
}

const toneOptions = [
  { value: "professional", label: "رسمي ومهني", desc: "ردود رسمية ومحترفة" },
  { value: "friendly", label: "ودود ومرحب", desc: "ردود دافئة وقريبة" },
  { value: "casual", label: "عفوي وبسيط", desc: "ردود بسيطة وعفوية" },
  {
    value: "formal",
    label: "رسمي جداً",
    desc: "ردود رسمية بصيغة احترافية عالية",
  },
];

const languageOptions = [
  { value: "ar", label: "العربية فقط" },
  { value: "en", label: "الإنجليزية فقط" },
  { value: "both", label: "العربية والإنجليزية" },
  { value: "auto", label: "تلقائي (حسب لغة العميل)" },
];

export default function DashboardAIAgentPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [agent, setAgent] = useState<AIAgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    agent_name: "",
    greeting_message: "",
    office_description: "",
    tone: "professional",
    language: "ar",
    working_hours_start: "09:00",
    working_hours_end: "18:00",
    custom_instructions: "",
    is_active: true,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAgent();
    }
  }, [isAuthenticated]);

  const loadAgent = async () => {
    try {
      const res = await fetch("/api/ai-agents");
      if (res.ok) {
        const data = await res.json();
        if (data.agent) {
          setAgent(data.agent);
          setForm({
            agent_name: data.agent.agent_name || "",
            greeting_message: data.agent.greeting_message || "",
            office_description: data.agent.office_description || "",
            tone: data.agent.tone || "professional",
            language: data.agent.language || "ar",
            working_hours_start: data.agent.working_hours?.start || "09:00",
            working_hours_end: data.agent.working_hours?.end || "18:00",
            custom_instructions: data.agent.custom_instructions || "",
            is_active: data.agent.is_active ?? true,
          });
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const body = {
        agent_name: form.agent_name,
        greeting_message: form.greeting_message,
        office_description: form.office_description,
        tone: form.tone,
        language: form.language,
        working_hours: {
          start: form.working_hours_start,
          end: form.working_hours_end,
          timezone: "Asia/Riyadh",
        },
        custom_instructions: form.custom_instructions,
        is_active: form.is_active,
      };
      const res = await fetch("/api/ai-agents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4F8EF7]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      {/* Header */}
      <div className="border-b border-[#1E293B] bg-[#0D1526]">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-[#4F8EF7]/10 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#4F8EF7]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-cairo">
                مساعد الذكاء الاصطناعي
              </h1>
              <p className="text-gray-400 text-sm">
                تخصيص شخصية وسلوك مساعد AI الخاص بمكتبك
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {!agent && (
          <div className="bg-[#111E35] border border-[#4F8EF7]/20 rounded-2xl p-6 text-center">
            <Bot className="w-12 h-12 text-[#4F8EF7] mx-auto mb-3" />
            <p className="text-gray-300">
              لم يتم إعداد مساعد AI بعد. يتم إنشاؤه تلقائياً عند تسجيل المكتب.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              تأكد من تشغيل Migration 019 وربط حسابك بمكتب.
            </p>
          </div>
        )}

        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111E35] border border-[#1E293B] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="w-5 h-5 text-[#E5B84A]" />
            <h2 className="text-lg font-bold">الهوية والشخصية</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                اسم المساعد
              </label>
              <input
                value={form.agent_name}
                onChange={(e) =>
                  setForm({ ...form, agent_name: e.target.value })
                }
                placeholder="مثال: مساعد مكتب النخبة"
                className="w-full bg-[#070B14] border border-[#1E293B] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                رسالة الترحيب
              </label>
              <textarea
                value={form.greeting_message}
                onChange={(e) =>
                  setForm({ ...form, greeting_message: e.target.value })
                }
                placeholder="رسالة الترحيب التي يبدأ بها المساعد عند أول تواصل..."
                rows={3}
                className="w-full bg-[#070B14] border border-[#1E293B] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                وصف المكتب
              </label>
              <textarea
                value={form.office_description}
                onChange={(e) =>
                  setForm({ ...form, office_description: e.target.value })
                }
                placeholder="وصف مختصر عن المكتب ونوع العقارات المتخصص فيها..."
                rows={2}
                className="w-full bg-[#070B14] border border-[#1E293B] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7] transition-colors resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Tone & Language */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111E35] border border-[#1E293B] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <MessageSquare className="w-5 h-5 text-[#4F8EF7]" />
            <h2 className="text-lg font-bold">أسلوب المحادثة</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                نبرة الردود
              </label>
              <div className="space-y-2">
                {toneOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${form.tone === opt.value ? "border-[#4F8EF7] bg-[#4F8EF7]/5" : "border-[#1E293B] hover:border-[#4F8EF7]/30"}`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={opt.value}
                      checked={form.tone === opt.value}
                      onChange={(e) =>
                        setForm({ ...form, tone: e.target.value })
                      }
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.tone === opt.value ? "border-[#4F8EF7]" : "border-gray-600"}`}
                    >
                      {form.tone === opt.value && (
                        <div className="w-2 h-2 bg-[#4F8EF7] rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm">{opt.label}</p>
                      <p className="text-gray-500 text-xs">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                <Globe className="w-4 h-4 inline ml-1" />
                لغة الردود
              </label>
              <div className="space-y-2">
                {languageOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${form.language === opt.value ? "border-[#4F8EF7] bg-[#4F8EF7]/5" : "border-[#1E293B] hover:border-[#4F8EF7]/30"}`}
                  >
                    <input
                      type="radio"
                      name="language"
                      value={opt.value}
                      checked={form.language === opt.value}
                      onChange={(e) =>
                        setForm({ ...form, language: e.target.value })
                      }
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.language === opt.value ? "border-[#4F8EF7]" : "border-gray-600"}`}
                    >
                      {form.language === opt.value && (
                        <div className="w-2 h-2 bg-[#4F8EF7] rounded-full" />
                      )}
                    </div>
                    <p className="text-white text-sm">{opt.label}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Working Hours */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111E35] border border-[#1E293B] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Clock className="w-5 h-5 text-[#E5B84A]" />
            <h2 className="text-lg font-bold">ساعات العمل</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                بداية الدوام
              </label>
              <input
                type="time"
                value={form.working_hours_start}
                onChange={(e) =>
                  setForm({ ...form, working_hours_start: e.target.value })
                }
                className="w-full bg-[#070B14] border border-[#1E293B] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                نهاية الدوام
              </label>
              <input
                type="time"
                value={form.working_hours_end}
                onChange={(e) =>
                  setForm({ ...form, working_hours_end: e.target.value })
                }
                className="w-full bg-[#070B14] border border-[#1E293B] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7]"
              />
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            المنطقة الزمنية: توقيت الرياض (GMT+3)
          </p>
        </motion.div>

        {/* Custom Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111E35] border border-[#1E293B] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Bot className="w-5 h-5 text-[#4F8EF7]" />
            <h2 className="text-lg font-bold">تعليمات مخصصة</h2>
          </div>
          <textarea
            value={form.custom_instructions}
            onChange={(e) =>
              setForm({ ...form, custom_instructions: e.target.value })
            }
            placeholder="أضف تعليمات خاصة للمساعد... مثال: لا ترد على أسئلة خارج نطاق العقارات، أذكر دائماً رقم الهاتف للتواصل..."
            rows={4}
            className="w-full bg-[#070B14] border border-[#1E293B] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7] transition-colors resize-none"
          />
        </motion.div>

        {/* Active Toggle & Save */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`w-12 h-6 rounded-full transition-colors relative ${form.is_active ? "bg-[#4F8EF7]" : "bg-gray-600"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_active ? "right-0.5" : "right-[26px]"}`}
              />
            </div>
            <span className="text-sm text-gray-300">
              {form.is_active ? "المساعد مفعّل" : "المساعد معطّل"}
            </span>
          </label>
          <button
            onClick={handleSave}
            disabled={saving || !agent}
            className="flex items-center gap-2 px-6 py-3 bg-[#4F8EF7] text-white rounded-xl hover:bg-[#4F8EF7]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saved ? "تم الحفظ ✓" : "حفظ التغييرات"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
