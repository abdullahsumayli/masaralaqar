'use client'

import { useState } from 'react'
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
  Calendar
} from 'lucide-react'

const trials = [
  { 
    id: 1,
    officeName: 'مكتب النخبة العقاري', 
    contactName: 'محمد العتيبي',
    email: 'mohammed@elite-office.sa',
    phone: '+966545374069',
    city: 'الرياض',
    employees: '5-10',
    requestDate: '2024-03-10 14:30',
    status: 'pending',
    notes: 'مهتم بنظام صقر للرد على استفسارات العملاء'
  },
  { 
    id: 2,
    officeName: 'عقارات الرياض المتميزة', 
    contactName: 'سعود الدوسري',
    email: 'saud@riyadh-realestate.sa',
    phone: '+966559876543',
    city: 'الرياض',
    employees: '10-20',
    requestDate: '2024-03-10 11:15',
    status: 'pending',
    notes: 'يريد معرفة كيفية ربط النظام مع الواتساب'
  },
  { 
    id: 3,
    officeName: 'شركة الإتقان العقارية', 
    contactName: 'عبدالله الشمري',
    email: 'abdullah@etqan.sa',
    phone: '+966541112233',
    city: 'جدة',
    employees: '3-5',
    requestDate: '2024-03-09 16:45',
    status: 'contacted',
    notes: 'تم التواصل معه وأبدى اهتماماً كبيراً'
  },
  { 
    id: 4,
    officeName: 'مؤسسة الثقة العقارية', 
    contactName: 'خالد القحطاني',
    email: 'khalid@thiqah.sa',
    phone: '+966532221144',
    city: 'الدمام',
    employees: '5-10',
    requestDate: '2024-03-08 09:20',
    status: 'approved',
    notes: 'تمت الموافقة وبدأ فترة التجربة'
  },
  { 
    id: 5,
    officeName: 'عقارات الخليج', 
    contactName: 'أحمد الغامدي',
    email: 'ahmed@gulf.sa',
    phone: '+966555667788',
    city: 'الخبر',
    employees: '1-3',
    requestDate: '2024-03-07 13:00',
    status: 'rejected',
    notes: 'لا يتوافق مع معايير القبول'
  },
]

const statusConfig = {
  pending: { label: 'بانتظار المراجعة', color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
  contacted: { label: 'تم التواصل', color: 'bg-blue-500/10 text-blue-500', icon: Phone },
  approved: { label: 'تمت الموافقة', color: 'bg-green-500/10 text-green-500', icon: CheckCircle },
  rejected: { label: 'مرفوض', color: 'bg-red-500/10 text-red-500', icon: XCircle },
}

export default function TrialsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTrial, setSelectedTrial] = useState<typeof trials[0] | null>(null)

  const filteredTrials = trials.filter(trial => {
    const matchesSearch = trial.officeName.includes(searchQuery) || trial.contactName.includes(searchQuery)
    const matchesFilter = filterStatus === 'all' || trial.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">طلبات التجربة</h1>
          <p className="text-gray-400 mt-1">مراجعة وإدارة طلبات التجربة المجانية</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <p className="text-gray-400 text-sm">إجمالي الطلبات</p>
          <p className="text-2xl font-bold text-white mt-1">١٢٥</p>
        </div>
        <div className="bg-[#0D1117] border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">بانتظار المراجعة</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">١٢</p>
        </div>
        <div className="bg-[#0D1117] border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">تمت الموافقة</p>
          <p className="text-2xl font-bold text-green-500 mt-1">٩٨</p>
        </div>
        <div className="bg-[#0D1117] border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">معدل التحويل</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">٦٥%</p>
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

      {/* Trials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTrials.map((trial) => {
          const status = statusConfig[trial.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

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
                    <h3 className="font-bold text-white">{trial.officeName}</h3>
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
                  <span className="text-gray-400">{trial.contactName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400" dir="ltr">{trial.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">{trial.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">{trial.requestDate}</span>
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
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-all">
                      <Phone className="w-4 h-4" />
                      التواصل
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl text-sm font-medium transition-all">
                      <CheckCircle className="w-4 h-4" />
                      موافقة
                    </button>
                    <button className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-medium transition-all">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
                {trial.status === 'contacted' && (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl text-sm font-medium transition-all">
                      <CheckCircle className="w-4 h-4" />
                      موافقة
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#161b22] hover:bg-[#21262d] text-gray-400 rounded-xl text-sm font-medium transition-all">
                      <MessageSquare className="w-4 h-4" />
                      متابعة
                    </button>
                  </>
                )}
                {(trial.status === 'approved' || trial.status === 'rejected') && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#161b22] hover:bg-[#21262d] text-gray-400 rounded-xl text-sm font-medium transition-all">
                    عرض التفاصيل
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
