"use client";

import {
  Check,
  CreditCard,
  Edit2,
  Loader2,
  Plus,
  Save,
  X,
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

const EMPTY_NEW: Omit<Plan, "id" | "isActive" | "features"> = {
  name: "",
  nameAr: "",
  maxProperties: 10,
  maxAiMessages: 100,
  maxWhatsappMessages: 500,
  price: 0,
};

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Plan>>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlan, setNewPlan] = useState({ ...EMPTY_NEW });
  const [savingNew, setSavingNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then((data) => setPlans(data.plans || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const startEdit = (plan: Plan) => {
    setEditingId(plan.id);
    setEditForm({ ...plan });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/plans/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل في الحفظ");
      setPlans((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...editForm } as Plan : p))
      );
      setEditingId(null);
      setEditForm({});
      showToast("تم حفظ التغييرات ✓");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSavingEdit(false);
    }
  };

  const saveNew = async () => {
    if (!newPlan.name) { showToast("اسم الباقة مطلوب"); return; }
    setSavingNew(true);
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlan),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل في الإضافة");
      if (data.plan) setPlans((prev) => [...prev, data.plan]);
      setNewPlan({ ...EMPTY_NEW });
      setShowAdd(false);
      showToast("تم إضافة الباقة ✓");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSavingNew(false);
    }
  };

  const formatLimit = (val: number) =>
    val === -1 ? "غير محدود" : val.toLocaleString();

  const inputClass =
    "bg-[#161b22] border border-[#21262d] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-primary w-full";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#0D1117] border border-primary/30 text-white rounded-xl shadow-xl text-sm">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">إدارة الباقات</h1>
          <p className="text-gray-400 mt-1">إدارة باقات الاشتراك والأسعار</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة باقة
        </button>
      </div>

      {/* Add Plan Form */}
      {showAdd && (
        <div className="bg-[#0D1117] border border-primary/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">باقة جديدة</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">اسم (إنجليزي) *</label>
              <input value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })} placeholder="basic" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">اسم (عربي)</label>
              <input value={newPlan.nameAr} onChange={(e) => setNewPlan({ ...newPlan, nameAr: e.target.value })} placeholder="أساسي" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">السعر (ر.س)</label>
              <input type="number" value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">حد العقارات (-1 = غير محدود)</label>
              <input type="number" value={newPlan.maxProperties} onChange={(e) => setNewPlan({ ...newPlan, maxProperties: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">حد رسائل AI</label>
              <input type="number" value={newPlan.maxAiMessages} onChange={(e) => setNewPlan({ ...newPlan, maxAiMessages: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">حد رسائل واتساب</label>
              <input type="number" value={newPlan.maxWhatsappMessages} onChange={(e) => setNewPlan({ ...newPlan, maxWhatsappMessages: Number(e.target.value) })} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">إلغاء</button>
            <button
              onClick={saveNew}
              disabled={savingNew}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {savingNew ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
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
                {["الباقة", "السعر", "العقارات", "رسائل AI", "رسائل واتساب", "الحالة", "إجراءات"].map((h) => (
                  <th key={h} className="text-right text-gray-400 text-sm font-medium px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => {
                const isEditing = editingId === plan.id;
                return (
                  <tr key={plan.id} className={`border-b border-[#21262d]/50 transition-colors ${isEditing ? "bg-[#161b22]" : "hover:bg-[#161b22]"}`}>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <div className="space-y-1">
                          <input value={editForm.nameAr || ""} onChange={(e) => setEditForm({ ...editForm, nameAr: e.target.value })} placeholder="الاسم العربي" className={inputClass} />
                          <input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="الاسم الإنجليزي" className={inputClass} />
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-white">{plan.nameAr || plan.name}</p>
                          <p className="text-gray-500 text-xs">{plan.name}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <input type="number" value={editForm.price ?? plan.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} className={inputClass + " w-24"} />
                      ) : (
                        <span className="text-white font-medium">{plan.price.toLocaleString()} ر.س</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <input type="number" value={editForm.maxProperties ?? plan.maxProperties} onChange={(e) => setEditForm({ ...editForm, maxProperties: Number(e.target.value) })} className={inputClass + " w-24"} />
                      ) : (
                        <span className="text-gray-300">{formatLimit(plan.maxProperties)}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <input type="number" value={editForm.maxAiMessages ?? plan.maxAiMessages} onChange={(e) => setEditForm({ ...editForm, maxAiMessages: Number(e.target.value) })} className={inputClass + " w-24"} />
                      ) : (
                        <span className="text-gray-300">{formatLimit(plan.maxAiMessages)}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <input type="number" value={editForm.maxWhatsappMessages ?? plan.maxWhatsappMessages} onChange={(e) => setEditForm({ ...editForm, maxWhatsappMessages: Number(e.target.value) })} className={inputClass + " w-24"} />
                      ) : (
                        <span className="text-gray-300">{formatLimit(plan.maxWhatsappMessages)}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <button
                          onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${editForm.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                        >
                          {editForm.isActive ? "مفعّلة" : "معطّلة"}
                        </button>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${plan.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                          {plan.isActive ? "مفعّلة" : "معطّلة"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button onClick={saveEdit} disabled={savingEdit} className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50">
                            {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          </button>
                          <button onClick={cancelEdit} disabled={savingEdit} className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(plan)} className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">لا توجد باقات. قم بتشغيل Migration لإنشاء الباقات الافتراضية.</p>
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
