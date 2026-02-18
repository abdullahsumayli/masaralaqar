'use client'

import { useState } from 'react'
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Filter,
  Download,
  Users,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone
} from 'lucide-react'

const subscribers = [
  { 
    id: 1,
    name: 'مكتب دار الإعمار', 
    email: 'info@dar-alemar.sa',
    phone: '+966501234567',
    plan: 'الاحترافية', 
    price: '1,200 ر.س',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    status: 'active',
    agents: 5,
    messages: 15420
  },
  { 
    id: 2,
    name: 'عقارات المستقبل', 
    email: 'contact@future-realestate.sa',
    phone: '+966559876543',
    plan: 'الأساسية', 
    price: '600 ر.س',
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    status: 'active',
    agents: 2,
    messages: 8340
  },
  { 
    id: 3,
    name: 'شركة البناء الذهبي', 
    email: 'info@golden-build.sa',
    phone: '+966541112233',
    plan: 'الاحترافية', 
    price: '1,200 ر.س',
    startDate: '2024-01-20',
    endDate: '2025-01-20',
    status: 'active',
    agents: 8,
    messages: 24560
  },
  { 
    id: 4,
    name: 'مؤسسة الأفق العقاري', 
    email: 'hello@ofuq.sa',
    phone: '+966532221144',
    plan: 'تجربة مجانية', 
    price: '0 ر.س',
    startDate: '2024-03-01',
    endDate: '2024-03-14',
    status: 'trial',
    agents: 1,
    messages: 156
  },
  { 
    id: 5,
    name: 'مجموعة الدار العقارية', 
    email: 'dar@aldar-group.sa',
    phone: '+966555667788',
    plan: 'الاحترافية', 
    price: '1,200 ر.س',
    startDate: '2023-12-01',
    endDate: '2024-12-01',
    status: 'active',
    agents: 12,
    messages: 45230
  },
  { 
    id: 6,
    name: 'عقارات الرياض الحديثة', 
    email: 'info@riyadh-modern.sa',
    phone: '+966567890123',
    plan: 'الأساسية', 
    price: '600 ر.س',
    startDate: '2024-02-15',
    endDate: '2024-02-14',
    status: 'expired',
    agents: 3,
    messages: 12450
  },
]

export default function SubscribersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.name.includes(searchQuery) || sub.email.includes(searchQuery)
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">المشتركين</h1>
          <p className="text-gray-400 mt-1">إدارة جميع المشتركين في نظام صقر</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all">
          <Plus className="w-5 h-5" />
          إضافة مشترك
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <p className="text-gray-400 text-sm">إجمالي المشتركين</p>
          <p className="text-2xl font-bold text-white mt-1">٤٨</p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <p className="text-gray-400 text-sm">المشتركين النشطين</p>
          <p className="text-2xl font-bold text-green-500 mt-1">٤٢</p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <p className="text-gray-400 text-sm">فترات التجربة</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">٤</p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <p className="text-gray-400 text-sm">منتهية الصلاحية</p>
          <p className="text-2xl font-bold text-red-500 mt-1">٢</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="ابحث عن مشترك..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#161b22] border border-[#21262d] rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors w-64"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="trial">تجربة</option>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#21262d]">
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">المشترك</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">الباقة</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">الحالة</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">الوكلاء</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">الرسائل</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">تاريخ الانتهاء</th>
                <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-b border-[#21262d]/50 hover:bg-[#161b22] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-orange-600/20 flex items-center justify-center">
                        <span className="text-primary font-bold">{subscriber.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{subscriber.name}</p>
                        <p className="text-gray-500 text-sm">{subscriber.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white">{subscriber.plan}</p>
                      <p className="text-gray-500 text-sm">{subscriber.price}/شهر</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      subscriber.status === 'active' 
                        ? 'bg-green-500/10 text-green-500' 
                        : subscriber.status === 'trial'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {subscriber.status === 'active' ? 'نشط' : subscriber.status === 'trial' ? 'تجربة' : 'منتهي'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">{subscriber.agents}</td>
                  <td className="px-6 py-4 text-white">{subscriber.messages.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-400">{subscriber.endDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-[#21262d]">
          <p className="text-gray-400 text-sm">عرض ٦ من أصل ٤٨ مشترك</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-[#161b22] border border-[#21262d] rounded-lg text-gray-400 text-sm hover:text-white transition-colors">
              السابق
            </button>
            <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1.5 bg-[#161b22] border border-[#21262d] rounded-lg text-gray-400 text-sm hover:text-white transition-colors">2</button>
            <button className="px-3 py-1.5 bg-[#161b22] border border-[#21262d] rounded-lg text-gray-400 text-sm hover:text-white transition-colors">3</button>
            <button className="px-3 py-1.5 bg-[#161b22] border border-[#21262d] rounded-lg text-gray-400 text-sm hover:text-white transition-colors">
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
