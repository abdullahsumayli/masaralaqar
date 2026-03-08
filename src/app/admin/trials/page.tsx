'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Building2,
  User,
  Calendar,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface TrialRequest {
  id: string
  office_name: string
  contact_name: string
  email: string | null
  phone: string
  city: string | null
  employees: string | null
  status: 'pending' | 'contacted' | 'approved' | 'rejected'
  notes: string | null
  created_at: string
  updated_at: string
}

const statusConfig = {
  pending: { label: 'بانتظار المراجعة', color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
  contacted: { label: 'تم التواصل', color: 'bg-blue-500/10 text-blue-500', icon: Phone },
  approved: { label: 'تمت الموافقة', color: 'bg-green-500/10 text-green-500', icon: CheckCircle },
  rejected: { label: 'مرفوض', color: 'bg-red-500/10 text-red-500', icon: XCircle },
}

export default function TrialsPage() {
  const [trials, setTrials] = useState<TrialRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('trial_requests')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTrials(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: TrialRequest['status']) => {
    setUpdatingId(id)
    const { error } = await supabase
      .from('trial_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) {
      setTrials(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    }
    setUpdatingId(null)
  }

  const filteredTrials = trials.filter(trial => {
    const matchesSearch = trial.office_name.includes(searchQuery) || trial.contact_name.includes(searchQuery)
    const matchesFilter = filterStatus === 'all' || trial.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: trials.length,
    pending: trials.filter(t => t.status === 'pending').length,
    approved: trials.filter(t => t.status === 'approved').length,
    conversionRate: trials.length > 0
      ? Math.round((trials.filter(t => t.status === 'approved').length / trials.length) * 100)
      : 0,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">طلبات التجربة</h1>
          <p className="text-gray-400 mt-1">مراجعة وإدارة طلبات التجربة المجانية</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border border-[#21262d] text-gray-400 rounded-xl hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <p className="text-gray-400 text-sm">إجمالي الطلبات</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#0D1117] border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">بانتظار المراجعة</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-[#0D1117] border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">تمت الموافقة</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-[#0D1117] border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">معدل التحويل</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{stats.conversionRate}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث عن طلب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
        >
          <option value="all">جميع الحالات</option>
          <option value="pending">بانتظار المراجعة</option>
          <option value="contacted">تم التواصل</option>
          <option value="approved">تمت الموافقة</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredTrials.length === 0 && (
        <div className="text-center py-16 bg-[#0D1117] border border-[#21262d] rounded-2xl">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">لا توجد طلبات</p>
        </div>
      )}

      {/* Trials Grid */}
      {!loading && filteredTrials.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTrials.map((trial) => {
            const status = statusConfig[trial.status]
            const StatusIcon = status.icon
            const isUpdating = updatingId === trial.id

            return (
              <div
                key={trial.id}
                className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-5 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-600/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{trial.office_name}</h3>
                      <p className="text-gray-400 text-sm">{trial.city}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{trial.contact_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400" dir="ltr">{trial.phone}</span>
                  </div>
                  {trial.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">{trial.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">
                      {new Date(trial.created_at).toLocaleDateString('ar-SA', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {trial.notes && (
                  <div className="p-3 bg-[#161b22] rounded-xl mb-4">
                    <p className="text-gray-400 text-sm">{trial.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {trial.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(trial.id, 'contacted')}
                        disabled={isUpdating}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      >
                        <Phone className="w-4 h-4" />
                        التواصل
                      </button>
                      <button
                        onClick={() => updateStatus(trial.id, 'approved')}
                        disabled={isUpdating}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        موافقة
                      </button>
                      <button
                        onClick={() => updateStatus(trial.id, 'rejected')}
                        disabled={isUpdating}
                        className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {trial.status === 'contacted' && (
                    <>
                      <button
                        onClick={() => updateStatus(trial.id, 'approved')}
                        disabled={isUpdating}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        موافقة
                      </button>
                      <button
                        onClick={() => updateStatus(trial.id, 'rejected')}
                        disabled={isUpdating}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#161b22] hover:bg-[#21262d] text-gray-400 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      >
                        <MessageSquare className="w-4 h-4" />
                        متابعة
                      </button>
                    </>
                  )}
                  {(trial.status === 'approved' || trial.status === 'rejected') && (
                    <button
                      onClick={() => updateStatus(trial.id, 'pending')}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#161b22] hover:bg-[#21262d] text-gray-400 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    >
                      إعادة تعيين
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
