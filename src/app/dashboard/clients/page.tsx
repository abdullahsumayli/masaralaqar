'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const clients = [
  { id: 1, name: 'محمد أحمد العتيبي', phone: '0501234567', email: 'mohammed@email.com', status: 'جاد', interest: 'شقة في الملقا', source: 'واتساب', date: '15 فبراير 2026', value: '850,000 ريال' },
  { id: 2, name: 'سارة علي المطيري', phone: '0559876543', email: 'sara@email.com', status: 'متابعة', interest: 'فيلا في النرجس', source: 'الموقع', date: '14 فبراير 2026', value: '2,500,000 ريال' },
  { id: 3, name: 'فهد خالد السبيعي', phone: '0541112233', email: 'fahad@email.com', status: 'جديد', interest: 'أرض تجارية', source: 'إعلان', date: '14 فبراير 2026', value: '5,000,000 ريال' },
  { id: 4, name: 'نورة محمد الدوسري', phone: '0567778899', email: 'noura@email.com', status: 'جاد', interest: 'دوبلكس في الياسمين', source: 'واتساب', date: '13 فبراير 2026', value: '1,200,000 ريال' },
  { id: 5, name: 'عبدالرحمن سعد', phone: '0533445566', email: 'abdulrahman@email.com', status: 'بارد', interest: 'شقة مفروشة', source: 'الموقع', date: '12 فبراير 2026', value: '450,000 ريال' },
  { id: 6, name: 'ريم عبدالله', phone: '0544556677', email: 'reem@email.com', status: 'مغلق', interest: 'فيلا في حطين', source: 'إحالة', date: '10 فبراير 2026', value: '3,200,000 ريال' },
  { id: 7, name: 'أحمد فيصل الشمري', phone: '0522334455', email: 'ahmed@email.com', status: 'متابعة', interest: 'مكتب تجاري', source: 'واتساب', date: '9 فبراير 2026', value: '750,000 ريال' },
  { id: 8, name: 'منى سالم القحطاني', phone: '0566778899', email: 'mona@email.com', status: 'جاد', interest: 'شقة في العليا', source: 'الموقع', date: '8 فبراير 2026', value: '950,000 ريال' },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'جاد': return 'bg-green-500/10 text-green-500 border-green-500/20'
    case 'متابعة': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    case 'جديد': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'بارد': return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    case 'مغلق': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
}

export default function ClientsPage() {
  const [selectedClients, setSelectedClients] = useState<number[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  const toggleClient = (id: number) => {
    setSelectedClients(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedClients(prev => 
      prev.length === clients.length ? [] : clients.map(c => c.id)
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">إدارة العملاء</h1>
          <p className="text-text-secondary mt-1">إدارة ومتابعة جميع العملاء المحتملين</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة عميل
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'إجمالي العملاء', value: '1,245', color: 'text-text-primary' },
          { label: 'عملاء جادين', value: '312', color: 'text-green-500' },
          { label: 'قيد المتابعة', value: '156', color: 'text-yellow-500' },
          { label: 'عملاء جدد', value: '89', color: 'text-blue-500' },
          { label: 'صفقات مغلقة', value: '45', color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-text-muted text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-surface border border-border rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="ابحث بالاسم، الهاتف، أو البريد..."
              className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary">
              <option value="">جميع الحالات</option>
              <option value="جاد">جاد</option>
              <option value="متابعة">متابعة</option>
              <option value="جديد">جديد</option>
              <option value="بارد">بارد</option>
              <option value="مغلق">مغلق</option>
            </select>
            <select className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary">
              <option value="">جميع المصادر</option>
              <option value="واتساب">واتساب</option>
              <option value="الموقع">الموقع</option>
              <option value="إعلان">إعلان</option>
              <option value="إحالة">إحالة</option>
            </select>
            <button className="bg-background border border-border rounded-xl px-4 py-2.5 text-text-secondary hover:text-primary hover:border-primary transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              فلترة متقدمة
            </button>
            <button className="bg-background border border-border rounded-xl px-4 py-2.5 text-text-secondary hover:text-primary hover:border-primary transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-right px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedClients.length === clients.length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary"
                  />
                </th>
                <th className="text-right px-6 py-4 text-xs font-medium text-text-muted">العميل</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-text-muted">الاهتمام</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-text-muted">القيمة المتوقعة</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-text-muted">المصدر</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-text-muted">الحالة</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-text-muted">التاريخ</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-text-muted">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-border/50 hover:bg-background/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => toggleClient(client.id)}
                      className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm">{client.name}</p>
                        <p className="text-text-muted text-xs">{client.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">{client.interest}</td>
                  <td className="px-6 py-4 text-text-primary text-sm font-medium">{client.value}</td>
                  <td className="px-6 py-4 text-text-secondary text-sm">{client.source}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted text-sm">{client.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="w-8 h-8 rounded-lg hover:bg-green-500/10 text-text-secondary hover:text-green-500 flex items-center justify-center transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-blue-500/10 text-text-secondary hover:text-blue-500 flex items-center justify-center transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary flex items-center justify-center transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-yellow-500/10 text-text-secondary hover:text-yellow-500 flex items-center justify-center transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-500 flex items-center justify-center transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-text-muted text-sm">
            عرض 1-8 من 1,245 عميل
          </p>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center">1</button>
            <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors">2</button>
            <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors">3</button>
            <span className="text-text-muted">...</span>
            <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors">156</button>
            <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary">إضافة عميل جديد</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center text-text-secondary"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                    placeholder="أدخل اسم العميل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  placeholder="example@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">الاهتمام</label>
                  <input
                    type="text"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                    placeholder="نوع العقار المطلوب"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">المصدر</label>
                  <select className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary">
                    <option>واتساب</option>
                    <option>الموقع</option>
                    <option>إعلان</option>
                    <option>إحالة</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">ملاحظات</label>
                <textarea
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary resize-none"
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-border flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 border border-border rounded-xl text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
              >
                إلغاء
              </button>
              <button className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors">
                حفظ العميل
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
