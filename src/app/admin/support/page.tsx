'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Tag,
  ChevronLeft,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SupportTicket {
  id: string
  ticket_number: string
  subject: string
  client: string
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'pending' | 'closed'
  category: 'technical' | 'billing' | 'account' | 'general'
  message_count: number
  last_reply_at: string
  created_at: string
}

const priorityConfig = {
  high: { label: 'عاجل', color: 'bg-red-500/10 text-red-500' },
  medium: { label: 'متوسط', color: 'bg-yellow-500/10 text-yellow-500' },
  low: { label: 'منخفض', color: 'bg-gray-500/10 text-gray-400' },
}

const statusConfig = {
  open: { label: 'مفتوحة', color: 'bg-blue-500/10 text-blue-500', icon: AlertCircle },
  'in-progress': { label: 'قيد المعالجة', color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
  pending: { label: 'بانتظار الرد', color: 'bg-purple-500/10 text-purple-500', icon: Clock },
  closed: { label: 'مغلقة', color: 'bg-green-500/10 text-green-500', icon: CheckCircle },
}

const categoryConfig = {
  technical: { label: 'تقني', color: 'text-blue-400' },
  billing: { label: 'فوترة', color: 'text-green-400' },
  account: { label: 'حساب', color: 'text-purple-400' },
  general: { label: 'عام', color: 'text-gray-400' },
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTickets(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.includes(searchQuery) || ticket.client.includes(searchQuery)
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">الدعم الفني</h1>
          <p className="text-gray-400 mt-1">إدارة تذاكر الدعم والاستفسارات</p>
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
          <p className="text-gray-400 text-sm">إجمالي التذاكر</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#0D1117] border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">مفتوحة</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{stats.open}</p>
        </div>
        <div className="bg-[#0D1117] border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">قيد المعالجة</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-[#0D1117] border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">مغلقة</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{stats.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث في التذاكر..."
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
          <option value="open">مفتوحة</option>
          <option value="in-progress">قيد المعالجة</option>
          <option value="pending">بانتظار الرد</option>
          <option value="closed">مغلقة</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
        >
          <option value="all">جميع الأولويات</option>
          <option value="high">عاجل</option>
          <option value="medium">متوسط</option>
          <option value="low">منخفض</option>
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
      {!loading && filteredTickets.length === 0 && (
        <div className="text-center py-16 bg-[#0D1117] border border-[#21262d] rounded-2xl">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">لا توجد تذاكر</p>
        </div>
      )}

      {/* Tickets List */}
      {!loading && filteredTickets.length > 0 && (
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
          <div className="divide-y divide-[#21262d]">
            {filteredTickets.map((ticket) => {
              const priority = priorityConfig[ticket.priority]
              const status = statusConfig[ticket.status]
              const category = categoryConfig[ticket.category]
              const StatusIcon = status.icon

              return (
                <div
                  key={ticket.id}
                  className="p-5 hover:bg-[#161b22] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-gray-500 text-sm font-mono">{ticket.ticket_number}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.color}`}>
                          {priority.label}
                        </span>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      <h3 className="font-medium text-white mb-2">{ticket.subject}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <User className="w-4 h-4" />
                          {ticket.client}
                        </span>
                        <span className={`flex items-center gap-1.5 ${category.color}`}>
                          <Tag className="w-4 h-4" />
                          {category.label}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(ticket.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <MessageSquare className="w-4 h-4" />
                          {ticket.message_count} رسائل
                        </span>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
