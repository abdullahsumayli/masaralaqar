"use client";

import {
    CreditCard,
    Edit2,
    Loader2,
    Plus
} from "lucide-react";
import { useEffect, useState } from "react";

interface Plan {
  id: string;
  name: string;
  nameAr: string;
  maxProperties: number;
  maxAiMessages: number;
  maxWhatsappMessages: number;
  price: number;
  features: string[];
  isActive: boolean;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Plan>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    nameAr: "",
    maxProperties: 10,
    maxAiMessages: 100,
    maxWhatsappMessages: 500,
    price: 0,
  });

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then((data) => setPlans(data.plans || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (plan: Plan) => {
    setEditingId(plan.id);
    setEditForm(plan);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const formatLimit = (val: number) =>
    val === -1 ? "غير محدود" : val.toLocaleString();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">
            إدارة الباقات
          </h1>
          <p className="text-gray-400 mt-1">إدارة باقات الاشتراك والأسعار</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة باقة</span>
        </button>
      </div>

      {/* Add Plan Form */}
      {showAdd && (
        <div className="bg-[#0D1117] border border-primary/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">باقة جديدة</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input
              placeholder="اسم الباقة (إنجليزي)"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
            />
            <input
              placeholder="اسم الباقة (عربي)"
              value={newPlan.nameAr}
              onChange={(e) =>
                setNewPlan({ ...newPlan, nameAr: e.target.value })
              }
              className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="السعر"
              value={newPlan.price}
              onChange={(e) =>
                setNewPlan({ ...newPlan, price: Number(e.target.value) })
              }
              className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="حد العقارات"
              value={newPlan.maxProperties}
              onChange={(e) =>
                setNewPlan({
                  ...newPlan,
                  maxProperties: Number(e.target.value),
                })
              }
              className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="حد رسائل AI"
              value={newPlan.maxAiMessages}
              onChange={(e) =>
                setNewPlan({
                  ...newPlan,
                  maxAiMessages: Number(e.target.value),
                })
              }
              className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="حد رسائل واتساب"
              value={newPlan.maxWhatsappMessages}
              onChange={(e) =>
                setNewPlan({
                  ...newPlan,
                  maxWhatsappMessages: Number(e.target.value),
                })
              }
              className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              إلغاء
            </button>
            <button className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
              حفظ
            </button>
          </div>
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#21262d]">
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  الباقة
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  السعر
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  العقارات
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  رسائل AI
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  رسائل واتساب
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  الحالة
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-b border-[#21262d]/50 hover:bg-[#161b22] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">
                        {plan.nameAr || plan.name}
                      </p>
                      <p className="text-gray-500 text-xs">{plan.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {plan.price.toLocaleString()} ر.س
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {formatLimit(plan.maxProperties)}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {formatLimit(plan.maxAiMessages)}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {formatLimit(plan.maxWhatsappMessages)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${plan.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                    >
                      {plan.isActive ? "مفعّلة" : "معطّلة"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => startEdit(plan)}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">
                      لا توجد باقات. قم بتشغيل Migration 019 لإنشاء الباقات
                      الافتراضية.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
