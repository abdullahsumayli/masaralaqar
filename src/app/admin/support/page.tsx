'use client'

import { useState } from 'react'
import { 
  Search, 
  Plus, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Tag,
  ChevronLeft
} from 'lucide-react'

const tickets = [
  { 
    id: 'TKT-001',
    subject: 'مشكلة في ربط الواتساب', 
    client: 'مكتب دار الإعمار',
    priority: 'high',
    status: 'open',
    category: 'technical',
    createdAt: '2024-03-10 09:30',
    lastReply: '2024-03-10 14:15',
    messages: 5
  },
  { 
    id: 'TKT-002',
    subject: 'استفسار عن تجديد الاشتراك', 
    client: 'عقارات المستقبل',
    priority: 'medium',
    status: 'pending',
    category: 'billing',
    createdAt: '2024-03-09 16:00',
    lastReply: '2024-03-09 16:45',
    messages: 3
  },
  { 
    id: 'TKT-003',
    subject: 'طلب إضافة مستخدمين جدد', 
    client: 'شركة البناء الذهبي',
    priority: 'low',
    status: 'open',
    category: 'account',
    createdAt: '2024-03-09 11:20',
    lastReply: '2024-03-09 12:00',
    messages: 2
  },
  { 
    id: 'TKT-004',
    subject: 'البوت لا يرد على الرسائل', 
    client: 'مجموعة الدار العقارية',
    priority: 'high',
    status: 'in-progress',
    category: 'technical',
    createdAt: '2024-03-08 08:00',
    lastReply: '2024-03-10 10:30',
    messages: 8
  },
  { 
    id: 'TKT-005',
    subject: 'شكر وتقدير على الخدمة', 
    client: 'مؤسسة الأفق العقاري',
    priority: 'low',
    status: 'closed',
    category: 'general',
    createdAt: '2024-03-07 14:00',
    lastReply: '2024-03-07 14:30',
    messages: 2
  },
]

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
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.includes(searchQuery) || ticket.client.includes(searchQuery)
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">الدعم الفني</h1>
          <p className="text-gray-400 mt-1">إدارة تذاكر الدعم والاستفسارات</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <p className="text-gray-400 text-sm">إجمالي التذاكر</p>
          <p className="text-2xl font-bold text-white mt-1">٢٤٥</p>
        </div>
        <div className="bg-[#0D1117] border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">مفتوحة</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">٧</p>
        </div>
        <div className="bg-[#0D1117] border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">قيد المعالجة</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">٤</p>
        </div>
        <div className="bg-[#0D1117] border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">متوسط وقت الرد</p>
          <p className="text-2xl font-bold text-green-500 mt-1">٢ ساعة</p>
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

      {/* Tickets List */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
        <div className="divide-y divide-[#21262d]">
          {filteredTickets.map((ticket) => {
            const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig]
            const status = statusConfig[ticket.status as keyof typeof statusConfig]
            const category = categoryConfig[ticket.category as keyof typeof categoryConfig]
            const StatusIcon = status.icon

            return (
              <div 
                key={ticket.id}
                className="p-5 hover:bg-[#161b22] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-500 text-sm font-mono">{ticket.id}</span>
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
                        {ticket.createdAt}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        {ticket.messages} رسائل
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
    </div>
  )
}
