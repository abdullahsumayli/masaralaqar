'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  Users,
  ChevronRight,
  Loader2,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  MessageSquare,
  RefreshCw,
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  status: string
  source: string
  location_interest?: string
  budget?: number
  property_type_interest?: string
  last_contacted_at?: string
  created_at: string
  message: string
}

const statusConfig: Record<string, { label: string; color: string }> = {
  new:         { label: 'جديد',       color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  contacted:   { label: 'تم التواصل', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  interested:  { label: 'مهتم',       color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  negotiating: { label: 'تفاوض',      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  converted:   { label: 'تحوّل',      color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  lost:        { label: 'مفقود',      color: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const allStatuses = ['الكل', 'new', 'contacted', 'interested', 'negotiating', 'converted', 'lost']

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `منذ ${mins} دقيقة`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `منذ ${hours} ساعة`
  const days = Math.floor(hours / 24)
  return `منذ ${days} يوم`
}

export default function ClientsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('الكل')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads/list')
      const data = await res.json() as { success: boolean; leads: Lead[] }
      if (data.success) setLeads(data.leads)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) fetchLeads()
  }, [user, fetchLeads])

  const updateStatus = async (leadId: string, status: string) => {
    setUpdatingId(leadId)
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l))
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = filterStatus === 'الكل'
    ? leads
    : leads.filter(l => l.status === filterStatus)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/dashboard" className="text-text-secondary hover:text-primary transition-colors">
                لوحة التحكم
              </Link>
              <ChevronRight className="w-4 h-4 text-text-muted" />
              <span className="text-text-primary font-medium">العملاء</span>
            </div>
            <button
              onClick={fetchLeads}
              className="p-2 text-text-secondary hover:text-primary transition-colors"
              title="تحديث"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Title + stats */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">العملاء</h1>
            <p className="text-text-secondary text-sm mt-1">
              {leads.length} عميل إجمالاً
            </p>
          </div>
          <Link
            href="/dashboard/messages"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <MessageSquare className="w-4 h-4" />
            عرض المحادثات
          </Link>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {allStatuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                filterStatus === s
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background text-text-secondary border-border hover:border-primary/50'
              }`}
            >
              {s === 'الكل' ? 'الكل' : statusConfig[s]?.label}
              {s !== 'الكل' && (
                <span className="mr-1 text-xs opacity-70">
                  ({leads.filter(l => l.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <p className="text-text-secondary">
              {filterStatus === 'الكل' ? 'لا يوجد عملاء بعد' : 'لا يوجد عملاء بهذا الوضع'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map(lead => (
              <div
                key={lead.id}
                className="bg-background rounded-xl border border-border p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">
                        {lead.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary truncate">{lead.name}</p>
                      <div className="flex items-center gap-1 text-text-muted text-xs mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span dir="ltr">{lead.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status selector */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {updatingId === lead.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <select
                        value={lead.status}
                        onChange={e => updateStatus(lead.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border font-medium cursor-pointer bg-transparent ${statusConfig[lead.status]?.color}`}
                      >
                        {Object.entries(statusConfig).map(([val, { label }]) => (
                          <option key={val} value={val} className="bg-background text-text-primary">
                            {label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Details row */}
                <div className="flex flex-wrap gap-3 mt-3">
                  {lead.location_interest && (
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                      <MapPin className="w-3 h-3 text-primary" />
                      {lead.location_interest}
                    </span>
                  )}
                  {lead.budget && (
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                      <DollarSign className="w-3 h-3 text-primary" />
                      {lead.budget.toLocaleString('ar-SA')} ريال
                    </span>
                  )}
                  {lead.property_type_interest && (
                    <span className="text-xs text-text-secondary bg-surface px-2 py-0.5 rounded-full border border-border">
                      {lead.property_type_interest}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-text-muted mr-auto">
                    <Clock className="w-3 h-3" />
                    {lead.last_contacted_at ? timeAgo(lead.last_contacted_at) : timeAgo(lead.created_at)}
                  </span>
                </div>

                {/* Last message preview */}
                {lead.message && (
                  <p className="mt-2 text-xs text-text-muted line-clamp-1 border-t border-border pt-2">
                    {lead.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
