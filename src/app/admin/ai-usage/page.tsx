'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertCircle, Loader2, Search } from 'lucide-react'

interface UsageStats {
  totalToday: number
  totalThisMonth: number
  topOffices: { officeName: string; count: number }[]
}

interface UsageLog {
  id: string
  office_id: string
  action_type: string
  count: number
  created_at: string
  office?: { name: string }
}

export default function AdminAIUsagePage() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [logs, setLogs] = useState<UsageLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'ai_message' | 'whatsapp_message' | 'property'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats({
        totalToday: data.todayAiMessages || 0,
        totalThisMonth: data.monthlyAiMessages || 0,
        topOffices: data.topOffices || [],
      })
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const actionLabels: Record<string, string> = {
    ai_message: 'رسالة ذكاء اصطناعي',
    whatsapp_message: 'رسالة واتساب',
    property: 'إضافة عقار',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-cairo">استهلاك الذكاء الاصطناعي</h1>
        <p className="text-gray-400 mt-1">مراقبة استخدام رسائل AI والحدود لكل مكتب</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <p className="text-gray-400 text-sm">رسائل AI اليوم</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.totalToday.toLocaleString() || 0}</p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-gray-400 text-sm">رسائل AI هذا الشهر</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.totalThisMonth.toLocaleString() || 0}</p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-gray-400 text-sm">أعلى المكاتب استخداماً</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.topOffices?.length || 0}</p>
        </div>
      </div>

      {/* Top Offices */}
      {stats?.topOffices && stats.topOffices.length > 0 && (
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4">أعلى المكاتب استخداماً</h3>
          <div className="space-y-3">
            {stats.topOffices.map((office, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">{idx + 1}</span>
                  <span className="text-white text-sm">{office.officeName}</span>
                </div>
                <span className="text-gray-400 text-sm">{office.count.toLocaleString()} رسالة</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'ai_message', label: 'رسائل AI' },
          { key: 'whatsapp_message', label: 'رسائل واتساب' },
          { key: 'property', label: 'عقارات' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              filter === tab.key
                ? 'bg-primary text-white'
                : 'bg-[#161b22] text-gray-400 hover:text-white border border-[#21262d]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-12 text-center">
        <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">سيتم عرض سجل الاستخدام المفصّل هنا بعد تشغيل Migration 019 وبدء استخدام النظام.</p>
        <p className="text-gray-500 text-sm mt-2">يتم تسجيل كل رسالة AI ورسالة واتساب وإضافة عقار تلقائياً.</p>
      </div>
    </div>
  )
}
