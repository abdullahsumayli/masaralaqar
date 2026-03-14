'use client'

import {
  Building2,
  Download,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface Subscriber {
  id: string
  officeName: string
  city: string | null
  email: string
  name: string
  plan: string
  subscriptionStatus: string
  endsAt: string | null
  properties: number
  leads: number
  createdAt: string
}

const PLAN_LABELS: Record<string, string> = {
  free: 'مجاني',
  basic: 'أساسي',
  pro: 'احترافي',
  enterprise: 'مؤسسات',
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-green-500/10 text-green-400',
  free: 'bg-gray-500/10 text-gray-400',
  expired: 'bg-red-500/10 text-red-400',
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(search && { search }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
      })
      const res = await fetch(`/api/admin/subscribers?${params}`)
      const data = await res.json()
      if (res.ok) {
        setSubscribers(data.subscribers || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [page, search, filterStatus])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  // Reset page on filter change
  useEffect(() => {
    setPage(1)
  }, [search, filterStatus])

  const activeSubs = subscribers.filter((s) => s.subscriptionStatus === 'active').length
  const paidSubs = subscribers.filter((s) => s.plan !== 'free').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">المشتركين</h1>
          <p className="text-gray-400 mt-1">
            إجمالي {total} مكتب مسجّل في المنصة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSubscribers}
            disabled={loading}
            className="p-2.5 bg-[#161b22] border border-[#21262d] text-gray-400 rounded-xl hover:text-white hover:border-primary transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all text-sm">
            <Plus className="w-4 h-4" />
            إضافة مكتب
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="إجمالي المكاتب" value={loading ? '...' : String(total)} />
        <StatCard label="مشتركون نشطون" value={loading ? '...' : String(activeSubs)} color="text-green-400" />
        <StatCard label="باقات مدفوعة" value={loading ? '...' : String(paidSubs)} color="text-primary" />
        <StatCard
          label="باقة مجانية"
          value={loading ? '...' : String(total - paidSubs)}
          color="text-gray-400"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="ابحث عن مكتب..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#161b22] border border-[#21262d] rounded-xl pr-9 pl-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="free">مجاني</option>
            <option value="expired">منتهي</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border border-[#21262d] text-gray-400 rounded-xl text-sm hover:text-white hover:border-primary transition-all">
          <Download className="w-4 h-4" />
          تصدير CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">لا توجد مكاتب مسجلة بعد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#21262d]">
                  {['المكتب', 'البريد', 'الباقة', 'الحالة', 'العقارات', 'العملاء', 'تاريخ الانتهاء'].map((h) => (
                    <th key={h} className="text-right px-5 py-4 text-gray-400 text-sm font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-[#21262d]/50 hover:bg-[#161b22] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">
                            {sub.officeName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{sub.officeName}</p>
                          <p className="text-gray-500 text-xs">{sub.city || 'غير محدد'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm">{sub.email || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="text-white text-sm font-medium">
                        {PLAN_LABELS[sub.plan] || sub.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          STATUS_STYLE[sub.subscriptionStatus] || STATUS_STYLE.free
                        }`}
                      >
                        {sub.subscriptionStatus === 'active' ? 'نشط' : sub.plan === 'free' ? 'مجاني' : 'منتهي'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-300 text-sm">{sub.properties}</td>
                    <td className="px-5 py-4 text-gray-300 text-sm">{sub.leads}</td>
                    <td className="px-5 py-4 text-gray-400 text-sm">
                      {sub.endsAt
                        ? new Date(sub.endsAt).toLocaleDateString('ar-SA')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#21262d]">
            <p className="text-gray-400 text-sm">
              صفحة {page} من {totalPages} — {total} مكتب
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-[#161b22] border border-[#21262d] rounded-lg text-gray-400 text-sm hover:text-white transition-colors disabled:opacity-40"
              >
                السابق
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = page <= 3 ? i + 1 : page - 2 + i
                if (pageNum > totalPages) return null
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      page === pageNum
                        ? 'bg-primary text-white'
                        : 'bg-[#161b22] border border-[#21262d] text-gray-400 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 bg-[#161b22] border border-[#21262d] rounded-lg text-gray-400 text-sm hover:text-white transition-colors disabled:opacity-40"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color = 'text-white',
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}
